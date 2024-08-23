import { useContext } from "react";
import { Layout, Col, Button, Spin } from "antd";

import AudioPlayer from "./others/AudioPlay";
import { LoadingOutlined } from "@ant-design/icons";
import { Context } from "../context/Context";
import Loader from "./others/loader/Loader";

import MusicalDragger from "./Dragger.jsx";
const { Content } = Layout;

function AudioInput() {
  const {
    isDarkMode,
    uploadedFile,
    setIsProcessAudio,
    setUploadedFile,
    setUpload,
    setData,
    setValidated,
    validated,
    setPercentage,
    setLoading,
  } = useContext(Context);
  const clearFile = () => {
    setPercentage(0);
    setData([]);
    setUploadedFile(null);
    setIsProcessAudio(false);
    setUpload(false);
    setLoading(true);
    setValidated(false);
  };

  return (
    <Content
      style={{
        height: "100%",
      }}
    >
      <Col
        className=" p-4"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          margin: "0 auto",
          minHeight: 360,
          borderRadius: 8,
          width: "100%",
          backgroundColor: isDarkMode ? "#1f1f1f" : "#ffff",
          padding: 0,
        }}
      >
        {uploadedFile && (
          <div className="zoom-fade-in">
            <AudioPlayer
              fileName={uploadedFile.fileName}
              audioSrc={uploadedFile.audioSrc}
            />
            <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
              <Button
                onClick={() => {
                  clearFile();
                }}
                style={{
                  marginRight: "0.625rem",
                  color: isDarkMode ? "#000" : "inherit",
                }}
              >
                Xóa
              </Button>
              <Button
                style={{
                  backgroundColor: "#ef5b1e",
                  borderColor: "#ef5b1e",
                  color: "#fff",
                }}
                onClick={() => {
                  setIsProcessAudio(true);
                }}
              >
                Xử lý
              </Button>
            </div>
          </div>
        )}
        <Spin
          size="large"
          spinning={validated}
          indicator={<LoadingOutlined spin />}
          style={{
            backgroundColor: isDarkMode ? "#1f1f1f" : "#ffff",
            color: isDarkMode ? "#ef5b1e" : "",
            boxShadow: "none",
            
          }}
          tip="Đang xử lý tệp âm thanh..."
        >
          {/* <Dragger
            className="fade-in"
            showUploadList={false}
            {...props}
            style={{
              padding: 0,
              border: "none",
              background: "none",
              display: uploadedFile ? "none" : "block",
            }}
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
                borderColor: isDarkMode ? "#f5f5f5" : "inherit",
                margin: "0.125rem auto",
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
            <Button
              icon={<UploadOutlined />}
              style={{
                margin: " 0 0 0.625rem 0",
                position: "relative",
                color: isDarkMode ? "#000" : "inherit",
                borderColor: isDarkMode ? "#ef5b1e" : "",
              }}
            >
              Chọn tệp
            </Button>
            <Text
              className="ant-upload-hint d-block"
              style={{
                fontSize: "0.75rem",
                margin: "0.625rem 0",
                position: "relative",
                color: isDarkMode ? "#f5f5f5" : "inherit",
              }}
            >
              *Hỗ trợ tất cả các tệp âm thanh
            </Text>
          </Dragger> */}
          <MusicalDragger />
        </Spin>
      </Col>
    </Content>
  );
}

export default AudioInput;
