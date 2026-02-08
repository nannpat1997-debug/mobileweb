<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>ประวัติรายการ</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-card color="success" class="ion-no-margin">
              <ion-card-header>
                <ion-card-subtitle>รายรับรวม</ion-card-subtitle>
                <ion-card-title>{{ totalIncome.toLocaleString() }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card color="danger" class="ion-no-margin">
              <ion-card-header>
                <ion-card-subtitle>รายจ่ายรวม</ion-card-subtitle>
                <ion-card-title>{{ totalExpense.toLocaleString() }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-list class="ion-margin-top">
        <ion-list-header><ion-label>แตะเพื่อแก้ไขหรือลบ</ion-label></ion-list-header>
        <ion-item v-for="item in expenses" :key="item.id" button @click="goToEdit(item.id)">
          <ion-label>
            <h2 style="font-weight: bold;">{{ item.title }}</h2>
            <p>{{ item.category }}</p>
          </ion-label>
          <ion-note slot="end" :color="item.type === 'income' ? 'success' : 'danger'" style="font-weight: bold;">
            {{ item.type === 'income' ? '+' : '-' }}{{ item.amount.toLocaleString() }}
          </ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonNote, IonGrid, IonRow, IonCol, 
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonListHeader,
  onIonViewWillEnter 
} from '@ionic/vue';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'vue-router';

const router = useRouter();
const expenses = ref<any[]>([]);
let unsubscribe: any = null;

onIonViewWillEnter(() => {
  if (unsubscribe) unsubscribe();
  const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
  unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
});

const totalIncome = computed(() => expenses.value.filter(i => i.type === 'income').reduce((s, i) => s + Number(i.amount), 0));
const totalExpense = computed(() => expenses.value.filter(i => i.type === 'expense').reduce((s, i) => s + Number(i.amount), 0));
const goToEdit = (id: string) => router.push(`/tabs/tab3/${id}`);
</script>