<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="ion-text-center">💪 Arm Workout Pro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding content-bg">
      <ion-card class="stat-card ion-text-center">
        <ion-card-header>
          <ion-card-subtitle>จำนวนครั้งที่ทำได้</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="card-body">
          <div class="display-number count-color">{{ state?.repDisplay ?? 0 }}</div>
        </ion-card-content>
      </ion-card>

      <div v-if="state?.stats.lastMessage" class="feedback-badge"
           :class="state.stats.lastMessage === 'OK' ? 'bg-success' : 'bg-warning'">
        {{ state.stats.lastMessage === 'OK' ? 'ยอดเยี่ยม!' : state.stats.lastMessage }}
      </div>

      <div class="button-group ion-padding-top">
        <ion-button expand="block" size="large" color="success" class="action-btn" @click="start" :disabled="isRunning">
          ▶ เริ่มต้น
        </ion-button>
        <ion-button expand="block" size="large" fill="outline" color="danger" class="action-btn" @click="stop" :disabled="!isRunning">
          ■ หยุดและดูสถิติ
        </ion-button>
      </div>

      <ion-modal :is-open="showSummary" @didDismiss="showSummary = false">
        <ion-header>
          <ion-toolbar color="tertiary">
            <ion-title>📊 สรุปผลการฝึก</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showSummary = false">ปิด</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding summary-bg">
          <div class="summary-container ion-text-center">
            <div class="summary-icon">🏆</div>
            <h2>ทำสำเร็จทั้งหมด</h2>
            <h1 class="summary-count">{{ state?.repDisplay ?? 0 }} <small>ครั้ง</small></h1>
            
            <ion-grid>
              <ion-row>
                <ion-col size="6">
                  <div class="summary-item">
                    <small>ทำผิดพลาด</small>
                    <div class="text-danger">{{ state?.stats.repsBad ?? 0 }}</div>
                  </div>
                </ion-col>
                <ion-col size="6">
                  <div class="summary-item">
                    <small>ความเร็วเฉลี่ย</small>
                    <div class="text-primary">{{ state?.stats.avgRepMs ?? 0 }}<small>ms</small></div>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>

            <div class="ion-padding-top">
              <p>พยายามต่อไปนะครับคุณนันท์นภัส!</p>
              <ion-button expand="block" color="tertiary" @click="showSummary = false">ตกลง</ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>

    <ion-footer class="ion-text-center ion-padding footer">
      รหัสนักศึกษา: 673380224-2 นันท์นภัส
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonFooter, IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonModal, IonButtons
} from "@ionic/vue";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);
const isRunning = ref(false);
const showSummary = ref(false);

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();

onMounted(() => {
  engine.onChange((s) => {
    state.value = s;
    const msg = s.stats.lastMessage;
    if (msg === "OK") {
      tts.speak(s.repDisplay.toString());
    } else if (msg && !["READY", "IDLE", "OK"].includes(msg)) {
      tts.speak(msg);
    }
  });
});

async function start() {
  try {
    isRunning.value = true;
    motion.start((s) => engine.process(s));
    engine.start();
    await tts.speak("เริ่มกายบริหารแขน");
  } catch (error) {
    isRunning.value = false;
    alert("กรุณาอนุญาตการเข้าถึงเซนเซอร์");
  }
}

async function stop() {
  isRunning.value = false;
  await motion.stop();
  engine.stop();
  await tts.speak("หยุดการทำงาน");
  
  // แสดงหน้าสรุปผล
  showSummary.value = true;
}
</script>

<style scoped>
.content-bg { --background: #f8faff; }
.stat-card { border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.05); margin-bottom: 10px; }
.card-body { height: 120px; display: flex; align-items: center; justify-content: center; }
.display-number { font-size: 64px; font-weight: 800; }
.count-color { color: #3b82f6; }
.feedback-badge { text-align: center; padding: 12px; margin: 10px; border-radius: 12px; color: white; font-weight: bold; }
.bg-success { background: #10b981; }
.bg-warning { background: #f59e0b; }
.action-btn { height: 60px; font-weight: bold; --border-radius: 16px; margin-top: 10px; }

/* Summary Modal Style */
.summary-bg { --background: #ffffff; }
.summary-container { padding: 20px; }
.summary-icon { font-size: 80px; margin-bottom: 10px; }
.summary-count { font-size: 80px; color: #3b82f6; margin: 10px 0; }
.summary-item { background: #f0f4f8; padding: 15px; border-radius: 15px; }
.summary-item div { font-size: 24px; font-weight: bold; }

.footer { font-size: 13px; color: #94a3b8; }
</style> 