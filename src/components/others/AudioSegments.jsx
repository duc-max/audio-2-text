import { useState, useEffect, useRef, useContext } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { Typography, Button, Slider } from "antd";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { BiReset } from "react-icons/bi";
import style from "./AudioPlay.module.css";
import { Context } from "../../context/Context";
function audioBufferToWave(abuffer) {
  const numOfChan = abuffer.numberOfChannels;
  const length = abuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952);
  setUint32(length - 8);
  setUint32(0x45564157);
  setUint32(0x20746d66);
  setUint32(16);
  setUint16(1);
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);
  setUint32(0x61746164);
  setUint32(length - pos - 4);

  // write interleaved data
  for (let i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  // create Blob
  return new Blob([buffer], { type: "audio/wav" });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

const AudioSegment = ({ itemId, fromTime, toTime }) => {
  const { uploadedFile, isDarkMode, data } = useContext(Context);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [sliderVisible, setSliderVisible] = useState(false);
  const [slicedAudioUrl, setSlicedAudioUrl] = useState(null);

  const volumeControlRef = useRef(null);

  const sliceAudioBuffer = (audioBuffer, start, end) => {
    if(data) return audioBuffer;
    const channels = audioBuffer.numberOfChannels;
    const rate = audioBuffer.sampleRate;
    const startOffset = Math.floor(rate * start);
    const endOffset = Math.floor(rate * end);
    const frameCount = endOffset - startOffset;

    const newAudioBuffer = new AudioContext().createBuffer(
      channels,
      frameCount,
      rate
    );
    const anotherArray = new Float32Array(frameCount);

    for (let channel = 0; channel < channels; channel++) {
      audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
      newAudioBuffer.copyToChannel(anotherArray, channel, 0);
    }
    return newAudioBuffer;
  };

  useEffect(() => {
    const fetchAndSliceAudio = async () => {
      try {
        const response = await fetch(uploadedFile.audioSrc);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const slicedBuffer = sliceAudioBuffer(
          audioBuffer,
          fromTime / 1000,
          toTime / 1000
        );

        // Convert sliced buffer to blob URL
        const wavBlob = await audioBufferToWave(slicedBuffer);
        const url = URL.createObjectURL(wavBlob);
        setSlicedAudioUrl(url);
      } catch (error) {
        console.error("Error slicing audio:", error);
      }
    };

    fetchAndSliceAudio();
  }, [uploadedFile.audioSrc, fromTime, toTime]);

  const onReady = (ws) => {
    setWavesurfer(ws);
    ws.on("audioprocess", () => {
      setCurrentTime(ws.getCurrentTime());
    });
  };

  useEffect(() => {
    if (wavesurfer) {
      const handleTimeUpdate = () => {
        const currentTime = wavesurfer.getCurrentTime();
        setCurrentTime(currentTime);
        if (currentTime >= toTime / 1000) {
          wavesurfer.pause();
          setPlaying(false);
        }
      };

      wavesurfer.on("audioprocess", handleTimeUpdate);
      wavesurfer.on("seek", handleTimeUpdate);

      return () => {
        wavesurfer.un("audioprocess", handleTimeUpdate);
        wavesurfer.un("seek", handleTimeUpdate);
      };
    }
  }, [wavesurfer, toTime]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        volumeControlRef.current &&
        !volumeControlRef.current.contains(event.target)
      ) {
        setSliderVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePlay = () => {
    if (wavesurfer) {
      if (currentTime >= toTime / 1000) {
        wavesurfer.seekTo(fromTime / toTime);
      }
      wavesurfer.playPause();
      setPlaying(!playing);
    }
  };

  const skipForward = () => {
    if (wavesurfer) {
      const newTime = Math.min(currentTime + 10, toTime / 1000);
      wavesurfer.seekTo(newTime / toTime);
    }
  };

  const skipBackward = () => {
    if (wavesurfer) {
      const newTime = Math.max(currentTime - 10, fromTime / 1000);
      wavesurfer.seekTo(newTime / toTime);
    }
  };

  const resetAudio = () => {
    if (wavesurfer) {
      wavesurfer.seekTo(fromTime / toTime);
      setCurrentTime(fromTime / 1000);
      wavesurfer.play();
      setPlaying(true);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "1.25rem 1.25rem 0 1.25rem",
        textAlign: "center",
        backgroundColor: isDarkMode ? "#1f1f1f" : "#ffff",
      }}
    >
      {slicedAudioUrl && (
        <WavesurferPlayer
          height={100}
          waveColor={!isDarkMode ? "rgb(102, 102, 255)" : "rgb(239, 91, 30)"}
          url={slicedAudioUrl}
          onReady={onReady}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}

      <div
        style={{
          marginBottom: "0.625rem",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        {new Date(fromTime).toISOString().substr(11, 8)} /{" "}
        {new Date(toTime).toISOString().substr(11, 8)}
      </div>

      <div
        className={style.audioPlayWrapper}
        style={{ marginBottom: "0.625rem" }}
      >
        {/* <div
          className={style.volumeControlWrapper}
          style={{ marginBottom: "0px" }}
          ref={volumeControlRef}
        >
          <Button
            onClick={handleVolumeIconClick}
            style={{ marginRight: "0.625rem" }}
            className={style.btnVolume}
          >
            {muted || volume === 0 ? (
              <IoVolumeMuteOutline />
            ) : (
              <IoVolumeHighOutline />
            )}
          </Button>
          {sliderVisible && (
            <div className={style.volumeSliderContainer}>
              <Slider
                vertical
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className={style.volumeSlider}
              />
            </div>
          )}
        </div> */}
        <div className="audioController">
          <Button onClick={skipBackward} style={{ marginRight: "0.625rem" }}>
            <IoMdSkipBackward />
          </Button>
          <Button onClick={togglePlay} style={{ marginRight: "0.625rem" }}>
            {playing ? <CiPause1 /> : <CiPlay1 />}
          </Button>
          <Button onClick={skipForward} style={{ marginRight: "0.625rem" }}>
            <IoMdSkipForward />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioSegment;
