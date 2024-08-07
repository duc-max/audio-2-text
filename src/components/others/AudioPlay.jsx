import { useRef, useEffect, useContext } from "react";
import { Slider, Typography, Button, Select } from "antd";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { BiReset } from "react-icons/bi";
import style from "./AudioPLay.module.css";
import { Context } from "../../context/Context";
const { Title } = Typography;
const { Option } = Select;

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
    setMuted,
    playbackRate,
    setPlaybackRate,
    sliderVisible,
    setSliderVisible,
  } = useContext(Context);

  const audioRef = useRef(null);
  const volumeControlRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current?.currentTime);
      };

      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioRef.current?.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

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
    if (audioRef.current.paused) {
      audioRef.current.play();
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
      if (value === 0) {
        setMuted(true);
      } else {
        setMuted(false);
      }
    }
  };

  // const toggleMute = () => {
  //   setMuted(!muted);
  //   if (audioRef.current) {
  //     audioRef.current.muted = !muted;
  //     if (muted) {
  //       setVolume(1);
  //       audioRef.current.volume = 1;
  //     } else {
  //       setVolume(0);
  //       audioRef.current.volume = 0;
  //     }
  //   }
  // };

  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(currentTime + 10, duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlaybackRateChange = (value) => {
    setPlaybackRate(value);
    if (audioRef.current) {
      audioRef.current.playbackRate = value;
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleVolumeIconClick = () => {
    setSliderVisible(!sliderVisible);
  };

  return (
    <div style={{ width: "100%", padding: "20px", textAlign: "center" }}>
      <audio ref={audioRef} src={audioSrc} />

      <Title level={4}>{fileName}</Title>
      <Slider
        min={0}
        max={duration}
        value={currentTime}
        onChange={(value) => {
          if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
          }
        }}
        style={{ marginBottom: "10px" }}
      />

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
