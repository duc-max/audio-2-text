// Function to validate the file
import { message } from "antd";
import fileValidator from "./fileValidator";
import { create, ConverterType } from "@alexanderolsen/libsamplerate-js";

const uploadRequest = {};

const validateFile = (file) => {
  if (fileValidator(file) === false) {
    file.status = "error";
    message.error(
      "Invalid file type or size. Please upload an audio file that is less than 7MB."
    );
    return false;
  }
  return true;
};

// Function to resample the audio file
const resampleAudioFile = async (file) => {
  try {
    const maxSizeMB = 7;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      throw new Error(
        `File size exceeds ${maxSizeMB}MB. Please upload a smaller file.`
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    // Use the Web Audio API to decode the audio data and get the sample rate
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const inputSampleRate = audioBuffer.sampleRate;

    if (inputSampleRate !== 96000) {
      throw new Error("Input file must have a sample rate of 96kHz.");
    }

    // Resampling parameters
    const converterType = ConverterType.SRC_SINC_BEST_QUALITY;
    const nChannels = audioBuffer.numberOfChannels;
    const outputSampleRate = 16000;

    // Create resampler
    const src = await create(nChannels, inputSampleRate, outputSampleRate, {
      converterType: converterType,
    });

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
      const length = resampledChannels[0].length;
      combinedResampledData = new Float32Array(length * nChannels);
      for (let channel = 0; channel < nChannels; channel++) {
        combinedResampledData.set(resampledChannels[channel], channel * length);
      }
    }

    // Debugging logs
    console.log(
      "Combined Resampled Data Length:",
      combinedResampledData.length
    );

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
    uploadRequest[file.uid] = resampledFile;
  } catch (error) {
    console.error("Error during resampling:", error);
    message.error(`Failed to resample audio file: ${error.message}`);
  }
};

// Function to handle file upload errors
export { validateFile, resampleAudioFile, uploadRequest };
