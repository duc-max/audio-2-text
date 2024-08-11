import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Divider, Button, Col, Row } from "antd";
import { Layout, theme } from "antd";
import { useContext } from "react";
import { Context } from "../context/Context";
import AudioPlayer from "./others/AudioPlay";
import Converter from "./Converter";
import { Container } from "react-bootstrap";
import fileValidator from "../funcs/fileValidator";
import { create, ConverterType } from "@alexanderolsen/libsamplerate-js";

const { Dragger } = Upload;
const { Content } = Layout;

const Input = () => {
  let { uploadedFile, setUploadedFile, setData, data } = useContext(Context);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const clearFile = () => {
    setUploadedFile(null);
  };

  const props = {
    name: "file",
    action: "https://192.168.93.55:5001/api/FileUpload/upload",
    multiple: false,
    method: "POST",
    accept: "audio/*",
    beforeUpload: async (file) => {
      if (fileValidator(file) === false) {
        file.status = "error";
        message.error(
          "Invalid file type or size. Please upload an audio file that is less than 7MB."
        );
      } else {
        try {
          // Read the audio file as an array buffer
          const arrayBuffer = await file.arrayBuffer();

          // Use the Web Audio API to decode the audio data and get the sample rate
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const inputSampleRate = audioBuffer.sampleRate;

          // Resampling parameters
          const converterType = ConverterType.SRC_SINC_BEST_QUALITY;
          const nChannels = audioBuffer.numberOfChannels;
          const outputSampleRate = 16000;

          // Create resampler
          const src = await create(
            nChannels,
            inputSampleRate,
            outputSampleRate,
            {
              converterType: converterType,
            }
          );

          // Resample each channel
          const resampledChannels = [];
          for (let channel = 0; channel < nChannels; channel++) {
            const audioData = audioBuffer.getChannelData(channel);
            const resampledData = src.simple(audioData);
            resampledChannels.push(resampledData);
          }
          src.destroy(); // Clean up

          // Combine resampled data into a single array (if multi-channel)
          let combinedResampledData;
          if (nChannels === 1) {
            combinedResampledData = resampledChannels[0];
          } else {
            combinedResampledData = new Float32Array(
              resampledChannels[0].length * nChannels
            );
            for (let channel = 0; channel < nChannels; channel++) {
              combinedResampledData.set(
                resampledChannels[channel],
                channel * resampledChannels[0].length
              );
            }
          }

          // Convert Float32Array to Int16Array for WAV format
          const int16Data = new Int16Array(combinedResampledData.length);
          for (let i = 0; i < combinedResampledData.length; i++) {
            int16Data[i] =
              Math.max(-1, Math.min(1, combinedResampledData[i])) * 0x7fff; // Convert to 16-bit PCM
          }

          // Create a new Blob from the resampled data
          const resampledBlob = new Blob([int16Data.buffer], {
            type: "audio/wav",
          });

          // Create a new File object from the resampled Blob
          const resampledFile = new File([resampledBlob], file.name, {
            type: "audio/wav",
            lastModified: Date.now(),
          });

          // Replace the original file with the resampled file
          return resampledFile;
        } catch (error) {
          console.error("Error during resampling:", error);
          message.error(`Failed to resample audio file: ${error.message}`);
          return Upload.LIST_IGNORE; // Prevent the file from being uploaded
        }
      }
    },

    onChange: async (info) => {
      if (fileValidator(info.file) === false) {
        info.file.status = "error";
      } else {
        let { status } = info.file;
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
          console.log("info.file: ", info.file?.response?.object);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    },
  };
  return (
    <Container>
      <Row gutter={[16, 16]} style={{ paddingTop: "60px", display: "flex" }}>
        <Col xs={12} md={12} xl={12} style={{ paddingTop: "100px" }}>
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
                      <InboxOutlined />
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
            {/* wait for development acceptance */}
            {/* <Row justify={"center"}>
                <AudioRecorderComponent />
              </Row> */}
          </Content>
        </Col>
        <Col xs={12} md={12} xl={12}>
          <Converter />
        </Col>
      </Row>
    </Container>
  );
};

export default Input;
