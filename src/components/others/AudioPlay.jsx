import { useState, useEffect, useRef, useContext } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { Typography, Button, Slider } from "antd";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { BiReset } from "react-icons/bi";
import style from "./AudioPLay.module.css";
const { Title } = Typography;
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
    isDarkMode,
    wavesurfer,
    setWavesurfer,
    startTime,
    endTime,
    setEndTime,
    setStartTime,
  } = useContext(Context);
  const volumeControlRef = useRef(null);

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.seekTo(startTime / wavesurfer.getDuration());
      setCurrentTime(startTime);
    }
  }, [wavesurfer, startTime]);

  useEffect(() => {
    if (!wavesurfer) return;

    const handleTimeUpdate = () => {
      const time = wavesurfer.getCurrentTime();
      setCurrentTime(time);
      if (endTime > 0 && time >= endTime && playing) {
        wavesurfer.pause();
        setPlaying(false);
        if (startTime !== 0 || endTime !== 0) {
          setStartTime(0);
          setEndTime(0);
        }
      }
    };

    wavesurfer.on("audioprocess", handleTimeUpdate);
    wavesurfer.on("seek", handleTimeUpdate);

    return () => {
      wavesurfer.un("audioprocess", handleTimeUpdate);
      wavesurfer.un("seek", handleTimeUpdate);
    };
  }, [wavesurfer, playing, endTime]);

  const onReady = (ws) => {
    setWavesurfer(ws);
    setDuration(ws.getDuration());
    setPlaying(false);
  };

  const togglePlay = () => {
    if (wavesurfer) {
      if (!playing) {
        wavesurfer.play(startTime);
      } else {
        wavesurfer.playPause();
      }
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
      wavesurfer.seekTo(startTime / duration);
      setCurrentTime(startTime);
      wavesurfer.play();
      setPlaying(true);
    }
  };

  const handleVolumeIconClick = () => {
    setSliderVisible(!sliderVisible);
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
      <WavesurferPlayer
        height={100}
        waveColor={!isDarkMode ? "rgb(102, 102, 255)" : "rgb(239, 91, 30)"}
        url={audioSrc}
        onReady={onReady}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <Title level={4} style={{ color: isDarkMode ? "#fff" : "#000" }}>
        {fileName}
      </Title>

      <div
        style={{
          marginBottom: "0.625rem",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        {new Date(currentTime * 1000).toISOString().substr(11, 8)} /{" "}
        {new Date(duration * 1000).toISOString().substr(11, 8)}
      </div>

      <div
        className={style.audioPlayWrapper}
        style={{ marginBottom: "0.625rem" }}
      >
        <div
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
        </div>
        <div className="audioController" >
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
        <div>
          <Button onClick={resetAudio} style={{ marginRight: "0.625rem" }}>
            <BiReset />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
