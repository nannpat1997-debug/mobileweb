import type { AccelSample, WorkoutState } from "./types";

/**
 * ArmWorkoutEngine
 * จัดการ Algorithm การนับรอบกายบริหารแขนแบบ Rule-based
 */
export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();
  private lastUpTime = 0;
  private lastRepTime = 0;
  private peak = 0;
  private valley = 0;
  private phase: "WAIT_UP" | "WAIT_DOWN" = "WAIT_UP";

  // State เริ่มต้นของแอป
  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
      lastMessage: '',
    },
  };

  /**
   * ลงทะเบียน Callback เมื่อ State เปลี่ยนแปลง
   */
  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  private emit() {
    const snap = this.clone();
    this.listeners.forEach((cb) => cb(snap));
  }

  private clone(): WorkoutState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * เริ่มต้นการทำงาน (Reset ค่าใหม่หมด)
   */
  start() {
    this.state = {
      status: "RUNNING",
      repDisplay: 0,
      stats: {
        repsTotal: 0,
        repsOk: 0,
        repsBad: 0,
        score: 0,
        avgRepMs: 0,
        lastMessage: 'READY',
      },
    };
    this.phase = "WAIT_UP";
    this.peak = 0;
    this.valley = 0;
    this.emit();
  }

  /**
   * หยุดการทำงาน
   */
  stop() {
    this.state.status = "STOPPED";
    this.emit();
  }

  /**
   * ประมวลผลข้อมูลจาก Sensor (Accelerometer)
   */
  process(sample: AccelSample) {
    if (this.state.status !== "RUNNING") return;

    const y = sample.ay; // แกนแนวตั้ง (Vertical)
    const side = Math.abs(sample.ax) + Math.abs(sample.az); // แรงเหวี่ยงออกด้านข้าง

    // --- เกณฑ์การตัดสิน (Thresholds) สามารถปรับจูนได้ตามเครื่องจริง ---
    const UP_TH = 2.0;      // แรงส่งตอนยกขึ้น
    const DOWN_TH = -1.5;   // แรงส่งตอนเอาลง
    const MIN_ROM = 3.5;    // ระยะการเคลื่อนไหวขั้นต่ำ (Range of Motion)
    const MIN_MS = 700;     // ห้ามยกเร็วกว่า 0.7 วินาที
    const MAX_MS = 4000;    // ห้ามยกช้ากว่า 4 วินาที
    const SIDE_TH = 5.0;    // เกณฑ์การแกว่งออกข้าง

    // Phase 1: รอจังหวะยกแขนขึ้น (WAIT_UP)
    if (this.phase === "WAIT_UP") {
      this.peak = Math.max(this.peak, y);
      if (y > UP_TH) {
        this.phase = "WAIT_DOWN";
        this.lastUpTime = sample.t;
      }
    } 
    // Phase 2: รอจังหวะลดแขนลง (WAIT_DOWN)
    else {
      this.valley = Math.min(this.valley, y);

      if (y < DOWN_TH) {
        const currentTime = sample.t;
        const repMs = currentTime - this.lastRepTime;
        
        // เริ่มคำนวณผลเมื่อครบ 1 รอบการเคลื่อนไหว (ขึ้นและลง)
        this.state.stats.repsTotal++;

        const rom = this.peak - this.valley;
        let isOk = true;
        let msg = "OK";

        // ตรวจสอบความถูกต้องตามกฎ (Rule-based)
        if (side > SIDE_TH) {
          isOk = false;
          msg = "กรุณายกแนวตั้ง";
        } else if (rom < MIN_ROM) {
          isOk = false;
          msg = "ยกแขนต่ำเกินไป";
        } else if (this.lastRepTime > 0 && repMs < MIN_MS) {
          isOk = false;
          msg = "เร็วเกินไป";
        } else if (this.lastRepTime > 0 && repMs > MAX_MS) {
          isOk = false;
          msg = "ช้าเกินไป";
        }

        // อัปเดตสถิติ
        if (isOk) {
          this.state.repDisplay++;
          this.state.stats.repsOk++;
          this.state.stats.score += 10; // เพิ่มคะแนนครั้งละ 10
          
          // คำนวณความเร็วเฉลี่ย (Moving Average)
          if (this.lastRepTime > 0) {
            this.state.stats.avgRepMs = this.state.stats.avgRepMs === 0 
              ? repMs 
              : Math.round((this.state.stats.avgRepMs + repMs) / 2);
          }
        } else {
          this.state.stats.repsBad++;
        }

        this.state.stats.lastMessage = msg;
        this.lastRepTime = currentTime;
        
        // Reset เพื่อรอรอบถัดไป
        this.phase = "WAIT_UP";
        this.peak = 0;
        this.valley = 0;
        this.emit();
      }
    }
  }
}