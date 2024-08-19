import PropTypes from "prop-types";
import { FaPlay, FaPause } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { Context } from "../../context/Context";

function AudioCrop({ fromTime, toTime }) {
  const { wavesurfer, playing, setPlaying } = useContext(Context);
  const playPart = () => {
    if (wavesurfer) {
      wavesurfer.playPause(fromTime, toTime);
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (wavesurfer) {
      const onPlay = () => {
        if (wavesurfer.getCurrentTime() >= toTime) {
          wavesurfer.pause();
          wavesurfer.seekTo(fromTime / wavesurfer.getDuration());
          setPlaying(false);
        }
      };

      wavesurfer.on("audioprocess", onPlay);

      return () => {
        wavesurfer.un("audioprocess", onPlay);
      };
    }
  }, [wavesurfer, fromTime, toTime, setPlaying]);

  return (
    <button className="audio-crop--play" onClick={playPart}>
      {playing ? <FaPause /> : <FaPlay />}
    </button>
  );
}

AudioCrop.propTypes = {
  fromTime: PropTypes.number.isRequired,
  toTime: PropTypes.number.isRequired,
};

export default AudioCrop;
