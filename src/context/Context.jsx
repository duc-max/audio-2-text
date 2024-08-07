import { useState, createContext, useEffect } from "react";
import axios from "axios";
export const Context = createContext();

function Provider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioCtx, setAudioCtx] = useState(null);
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
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Provider;
