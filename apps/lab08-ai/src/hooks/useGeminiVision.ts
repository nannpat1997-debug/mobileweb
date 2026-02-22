import { useState } from 'react';
import { PhotoService } from '../core/photo.service';
import { GeminiVisionService } from '../core/gemini.service';
import { Base64Image, ImageAnalysisResult } from '../core/ai.interface';

export const useGeminiVision = () => {
  const [img, setImg] = useState<Base64Image | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Hook สำหรับจัดการไฟล์จาก Input
 const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]; // ดึงไฟล์จาก event
  if (!file) return;
  const b64 = await PhotoService.fromFile(file);
  setImg(b64);
  setPreviewUrl(URL.createObjectURL(file));
  setResult(null);
};

  // Hook สำหรับจัดการกล้อง
  const handleCamera = async () => {
    try {
      const b64 = await PhotoService.fromCamera();
      setImg(b64);
      setPreviewUrl(`data:${b64.mimeType};base64,${b64.base64}`);
      setResult(null);
    } catch (err) {
      console.error("Camera Error", err);
    }
  };

  // Hook สำหรับสั่งวิเคราะห์
  const analyze = async () => {
    if (!img) return;
    setLoading(true);
    try {
      const res = await GeminiVisionService.analyze(img);
      setResult(res);
    } catch (err) {
      console.error("AI Error", err);
    } finally {
      setLoading(false);
    }
  };

  return { img, previewUrl, result, loading, handleFile, handleCamera, analyze };
};