import { useState, createContext } from "react";

export const Context = createContext();
function Provider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [audioCtx, setAudioCtx] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [open, setOpen] = useState(false);
  const [sliderVisible, setSliderVisible] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [data, setData] = useState([]);
  const [validated, setValidated] = useState(false);
  const [upload, setUpload] = useState(false);
  return (
    <Context.Provider
      value={{
        validated,
        setValidated,
        collapsed,
        setCollapsed,
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
        open,
        setOpen,
        selectedDetail,
        setSelectedDetail,
        percentage,
        setPercentage,
        setData,
        data,
        upload,
        setUpload,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Provider;
