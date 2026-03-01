import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

export class TtsService {
  private isSpeaking = false;

  async speak(text: string): Promise<void> {
    if (!text) return;

    try {
      this.isSpeaking = true;

      // 👉 ถ้าเป็นเว็บ (ionic serve)
      if (Capacitor.getPlatform() === "web") {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "th-TH";
        speechSynthesis.speak(utter);
        return;
      }

      // 👉 ถ้าเป็น Android/iOS
      await TextToSpeech.speak({
        text,
        lang: "th-TH",
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
      });

    } catch (error) {
      console.error("TTS Error:", error);
    } finally {
      this.isSpeaking = false;
    }
  }

  async stop(): Promise<void> {
    if (Capacitor.getPlatform() === "web") {
      speechSynthesis.cancel();
      this.isSpeaking = false;
      return;
    }

    await TextToSpeech.stop();
    this.isSpeaking = false;
  }

  get speaking(): boolean {
    return this.isSpeaking;
  }
}