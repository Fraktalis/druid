import { useState, useRef } from "react";
import { Button } from "@/components/ui/button"; // ShadCN button
import * as React from "react";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      console.log("Audio recorded:", audioBlob);
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
