<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label="ชื่อรายการ" label-placement="floating" v-model="title"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          label="จำนวนเงิน"
          label-placement="floating"
          type="number"
          v-model="amount">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-select label="ประเภท" v-model="type">
          <ion-select-option value="income">รายรับ</ion-select-option>
          <ion-select-option value="expense">รายจ่าย</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-input label="หมวดหมู่" label-placement="floating" v-model="category"></ion-input>
      </ion-item>

      <ion-item>
        <ion-textarea label="หมายเหตุ" label-placement="floating" v-model="note"></ion-textarea>
      </ion-item>

      <div class="ion-margin-top">
        <ion-button expand="block" @click="saveExpense">
          บันทึกข้อมูล
        </ion-button>
        <ion-button expand="block" fill="outline" color="medium" @click="router.back()">
          ยกเลิก
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton, IonItem 
} from "@ionic/vue"; // ต้อง Import Component เหล่านี้ด้วย
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const amount = ref(0);
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
  if (!title.value || amount.value <= 0) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: serverTimestamp() // ใช้ serverTimestamp ของ Firebase จะแม่นยำกว่า
    });

    // ล้างค่าฟอร์ม
    title.value = "";
    amount.value = 0;
    
    // กลับหน้าหลัก
    router.push("/tabs/tab1"); // เปลี่ยน path ตามที่ตั้งไว้ใน router/index.ts
  } catch (err) {
    console.error("Error adding document: ", err);
    alert("เกิดข้อผิดพลาดในการบันทึก");
  }
};
</script>