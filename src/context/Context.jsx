import { useState, createContext, useEffect } from "react";
import axios from "axios";
export const Context = createContext();

function Provider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioCtx, setAudioCtx] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [sliderVisible, setSliderVisible] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await axios.get("http://localhost:9999/data");
      setText(resp.data);
    };
    fetchData;
  }, []);
  return (
    <Context.Provider
      value={{
        collapsed,
        setCollapsed,
        text,
        loading,
        setLoading,
        setAudioCtx,
        audioCtx,
        setUploadedFile,
        uploadedFile,
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
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Provider;
