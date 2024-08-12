const fileValidator = (file) => {
  const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
  const maxSize = 7 * 1024 * 1024;
  if (!validTypes.includes(file.type)) {
    return false;
  }
  if (file.size > maxSize) {
    return false;
  }
  return true;
};

export default fileValidator;
