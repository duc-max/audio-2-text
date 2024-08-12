import { useContext } from "react";
import {
  Layout,
  Col,
  Button,
  Typography,
  Divider,
  Upload,
  message,
} from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import AudioPlayer from "./others/AudioPlay";
import { Context } from "../context/Context";
import { handleChange } from "../funcs/fileInputHandler";
import {
  resampleAudioFile,
  validateFile,
  uploadRequest,
} from "../funcs/fileResampler.js";
const { Content } = Layout;
const { Dragger } = Upload;
const { Text } = Typography;

function AudioInput() {
  const {
    isDarkMode,
    uploadedFile,
    clearFile,
    setIsProcessAudio,
    setUploadedFile,
    setUpload,
    setData,
    data,
  } = useContext(Context);
  const props = {
    name: "file",
    action: "https://192.168.93.55:5001/api/FileUpload/upload",
    multiple: false,
    method: "POST",
    accept: "audio/*",
    disabled: uploadedFile ? true : false,
    // The main beforeUpload function with integrated error handling
    beforeUpload: async (file) => {
      if (!validateFile(file)) {
        return Upload.LIST_IGNORE; // Prevent the file from being uploaded
      }

      try {
        const resampledFile = await resampleAudioFile(file);
        uploadRequest[file.uid] = resampledFile;
        return resampledFile;
      } catch (error) {
        console.error(error);
        message.error(`Failed to resample audio file: ${error.message}`);
        return Upload.LIST_IGNORE; // Prevent the file from being uploaded
      }
    },

    onChange: (info)=>handleChange(info,setUploadedFile, setUpload, setData, data),
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
    <Content
      style={{
        margin: "0.875rem 1rem 0",
        height: "100%",
      }}
    >
      <Col
        className="border-orange-500 border-dashed border-2 p-4"
        style={{
          margin: "0 auto",
          minHeight: 360,
          borderRadius: 8,
          width: "100%",

          backgroundColor: isDarkMode && !uploadedFile ? "#1f1f1f" : "#ffff",
          padding: 0,
        }}
      >
        {uploadedFile ? (
          <>
            <AudioPlayer
              fileName={uploadedFile.fileName}
              audioSrc={uploadedFile.audioSrc}
            />
            <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
              <Button
                onClick={clearFile}
                style={{
                  marginRight: "0.625rem",
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
                margin: "0.125rem auto",
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
                margin: "0.625rem 0",
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
          </Dragger>
        )}
      </Col>
    </Content>
  );
}

export default AudioInput;
