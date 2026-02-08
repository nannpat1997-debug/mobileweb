<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>แก้ไข/ลบรายการ</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="id">
        <ion-item>
          <ion-input label="ชื่อรายการ" label-placement="stacked" v-model="expense.title"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="จำนวนเงิน" label-placement="stacked" type="number" v-model="expense.amount"></ion-input>
        </ion-item>
        <ion-item>
          <ion-select label="ประเภท" v-model="expense.type">
            <ion-select-option value="income">รายรับ</ion-select-option>
            <ion-select-option value="expense">รายจ่าย</ion-select-option>
          </ion-select>
        </ion-item>

        <div class="ion-margin-top">
          <ion-button expand="block" color="primary" @click="updateData">บันทึกการแก้ไข</ion-button>
          <ion-button expand="block" color="danger" fill="outline" @click="confirmDelete">ลบรายการนี้</ion-button>
        </div>
      </div>
      <div v-else class="ion-text-center ion-padding">
        <p>กรุณาเลือกรายการจากหน้าประวัติ (Tab 2)</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { alertController, onIonViewWillEnter, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/vue';

const route = useRoute();
const router = useRouter();
const id = ref('');
const expense = ref({ title: '', amount: 0, type: 'expense' });

onIonViewWillEnter(async () => {
  id.value = route.params.id as string;
  if (id.value) {
    const docSnap = await getDoc(doc(db, "expenses", id.value));
    if (docSnap.exists()) expense.value = docSnap.data() as any;
  }
});

const updateData = async () => {
  await updateDoc(doc(db, "expenses", id.value), {
    title: expense.value.title,
    amount: Number(expense.value.amount),
    type: expense.value.type
  });
  router.push('/tabs/tab2');
};

const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบ',
    message: 'ต้องการลบรายการนี้ใช่ไหม?',
    buttons: [
      { text: 'ยกเลิก', role: 'cancel' },
      { text: 'ลบ', handler: async () => {
          await deleteDoc(doc(db, "expenses", id.value));
          router.push('/tabs/tab2');
      }}
    ]
  });
  await alert.present();
};
</script>