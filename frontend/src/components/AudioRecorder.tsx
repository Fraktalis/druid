import { useState, useRef } from "react";
import { Button } from "@/components/ui/button"; // ShadCN button

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {

    const displayMediaOptions: DisplayMediaStreamOptions = {
      video: {
        displaySurface: "browser",
        echoCancellation: true,
        noiseSuppression: true
      },
      audio: true
    };

    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioBlobURL = window.URL.createObjectURL(audioBlob);
      console.log("Audio recorded:", audioBlob, audioBlobURL);
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
    };

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="p-4 text-center">
      <Button onClick={recording ? stopRecording : startRecording} variant="default">
        {recording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
}
