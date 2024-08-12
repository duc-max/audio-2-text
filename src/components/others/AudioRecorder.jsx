import { AudioRecorder } from "react-audio-voice-recorder";
import { useContext, useRef, useState } from "react";
import { Context } from "../../context/Context";
import { message } from "antd"; // Assuming you're using antd for messages
import axios from "axios";

const Recorder = () => {
  // const { setUploadedFile, setData } = useContext(Context);
  // const addAudioElement = (blob) => {
  //   const url = URL.createObjectURL(blob);
  //   setData()
  //   audio.src = url;
  //   audio.controls = true;
  // };

  return (
    <AudioRecorder
      onRecordingComplete={addAudioElement}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }}
      downloadOnSavePress={true}
      downloadFileExtension="mp3"
    />
  );
};

export default Recorder;
