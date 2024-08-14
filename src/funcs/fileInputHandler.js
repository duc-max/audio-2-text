import { message } from "antd";
import fileValidator from "./fileValidator";

// Function to handle file validation
const handleFileValidation = (file) => {
  if (fileValidator(file) === false) {
    file.status = "error";
  }
  return file.status;
};

// Function to handle file upload processing
const handleFileUploadProcessing = (
  info,
  setUploadedFile,
  setUpload,
  setData,
  data,
) => {
  const { status } = info.file;

  if (status !== "done") {
    setUploadedFile({
      fileName: info.file.name,
      audioSrc: URL.createObjectURL(info.file.originFileObj),
    });
  } else if (status === "done") {
    console.log("info.file: ", info.file);
    message.success(`${info.file.name} file uploaded successfully.`);
    setTimeout(() => {}, 1000);
    console.log("info.file: ", info.file?.response?.object);
    setUpload(true);
    setData(info.file?.response?.object);
    console.log(data);
  } else if (status === "error") {
    message.error(`${info.file.name} file upload failed.`);
  }
};

// Main handleChange function
export const handleChange = async (
  info,
  setUploadedFile,
  setUpload,
  setData,
  data
) => {
  const status = handleFileValidation(info.file);
  if (status !== "error") {
    handleFileUploadProcessing(info, setUploadedFile, setUpload, setData, data);
  }
};
