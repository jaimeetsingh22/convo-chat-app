import moment from "moment";

const fileFormat = (url = "") => {
  let ext = url.split(".").pop();
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "image";
      break;
    case "mp4":
    case "avi":
    case "mov":
    case "ogg":
      return "video";
      break;
    case "mp3":
    case "wav":
    case "ogg":
      return "audio";
      break;
    default:
      return "file";
  }
};

const transformImage = (url = "", width = 100) => {
  if (url.includes("upload/")) {
    return url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  }
  return url;
};


const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    last7Days.unshift(dayName);
  }
  return last7Days;
};

const emitEvent = (req, event, users, data) => {
  console.log("emiting event", event);
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  // if (get) {
  //   return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  // } else {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }
  return null;
};

async function deleteFilesFromCloudinary(public_ids) {
  // logic here
}

export {
  fileFormat,
  transformImage,
  getLast7Days,
  emitEvent,
  deleteFilesFromCloudinary,
  getOrSaveFromStorage,
};
