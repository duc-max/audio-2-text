import { useState, useEffect, useRef, useContext } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { Typography, Button, Select, Slider } from "antd";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { BiReset } from "react-icons/bi";
import style from "./AudioPLay.module.css";
const { Title } = Typography;
const { Option } = Select;
import { Context } from "../../context/Context";

const playbackRates = [0.5, 1, 1.5, 2];

const AudioPlayer = ({ audioSrc, fileName }) => {
  const {
    playing,
    setPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    muted,
    playbackRate,
    setPlaybackRate,
    sliderVisible,
    setSliderVisible,
  } = useContext(Context);
  const [wavesurfer, setWavesurfer] = useState(null);
  const volumeControlRef = useRef(null);

  const onReady = (ws) => {
    setWavesurfer(ws);
    setDuration(ws.getDuration());
    setPlaying(false);
  };

  useEffect(() => {
    if (wavesurfer) {
      const handleTimeUpdate = () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      };

      wavesurfer.on("audioprocess", handleTimeUpdate);
      wavesurfer.on("seek", handleTimeUpdate);

      return () => {
        wavesurfer.un("audioprocess", handleTimeUpdate);
        wavesurfer.un("seek", handleTimeUpdate);
      };
    }
  }, [wavesurfer]);

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
  }, [setSliderVisible]);

  const togglePlay = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (wavesurfer) {
      wavesurfer.setVolume(value);
    }
  };

  const skipForward = () => {
    if (wavesurfer) {
      const newTime = Math.min(currentTime + 10, duration);
      wavesurfer.seekTo(newTime / duration);
    }
  };

  const skipBackward = () => {
    if (wavesurfer) {
      const newTime = Math.max(currentTime - 10, 0);
      wavesurfer.seekTo(newTime / duration);
    }
  };

  const handlePlaybackRateChange = (value) => {
    setPlaybackRate(value);
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(value);
    }
  };

  const resetAudio = () => {
    if (wavesurfer) {
      wavesurfer.seekTo(0);
      setCurrentTime(0);
      wavesurfer.play();
      setPlaying(true);
    }
  };

  const handleVolumeIconClick = () => {
    setSliderVisible(!sliderVisible);
  };

  return (
    <div style={{ width: "100%", padding: "20px", textAlign: "center" }}>
      <WavesurferPlayer
        height={100}
        waveColor=" #6666ff"
        url={audioSrc}
        onReady={onReady}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <Title level={4}>{fileName}</Title>

      <div style={{ marginBottom: "10px" }}>
        {new Date(currentTime * 1000).toISOString().substr(11, 8)} /{" "}
        {new Date(duration * 1000).toISOString().substr(11, 8)}
      </div>

      <div className={style.audioPlayWrapper} style={{ marginBottom: "10px" }}>
        <div className={style.volumeControlWrapper} ref={volumeControlRef}>
          <Button
            onClick={handleVolumeIconClick}
            style={{ marginRight: "10px" }}
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
          <Select
            value={playbackRate}
            onChange={handlePlaybackRateChange}
            style={{ width: 70 }}
          >
            {playbackRates.map((rate) => (
              <Option key={rate} value={rate}>
                {rate}x
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <Button onClick={skipBackward} style={{ marginRight: "10px" }}>
            <IoMdSkipBackward />
          </Button>
          <Button onClick={togglePlay} style={{ marginRight: "10px" }}>
            {playing ? <CiPause1 /> : <CiPlay1 />}
          </Button>
          <Button onClick={skipForward} style={{ marginRight: "10px" }}>
            <IoMdSkipForward />
          </Button>
        </div>
        <div>
          <Button onClick={resetAudio} style={{ marginRight: "10px" }}>
            <BiReset />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
