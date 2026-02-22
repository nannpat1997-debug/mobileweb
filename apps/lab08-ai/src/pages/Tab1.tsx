import React, { useRef } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButton, IonImg, IonSpinner, IonCard, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonCardContent, IonBadge,
  IonIcon, IonItem, IonLabel, IonList
} from '@ionic/react';
import { cameraOutline, imageOutline, scanOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useGeminiVision } from '../hooks/useGeminiVision'; // import hook ที่สร้างใหม่

const Tab1Page: React.FC = () => {
  const fileEl = useRef<HTMLInputElement>(null);
  
  // เรียกใช้ Hook แทนการประกาศ useState เยอะๆ ในหน้านี้
  const { 
    img, previewUrl, result, loading, 
    handleFile, handleCamera, analyze 
  } = useGeminiVision();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>LAB8 Gemini Vision By Nannaphat</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f0f7ff' }}>
        
        {/* ปุ่มกดเลือกรูป/ถ่ายรูป */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <IonButton expand="block" fill="outline" style={{ flex: 1 }} onClick={() => fileEl.current?.click()}>
            <IonIcon slot="start" icon={imageOutline} />
            เลือกรูป
          </IonButton>
          <IonButton expand="block" style={{ flex: 1 }} onClick={handleCamera}> 
            <IonIcon slot="start" icon={cameraOutline} />
            ถ่ายรูป
          </IonButton>
        </div>

        <input 
          ref={fileEl} 
          type="file" 
          accept="image/*" 
          hidden 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFile(e)} 
        />

        {previewUrl && (
          <IonCard style={{ borderRadius: '15px', overflow: 'hidden', border: '2px solid #3880ff' }}>
            <IonImg src={previewUrl} style={{ maxHeight: '300px', objectFit: 'cover' }} />
          </IonCard>
        )}

        {/* ปุ่มสั่ง AI */}
        <IonButton 
          expand="block" 
          color="secondary" 
          disabled={!img || loading} 
          onClick={analyze}
          style={{ margin: '20px 0' }}
        >
          {loading ? <IonSpinner name="crescent" /> : <><IonIcon slot="start" icon={scanOutline} /> วิเคราะห์ภาพด้วย AI</>}
        </IonButton>

        {/* การแสดงผลลัพธ์ */}
        {result && (
          <IonCard style={{ animation: 'fadeIn 0.5s', borderTop: '5px solid #3880ff' }}>
            <IonCardHeader>
              <IonCardSubtitle color="primary">ผลการวิเคราะห์</IonCardSubtitle>
              <IonCardTitle style={{ fontSize: '1.2rem' }}>{result.caption}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <div style={{ marginBottom: '15px' }}>
                {result.tags.map((tag, i) => (
                  <IonBadge key={i} color="primary" style={{ marginRight: '5px', padding: '5px 10px' }}>
                    #{tag}
                  </IonBadge>
                ))}
              </div>

              {result.objects && result.objects.length > 0 && (
                <IonList>
                  <IonLabel color="medium">สิ่งที่พบในภาพ:</IonLabel>
                  {result.objects.map((obj, i) => (
                    <IonItem key={i} lines="none" style={{ '--inner-padding-end': '0' }}>
                      <IonIcon icon={checkmarkCircleOutline} color="success" slot="start" />
                      <IonLabel>{obj.name}</IonLabel>
                      {obj.confidence && <IonBadge slot="end">{(obj.confidence * 100).toFixed(0)}%</IonBadge>}
                    </IonItem>
                  ))}
                </IonList>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1Page;