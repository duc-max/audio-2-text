import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Divider, Button, Col, Row } from "antd";
import { Layout, theme } from "antd";
import { create, ConverterType } from "@alexanderolsen/libsamplerate-js";
import { useContext } from "react";
import { Context } from "../context/Context";
import AudioPlayer from "./others/AudioPlay";
import Converter from "./Converter";
import Recorder from "./others/AudioRecorder";
const { Dragger } = Upload;
const { Content } = Layout;
const Input = () => {
  let { uploadedFile, setUploadedFile, setData, data } = useContext(Context);

  const props = {
    name: "file",
    action: "https://192.168.93.41:5001/api/FileUpload/upload",
    multiple: false,
    accept: ".mp3",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info);
        let reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const audioContext = new (window.AudioContext ||
            window.AudioContext)();
          try {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const sampleRate = audioBuffer.sampleRate;
            console.log(`Original sample rate: ${sampleRate} Hz`);

            // Convert sample rate to 16000 Hz
            const converterType = ConverterType.SRC_SINC_BEST_QUALITY;
            const nChannels = audioBuffer.numberOfChannels;
            const inputSampleRate = sampleRate;
            const outputSampleRate = 16000;

            const src = await create(
              nChannels,
              inputSampleRate,
              outputSampleRate,
              {
                converterType: converterType,
              }
            );

            const inputData = audioBuffer.getChannelData(0); // Assuming mono audio
            const resampledData = src.simple(inputData);
            src.destroy(); // Clean up
            setUploadedFile({
              fileName: info.file.name,
              audioSrc: URL.createObjectURL(info.file.originFileObj),
            });
            console.log(`Original data length: ${info.file.response.object}`);
            console.log(`Resampled data length: ${resampledData.length}`);
            console.log(`Resampled sample rate: ${outputSampleRate} Hz`);
          } catch (error) {
            console.error("Error decoding or resampling audio data:", error);
          }
        };
        reader.readAsArrayBuffer(info.file.originFileObj);
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
          console.log("info.file: ", info.file?.response?.object);
          setData(info.file?.response?.object);
          console.log(data.object)
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const clearFile = () => {
    setUploadedFile(null);
  };
  return (
    <div className="container">
      <Row gutter={[16, 16]} style={{ paddingTop: "40px", display: "flex" }}>
        <Col xs={12} md={12} xl={12} style={{ paddingTop: "40px" }}>
          <Content
            style={{
              margin: "14px 16px 0",
              height: "10vh",
              background: colorBgContainer,
            }}
          >
            <Row justify="center">
              <Col
                xs={24}
                md={24}
                xl={24}
                style={{
                  margin: "0px auto",
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  height: "50%",
                  width: "90%",
                }}
              >
                {uploadedFile ? (
                  <>
                    <AudioPlayer
                      fileName={uploadedFile.fileName}
                      audioSrc={uploadedFile.audioSrc}
                    />
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <Button
                        onClick={clearFile}
                        style={{ marginRight: "10px" }}
                      >
                        Clear
                      </Button>
                      <Button type="primary">Submit</Button>
                    </div>
                  </>
                ) : (
                  <Dragger {...props}>
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
                      style={{
                        fontSize: "12px",
                        margin: "10px 0",
                        position: "relative",
                      }}
                    >
                      {`Supported file extensions : ${props.accept} `}
                    </p>
                  </Dragger>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} xl={24}>
                <Recorder />
              </Col>
            </Row>
          </Content>
        </Col>
        <Col xs={12} md={12} xl={12}>
          <Converter />
        </Col>
      </Row>
    </div>
  );
};
export default Input;
