import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Divider, Button } from "antd";
import { Layout, theme } from "antd";
import { create, ConverterType } from "@alexanderolsen/libsamplerate-js";
import { useContext, useState } from "react";
import { Context } from "../context/Context";
import AudioPlayer from "./others/AudioPlay";
import Converter from "./Converter";
import { Col, Container, Row } from "react-bootstrap";
import AppHeader from "./Header/Header";
import "./Common.css";
import { ThemeContext } from "../context/ThemeContext";
import Footer from "./Footer/Footer";
import darkBackground from "../../public/assets/80499.jpg";
import lightBackground from "../../public/assets/background.jpg";
const { Dragger } = Upload;
const { Content } = Layout;
const Input = () => {
  let { uploadedFile, setUploadedFile, setData } = useContext(Context);
  const { isDarkMode } = useContext(ThemeContext);
  const [isProcessAudio, setIsProcessAudio] = useState(false);

  const props = {
    name: "file",
    action: "https://192.168.93.55:5001/api/FileUpload/upload",
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        let reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const audioContext = new (window.AudioContext ||
            window.AudioContext)();
          try {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const sampleRate = audioBuffer.sampleRate;

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
          } catch (error) {
            console.error("Error decoding or resampling audio data:", error);
          }
        };
        reader.readAsArrayBuffer(info.file.originFileObj);
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
          setData(info.file?.response?.object);
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
    token: { colorBgContainer },
  } = theme.useToken();

  const clearFile = () => {
    setUploadedFile(null);
    setIsProcessAudio(false); // Reset the processing state when clearing the file
  };
  const backgroundImage = isDarkMode ? darkBackground : lightBackground;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Layout
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          paddingTop: "64px",
          position: "relative",
          zIndex: 0,
        }}
      >
        <AppHeader />
        <Container fluid>
          <h1
            style={{
              color: isDarkMode ? "#fff" : "#000",
            }}
            className="text-center web-title"
          >
            Chuyển Đổi Âm Thanh Thành Văn Bản
          </h1>
          <Row className="pt-5 d-flex justify-content-center">
            <Col xs={12} sm={12} md={6} lg={6} className="mb-4">
              <Content
                style={{
                  margin: "14px 16px 0",
                  height: "100%",
                }}
              >
                <Col
                  style={{
                    margin: "0px auto",
                    minHeight: 360,
                    borderRadius: 8,
                    width: "100%",
                    border: "1px dashed #d9d9d9",
                    backgroundColor: isDarkMode && !uploadedFile ? "" : "#ffff",
                    padding: 0,
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
                          style={{
                            marginRight: "10px",
                            color: isDarkMode ? "#000" : "inherit",
                          }}
                        >
                          Clear
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => {
                            setIsProcessAudio(true);
                          }}
                        >
                          Xử lý
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Dragger
                      {...props}
                      style={{ border: "none", background: "none" }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined
                          style={{
                            color: isDarkMode ? "#f5f5f5" : "inherit",
                          }}
                          accept=".mp3"
                        />
                      </p>
                      <p
                        className="text-input"
                        style={{
                          color: isDarkMode ? "#f5f5f5" : "inherit",
                        }}
                      >
                        Drop audio file here
                      </p>
                      <Divider
                        style={{
                          margin: "2px auto",
                        }}
                      >
                        <p
                          className="text-input"
                          style={{
                            color: isDarkMode ? "#f5f5f5" : "inherit",
                          }}
                        >
                          or
                        </p>
                      </Divider>
                      <p
                        className="text-input"
                        style={{
                          color: isDarkMode ? "#f5f5f5" : "inherit",
                        }}
                      >
                        Click to upload
                      </p>
                      <Button
                        icon={<UploadOutlined />}
                        style={{
                          margin: "10px 0",
                          position: "relative",
                          color: isDarkMode ? "#000" : "inherit",
                        }}
                      >
                        Click to Upload
                      </Button>
                      <p
                        className="ant-upload-hint"
                        style={{
                          fontSize: "12px",
                          margin: "10px 0",
                          position: "relative",
                          color: isDarkMode ? "#f5f5f5" : "inherit",
                        }}
                      >
                        {`Supported file extensions : ${props.accept} `}
                      </p>
                    </Dragger>
                  )}
                </Col>
              </Content>
            </Col>
            {isProcessAudio && (
              <Col
                xs={12}
                sm={12}
                md={isProcessAudio ? 6 : 12}
                lg={isProcessAudio ? 6 : 12}
                className="mb-4"
              >
                <Converter />
              </Col>
            )}
          </Row>
        </Container>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default Input;
