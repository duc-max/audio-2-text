import { AudioRecorder } from "react-audio-voice-recorder";
import { useContext, useRef, useState } from "react";
import { Context } from "../../context/Context";
import { message } from "antd"; // Assuming you're using antd for messages
import axios from "axios";

const Recorder = () => {
  
  const { setUploadedFile, setData } = useContext(Context);
  const [record, setRecord] = useState({ blob: null });
  const formRef = useRef(null);
  const handleAudioStop = (data) => {
    setRecord(data);
    setUploadedFile({
      fileName: "RecordedAudio.webm", // Or you can dynamically set this based on your needs
      audioSrc: URL.createObjectURL(data.blob),
    });
    // Automatically submit the form when recording is complete
    if (formRef.current) {
      const formData = new FormData();
      formData.append("audio", data.blob, "RecordedAudio.webm");
      console.log("Form data:", formData);
      // Post the form data
      axios
        .post("https://192.168.93.8:5001/api/FileUpload/upload", formData)
        .then((response) => {
          message.success("Audio submitted successfully.", response);
        })
        .catch((error) => {
          message.error("Error submitting audio.");
          console.error("Error details:", error);
        });
    }
  };

  return (
    <form ref={formRef}>
      <AudioRecorder
        style={{ width: "100%" }}
        onRecordingComplete={handleAudioStop}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        downloadOnSavePress={true}
        downloadFileExtension="mp3"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        showVisualizer={true}
      />
    </form>
  );
};

export default Recorder;
