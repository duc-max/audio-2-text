import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Divider, Button } from "antd";
import { Layout } from "antd";
import { create, ConverterType } from "@alexanderolsen/libsamplerate-js";
import { useContext, useState } from "react";
import { Context } from "../context/Context";
import AudioPlayer from "./others/AudioPlay";
import Converter from "./Converter";
import { Col, Container, Row } from "react-bootstrap";
// import AppHeader from "./Header/Header";
import Headertw from "./Header/Header-tw";
import "./Common.css";
import { ThemeContext } from "../context/ThemeContext";
import Footer from "./Footer/Footer";
import Footertw from "./Footer/Footer-tw";
import fileValidator from "../funcs/fileValidator";
import darkBackground from "../../public/assets/80499.jpg";
import lightBackground from "../../public/assets/background.jpg";
const { Dragger } = Upload;
const { Content } = Layout;

const Input = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isProcessAudio, setIsProcessAudio] = useState(false);
  let { uploadedFile, setUploadedFile, setData } = useContext(Context);
  const clearFile = () => {
    setUploadedFile(null);
    setIsProcessAudio(false);
  };
  const backgroundImage = isDarkMode ? darkBackground : lightBackground;
  const props = {
    name: "file",
    action: "https://192.168.93.55:5001/api/FileUpload/upload",
    multiple: false,
    method: "POST",
    accept: "audio/*",
    // beforeUpload: async (file) => {
    //   if (fileValidator(file) === false) {
    //     file.status = "error";
    //     message.error(
    //       "Invalid file type or size. Please upload an audio file that is less than 7MB."
    //     );
    //   } else {
    //     try {
    //       // Read the audio file as an array buffer
    //       const arrayBuffer = await file.arrayBuffer();

    //       // Use the Web Audio API to decode the audio data and get the sample rate
    //       const audioContext = new (window.AudioContext ||
    //         window.webkitAudioContext)();
    //       const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    //       const inputSampleRate = audioBuffer.sampleRate;

    //       // Resampling parameters
    //       const converterType = ConverterType.SRC_SINC_BEST_QUALITY;
    //       const nChannels = audioBuffer.numberOfChannels;
    //       const outputSampleRate = 16000;

    //       // Create resampler
    //       const src = await create(
    //         nChannels,
    //         inputSampleRate,
    //         outputSampleRate,
    //         {
    //           converterType: converterType,
    //         }
    //       );

    //       // Resample each channel
    //       const resampledChannels = [];
    //       for (let channel = 0; channel < nChannels; channel++) {
    //         const audioData = audioBuffer.getChannelData(channel);
    //         const resampledData = src.simple(audioData);
    //         resampledChannels.push(resampledData);
    //       }
    //       src.destroy(); // Clean up

    //       // Combine resampled data into a single array (if multi-channel)
    //       let combinedResampledData;
    //       if (nChannels === 1) {
    //         combinedResampledData = resampledChannels[0];
    //       } else {
    //         combinedResampledData = new Float32Array(
    //           resampledChannels[0].length * nChannels
    //         );
    //         for (let channel = 0; channel < nChannels; channel++) {
    //           combinedResampledData.set(
    //             resampledChannels[channel],
    //             channel * resampledChannels[0].length
    //           );
    //         }
    //       }

    //       // Convert Float32Array to Int16Array for WAV format
    //       const int16Data = new Int16Array(combinedResampledData.length);
    //       for (let i = 0; i < combinedResampledData.length; i++) {
    //         int16Data[i] =
    //           Math.max(-1, Math.min(1, combinedResampledData[i])) * 0x7fff; // Convert to 16-bit PCM
    //       }

    //       // Create a new Blob from the resampled data
    //       const resampledBlob = new Blob([int16Data.buffer], {
    //         type: "audio/wav",
    //       });

    //       // Create a new File object from the resampled Blob
    //       const resampledFile = new File([resampledBlob], file.name, {
    //         type: "audio/wav",
    //         lastModified: Date.now(),
    //       });

    //       // Replace the original file with the resampled file
    //       return resampledFile;
    //     } catch (error) {
    //       console.error("Error during resampling:", error);
    //       message.error(`Failed to resample audio file: ${error.message}`);
    //       return Upload.LIST_IGNORE; // Prevent the file from being uploaded
    //     }
    //   }
    // },

    onChange: async (info) => {
      if (fileValidator(info.file) === false) {
        info.file.status = "error";
      } else {
        let { status } = info.file;

        if (status === "done") {
          setUploadedFile({
            fileName: info.file.name,
            audioSrc: URL.createObjectURL(info.file.originFileObj),
          });
          message.success(`${info.file.name} file uploaded successfully.`);

          console.log("info.file: ", info.file?.response?.object);
          setData(info.file?.response?.object);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    },
  };
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
        {/* <AppHeader /> */}
        <Headertw />
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
                          Xóa
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
        {/* <Footertw /> */}
        {/* <Footer /> */}
      </Layout>
    </Layout>
  );
};

export default Input;
