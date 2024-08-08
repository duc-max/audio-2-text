import "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Divider, Button, Col, Row } from "antd";
const { Dragger } = Upload;
const { Content } = Layout;
import { Layout, theme } from "antd";
import { create, ConverterType } from "@alexanderolsen/libsamplerate-js";

import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import AudioPlayer from "./others/AudioPlay";
import Converter from "./Converter";

const Input = () => {
  const props = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    accept: ".mp3, .wav, .ogg, .flac, .aac, .m4a, .wma",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
        let reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          console.log(arrayBuffer);
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
            console.log(`Resampled data length: ${resampledData.length}`);
            console.log(`Resampled sample rate: ${outputSampleRate} Hz`);
          } catch (error) {
            console.error("Error decoding or resampling audio data:", error);
          }
        };
        reader.readAsArrayBuffer(info.file.originFileObj);
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  let { uploadedFile, setUploadedFile } = useContext(Context);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const clearFile = () => {
    setUploadedFile(null);
  };
  return (
    <Row gutter={[16, 16]}>
    <Col xs={12} md={12} xl={12}>
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
                  <Button onClick={clearFile} style={{ marginRight: "10px" }}>
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
      </Content>
    </Col>
    <Col xs={12} md={12} xl={12}>
      <Converter />
    </Col>
  </Row>
  );
};
export default Input;
