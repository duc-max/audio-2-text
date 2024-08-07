import "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Divider, Button } from "antd";
const { Dragger } = Upload;
const { Content } = Layout;
import { Layout, theme } from "antd";
import { ConverterType } from "@alexanderolsen/libsamplerate-js";
import { useContext } from "react";
import { Context } from "../context/Context";

const props = {
  name: "file",
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  accept: ".mp3, .wav, .ogg, .flac, .aac, .m4a, .wma",

  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const Input = () => {
  let { audioCtx, setAudioCtx } = useContext(Context);
  const handleChange = (info) => {
    let converterType = ConverterType.SRC_SINC_BEST_QUALITY;
    let nChannels = 2;
    let inputSampleRate = 44100;
    let outputSampleRate = 48000;
    const { status } = info.file;

    if (status !== "uploading") {
      const fileInfo = info.file;
      const fileList = info.fileList;
      //   console.log(fileInfo, fileInfo);

      if (fileInfo) {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        setAudioCtx(audioContext);
        const reader = new FileReader();

        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          audioContext.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              console.log("Sample Rate:", buffer.sampleRate);
              const myArrayBuffer = audioContext.createBuffer(
                2,
                audioContext.sampleRate * 3,
                audioContext.sampleRate
              );

              for (
                let channel = 0;
                channel < myArrayBuffer.numberOfChannels;
                channel++
              ) {
                const nowBuffering = myArrayBuffer.getChannelData(channel);
                for (let i = 0; i < myArrayBuffer.length; i++) {
                  nowBuffering[i] = Math.random() * 2 - 1;
                }
              }

              const source = audioContext.createBufferSource();
              source.buffer = myArrayBuffer;
              source.connect(audioContext.destination);
              source.start();
            },
            (error) => {
              console.error("Error decoding audio data:", error);
            }
          );
        };

        reader.readAsArrayBuffer(fileInfo);
      } else {
        console.log("No file selected");
      }
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content
      style={{
        margin: "14px 16px 0",
        height: "10vh",
        background: colorBgContainer,
      }}
    >
      <div
        style={{
          margin: "0px auto",
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          height: "50%",
          width: "90%",
        }}
      >
        <Dragger {...props} onChange={handleChange}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined accept=".mp3" />
          </p>
          <p
            className="ant-upload-text"
            style={{ fontSize: "22px", position: "relative" }}
          >
            Drop audio file here
          </p>
          <Divider style={{ margin: "2px auto" }}>
            <p
              className="ant-upload-hint "
              style={{ fontSize: "22px", position: "relative" }}
            >
              or
            </p>
          </Divider>
          <p
            className="ant-upload-text"
            style={{ fontSize: "22px", position: "relative" }}
          >
            Click to upload
          </p>
          <Button
            icon={<UploadOutlined />}
            style={{ margin: "10px 0", position: "relative" }}
          >
            Click to Upload
          </Button>
          <p
            className="ant-upload-hint"
            style={{ fontSize: "12px", margin: "10px 0", position: "relative" }}
          >
            {`Supported file extensions : ${props.accept} `}
          </p>
        </Dragger>
      </div>
    </Content>
  );
};
export default Input;
