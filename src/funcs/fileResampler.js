import { message } from "antd";
import { create, ConverterType } from "@alexanderolsen/libsamplerate-js";
import fileValidator from "./fileValidator";

const uploadRequest = {};
const resampleAudioFile = async (file) => {
  try {
    if (!fileValidator(file)) {
      throw new Error(
        "Invalid file type or size. Please upload an audio file that is less than 7MB."
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const inputSampleRate = audioBuffer.sampleRate;

    console.log(`Input sample rate: ${inputSampleRate} Hz`);

    const converterType = ConverterType.SRC_SINC_BEST_QUALITY;
    const nChannels = audioBuffer.numberOfChannels;
    const outputSampleRate = 16000; // Target sample rate: 16kHz

    const src = await create(nChannels, inputSampleRate, outputSampleRate, {
      converterType: converterType,
    });

    const resampledChannels = [];

    for (let channel = 0; channel < nChannels; channel++) {
      const audioData = audioBuffer.getChannelData(channel);
      const resampledData = src.simple(audioData);
      resampledChannels.push(resampledData);
    }

    src.destroy();

    // Combine resampled data into a single array
    let combinedResampledData;
    if (nChannels === 1) {
      combinedResampledData = resampledChannels[0];
    } else {
      const maxLength = Math.max(
        ...resampledChannels.map((channel) => channel.length)
      );
      combinedResampledData = new Float32Array(maxLength * nChannels);
      for (let channel = 0; channel < nChannels; channel++) {
        for (let i = 0; i < resampledChannels[channel].length; i++) {
          combinedResampledData[i * nChannels + channel] =
            resampledChannels[channel][i];
        }
      }
    }

    // Convert Float32Array to Int16Array for WAV format
    const int16Data = new Int16Array(combinedResampledData.length);
    for (let i = 0; i < combinedResampledData.length; i++) {
      int16Data[i] =
        Math.max(-1, Math.min(1, combinedResampledData[i])) * 0x7fff;
    }

    // Create WAV file header
    const wavHeader = createWavHeader(
      int16Data.length * 2,
      nChannels,
      outputSampleRate
    );

    // Combine header and audio data
    const wavBlob = new Blob([wavHeader, int16Data.buffer], {
      type: "audio/wav",
    });

    // Create a new File object from the WAV Blob
    const resampledFile = new File(
      [wavBlob],
      file.name.replace(/\.[^/.]+$/, ".wav"),
      {
        type: "audio/wav",
        lastModified: Date.now(),
      }
    );

    uploadRequest[file.uid] = resampledFile;
    console.log(`Resampled to ${outputSampleRate} Hz`);
    return resampledFile;
  } catch (error) {
    console.error("Error during resampling:", error);
    message.error(`Failed to resample audio file: ${error.message}`);
    throw error;
  }
};

// Function to create a WAV file header
function createWavHeader(dataLength, numChannels, sampleRate) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, "RIFF");
  // File length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, "WAVE");
  // Format chunk identifier
  writeString(view, 12, "fmt ");
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (PCM)
  view.setUint16(20, 1, true);
  // Channel count
  view.setUint16(22, numChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // Data chunk identifier
  writeString(view, 36, "data");
  // Data chunk length
  view.setUint32(40, dataLength, true);

  return buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export { resampleAudioFile, uploadRequest };
