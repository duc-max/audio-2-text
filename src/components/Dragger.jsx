import { DiffOutlined, UploadOutlined } from "@ant-design/icons";
import { Upload, Typography, Divider, Button, message } from "antd";
import { useContext } from "react";
import { Context } from "../context/Context";
import { handleChange } from "../funcs/fileInputHandler";
import { resampleAudioFile, uploadRequest } from "../funcs/fileResampler.js";
import fileValidator from "../funcs/fileValidator.js";
const { Dragger } = Upload;
const { Text } = Typography;
const MusicalArt = ({ color }) => (
  <svg
    width="86px"
    height="86px"
    viewBox="-2.4 -2.4 28.80 28.80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transform="rotate(0)"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />

    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M12 19.5C12 20.8807 10.8807 22 9.5 22C8.11929 22 7 20.8807 7 19.5C7 18.1193 8.11929 17 9.5 17C10.8807 17 12 18.1193 12 19.5Z"
        stroke={color}
        strokeWidth="1.5"
      />{" "}
      <path
        d="M22 17.5C22 18.8807 20.8807 20 19.5 20C18.1193 20 17 18.8807 17 17.5C17 16.1193 18.1193 15 19.5 15C20.8807 15 22 16.1193 22 17.5Z"
        stroke={color}
        strokeWidth="1.5"
      />{" "}
      <path
        d="M22 8L12 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M14.4556 5.15803L14.7452 5.84987L14.4556 5.15803ZM16.4556 4.32094L16.1661 3.62909L16.4556 4.32094ZM21.1081 3.34059L20.6925 3.96496L20.6925 3.96496L21.1081 3.34059ZM21.25 12.0004C21.25 12.4146 21.5858 12.7504 22 12.7504C22.4142 12.7504 22.75 12.4146 22.75 12.0004H21.25ZM12.75 19.0004V8.84787H11.25V19.0004H12.75ZM14.7452 5.84987L16.7452 5.01278L16.1661 3.62909L14.1661 4.46618L14.7452 5.84987ZM22.75 8.01078C22.75 6.67666 22.752 5.59091 22.6304 4.76937C22.5067 3.93328 22.2308 3.18689 21.5236 2.71622L20.6925 3.96496C20.8772 4.08787 21.0473 4.31771 21.1466 4.98889C21.248 5.67462 21.25 6.62717 21.25 8.01078H22.75ZM16.7452 5.01278C18.0215 4.47858 18.901 4.11263 19.5727 3.94145C20.2302 3.77391 20.5079 3.84204 20.6925 3.96496L21.5236 2.71622C20.8164 2.24554 20.0213 2.2792 19.2023 2.48791C18.3975 2.69298 17.3967 3.114 16.1661 3.62909L16.7452 5.01278ZM12.75 8.84787C12.75 8.18634 12.751 7.74991 12.7875 7.41416C12.822 7.09662 12.8823 6.94006 12.9594 6.8243L11.7106 5.99325C11.4527 6.38089 11.3455 6.79864 11.2963 7.25218C11.249 7.68752 11.25 8.21893 11.25 8.84787H12.75ZM14.1661 4.46618C13.5859 4.70901 13.0953 4.91324 12.712 5.12494C12.3126 5.34549 11.9686 5.60562 11.7106 5.99325L12.9594 6.8243C13.0364 6.70855 13.1575 6.59242 13.4371 6.438C13.7328 6.27473 14.135 6.10528 14.7452 5.84987L14.1661 4.46618ZM22.75 12.0004V8.01078H21.25V12.0004H22.75Z"
        fill={color}
      />{" "}
      <path
        d="M7 11V6.5V2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <circle cx="4.5" cy="10.5" r="2.5" stroke={color} strokeWidth="1.5" />{" "}
      <path
        d="M10 5C8.75736 5 7 4.07107 7 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
    </g>
  </svg>
);
const WaveformArt = ({ color }) => (
  <svg
    width="150"
    height="50"
    viewBox="0 0 150 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 25H10V15H20V35H30V5H40V45H50V25H60V35H70V15H80V25H90V5H100V45H110V25H120V35H130V15H140V25H150"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const MusicalDragger = () => {
  const {
    isDarkMode,
    uploadedFile,
    setIsProcessAudio,
    setUploadedFile,
    setUpload,
    setData,
    data,
    setValidated,
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
  const props = {
    name: "file",
    action: "https://192.168.93.55:5001/api/FileUpload/upload",
    multiple: false,
    method: "POST",
    accept: "audio/*",
    disabled: uploadedFile ? true : false,

    // The main beforeUpload function with integrated error handling
    // beforeUpload: async (file) => {
    //   setValidated(true);
    //   try {
    //     const resampledFile = await resampleAudioFile(file);
    //     uploadRequest[file.uid] = resampledFile;
    //     setValidated(false);
    //     return resampledFile;
    //   } catch (error) {
    //     return Upload.LIST_IGNORE; // Prevent the file from being uploaded
    //   }
    // },

    onChange: (info) =>
      handleChange(
        info,
        setUploadedFile,
        setUpload,
        setData,
        data,
        setPercentage
      ),
    onRemove: (file) => {
     message.destroy("removed:", file.name);
      if (uploadRequest[file.uid]) {
        delete uploadRequest[file.uid];
        message.info(`${file.name} upload has been cancelled.`);
        console.log(uploadRequest[file.uid]);
      }
    },
  };
  const artColor = isDarkMode ? "#ef5b1e" : "#333333";

  return (
    <Dragger
      className="fade-in custom-dragger"
      showUploadList={false}
      {...props}
      style={{
        borderRadius: "8px",
        border: "none",
        background: "none",
        padding: "24px",
        display: uploadedFile ? "none" : "block",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="musical-background">
        <div
          style={{ position: "absolute", top: "10%", left: "5%", opacity: 0.2 }}
        >
          <MusicalArt color={artColor} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "5%",
            opacity: 0.2,
          }}
        >
          <MusicalArt color={artColor} />
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.1,
          }}
        >
          <WaveformArt color={artColor} />
        </div>
      </div>
      <div className="dragger-content">
        <p className="ant-upload-drag-icon">
          <DiffOutlined
            style={{
              fontSize: "3.75rem",
              color: isDarkMode ? "#ef5b1e" : "#1890ff",
            }}
          />
        </p>
        <Text
          className="text-input main-text"
          style={{
            color: isDarkMode ? "#f5f5f5" : "inherit",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Thả tệp âm thanh vào đây
        </Text>
        <Divider
          style={{
            borderColor: isDarkMode ? "#f5f5f5" : "#d9d9d9",
            margin: "16px auto",
            width: "80%",
          }}
        >
          <p
            className="text-input"
            style={{
              color: isDarkMode ? "#f5f5f5" : "inherit",
              backgroundColor: isDarkMode ? "#1f1f1f" : "#fafafa",
              padding: "0 10px",
            }}
          >
            hoặc
          </p>
        </Divider>
        <Button
          icon={<UploadOutlined />}
          style={{
            margin: "0 0 16px 0",
            position: "relative",
            borderColor: isDarkMode ? "#ef5b1e" : "",
            color: isDarkMode ? "#000" : "#000",
          }}
        >
          Chọn tệp
        </Button>
        <Text
          className="ant-upload-hint d-block"
          style={{
            fontSize: "14px",
            margin: "8px 0",
            position: "relative",
            color: isDarkMode ? "#a8a8a8" : "#8c8c8c",
          }}
        >
          *Hỗ trợ tất cả các tệp âm thanh
        </Text>
      </div>
    </Dragger>
  );
};

export default MusicalDragger;
