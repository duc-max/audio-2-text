import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  message,
  Upload,
  Divider,
  Button,
  Layout,
  Typography,
  Progress,
} from "antd";
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
// import Footer from "./Footer/Footer";
// import Footertw from "./Footer/Footer-tw";
import fileValidator from "../funcs/fileValidator";
import darkBackground from "../../public/assets/80499.jpg";
import lightBackground from "../../public/assets/pattern-randomized.png";
const { Title, Text } = Typography;
const { Dragger } = Upload;
const { Content } = Layout;

const Input = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isProcessAudio, setIsProcessAudio] = useState(false);
  let { uploadedFile, setUploadedFile, setData, data } = useContext(Context);
  const clearFile = () => {
    setUploadedFile(null);
    setIsProcessAudio(false);
  };
  const uploadRequest = {};
  const backgroundImage = isDarkMode ? "" : lightBackground;
  const props = {
    name: "file",
    action: "https://192.168.93.55:5001/api/FileUpload/upload",
    multiple: false,
    method: "POST",
    accept: "audio/*",
    disabled: uploadedFile ? true : false,
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

    // //       // Use the Web Audio API to decode the audio data and get the sample rate
    // //       const audioContext = new (window.AudioContext ||
    // //         window.webkitAudioContext)();
    // //       const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    // //       const inputSampleRate = audioBuffer.sampleRate;

    // //       // Resampling parameters
    // //       const converterType = ConverterType.SRC_SINC_BEST_QUALITY;
    // //       const nChannels = audioBuffer.numberOfChannels;
    // //       const outputSampleRate = 16000;

    // //       // Create resampler
    // //       const src = await create(
    // //         nChannels,
    // //         inputSampleRate,
    // //         outputSampleRate,
    // //         {
    // //           converterType: converterType,
    // //         }
    // //       );

    // //       // Resample each channel
    // //       const resampledChannels = [];
    // //       for (let channel = 0; channel < nChannels; channel++) {
    // //         const audioData = audioBuffer.getChannelData(channel);
    // //         const resampledData = src.simple(audioData);
    // //         resampledChannels.push(resampledData);
    // //       }
    // //       src.destroy(); // Clean up

    // //       // Combine resampled data into a single array (if multi-channel)
    // //       let combinedResampledData;
    // //       if (nChannels === 1) {
    // //         combinedResampledData = resampledChannels[0];
    // //       } else {
    // //         combinedResampledData = new Float32Array(
    // //           resampledChannels[0].length * nChannels
    // //         );
    // //         for (let channel = 0; channel < nChannels; channel++) {
    // //           combinedResampledData.set(
    // //             resampledChannels[channel],
    // //             channel * resampledChannels[0].length
    // //           );
    // //         }
    // //       }

    // //       // Convert Float32Array to Int16Array for WAV format
    // //       const int16Data = new Int16Array(combinedResampledData.length);
    // //       for (let i = 0; i < combinedResampledData.length; i++) {
    // //         int16Data[i] =
    // //           Math.max(-1, Math.min(1, combinedResampledData[i])) * 0x7fff; // Convert to 16-bit PCM
    // //       }

    // //       // Create a new Blob from the resampled data
    // //       const resampledBlob = new Blob([int16Data.buffer], {
    // //         type: "audio/wav",
    // //       });

    //       // Create a new File object from the resampled Blob
    //       const resampledFile = new File([resampledBlob], file.name, {
    //         type: "audio/wav",
    //         lastModified: Date.now(),
    //       });
    //       uploadRequest[file.uid] = resampledFile;
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
        if (status != "done") {
          setUploadedFile({
            fileName: info.file.name,
            audioSrc: URL.createObjectURL(info.file.originFileObj),
          });
        } else if (status === "done") {
          console.log("info.file: ", info.file);
          message.success(`${info.file.name} file uploaded successfully.`);
          setTimeout(() => {}, 1000);
          console.log("info.file: ", info.file?.response?.object);
          setData(info.file?.response?.object);
          console.log(data);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    },
    onRemove: (file) => {
      console.log("removed:", file.name);
      if (uploadRequest[file.uid]) {
        delete uploadRequest[file.uid];
        message.info(`${file.name} upload has been cancelled.`);
        console.log(uploadRequest[file.uid]);
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
          backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
          paddingTop: "64px",
          position: "relative",
          zIndex: 0,
        }}
      >
        {/* <AppHeader /> */}
        <Headertw />
        <Container fluid>
          <Title
            level={2}
            style={{
              color: isDarkMode ? "#fff" : "#000",
            }}
            className="text-center web-title pt-10"
          >
            Chuyển Đổi Âm Thanh Thành Văn Bản
          </Title>
          <Row className="pt-0 d-flex justify-content-center">
            <Col xs={12} sm={12} md={6} lg={6} className="mb-4">
              <Content
                style={{
                  margin: "14px 16px 0",
                  height: "100%",
                }}
              >
                <Col
                  className="border-orange-500 border-dashed border-2 p-4"
                  style={{
                    margin: "0px auto",
                    minHeight: 360,
                    borderRadius: 8,
                    width: "100%",

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
                      showUploadList={true}
                      {...props}
                      style={{ border: "none", background: "none" }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined
                          style={{
                            color: isDarkMode ? "#f5f5f5" : "inherit",
                          }}
                        />
                      </p>
                      <Text
                        className="text-input"
                        style={{
                          color: isDarkMode ? "#f5f5f5" : "inherit",
                        }}
                      >
                        Thả tệp âm thanh vào đây
                      </Text>
                      <Divider
                        style={{
                          margin: "2px auto",
                          color: isDarkMode ? "#000" : "inherit",
                        }}
                      >
                        <p
                          className="text-input"
                          style={{
                            color: isDarkMode ? "#f5f5f5" : "inherit",
                          }}
                        >
                          hoặc
                        </p>
                      </Divider>
                      <Text
                        className="text-input d-block"
                        style={{
                          color: isDarkMode ? "#f5f5f5" : "inherit",
                        }}
                      >
                        Thả tệp âm thanh vào đây
                      </Text>
                      <Button
                        icon={<UploadOutlined />}
                        style={{
                          margin: "10px 0",
                          position: "relative",
                          color: isDarkMode ? "#000" : "inherit",
                        }}
                      >
                        Chọn tệp
                      </Button>
                      <Text
                        className="ant-upload-hint d-block"
                        style={{
                          fontSize: "12px",
                          margin: "10px 0",
                          position: "relative",
                          color: isDarkMode ? "#f5f5f5" : "inherit",
                        }}
                      >
                        *Hỗ trợ tất cả các tệp âm thanh
                      </Text>
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
