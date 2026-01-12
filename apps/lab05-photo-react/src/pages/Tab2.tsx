import { camera } from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/react';

import { usePhotoGallery } from '../hooks/usePhotoGallery';
import './Tab2.css';

const Tab2: React.FC = () => {
  // แก้ไข: ดึงทั้ง photos และ addNewToGallery ออกมาจาก Hook
  const { photos, addNewToGallery } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
          {/* ข้อมูลนักศึกษา */}
          <IonTitle size="small">
            Lab 05 - โดย นางสาวนันท์นภัส กลมเกลี้ยง รหัสนักศึกษา: 673380224-2
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
            <IonTitle size="small">
              Lab 05 - โดย นางสาวนันท์นภัส กลมเกลี้ยง รหัสนักศึกษา: 673380224-2
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* ส่วนแสดงรูปภาพที่ถ่าย */}
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={photo.filepath || index}>
                <IonImg src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* ปุ่มกดถ่ายรูป */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => addNewToGallery()}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;