import { parseSize } from "https://js.sabe.cc/parseSize.js";

const imgutil = {};

imgutil.waitLoad = async (img) => {
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject();
  });
};

imgutil.getBlobFromCanvas = async (canvas, mimetype, quality) =>
  // defalut image/png
  new Promise((res) => canvas.toBlob((blob) => res(blob), mimetype, quality));

imgutil.getArrayBufferFromBlob = async (blob) =>
  new Promise((res) => {
    const r = new FileReader();
    r.addEventListener("loadend", () => res(r.result));
    r.readAsArrayBuffer(blob);
  });

imgutil.getArrayBufferFromImage = async (img, mimeType, quality) => { // default image/png
  const canvas = document.createElement("canvas");
  const [iw, ih] = [img.orgwidth || img.width, img.orgheight || img.height];
  canvas.width = iw;
  canvas.height = ih;
  const g = canvas.getContext("2d");
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, iw, ih);
  g.drawImage(img, 0, 0, iw, ih, 0, 0, iw, ih);
  const blob = await imgutil.getBlobFromCanvas(canvas, mimeType, quality);
  const bin = await imgutil.getArrayBufferFromBlob(blob);
  return bin;
};

imgutil.getImageFromArrayBuffer = async (bin) => {
  const blob = new Blob([bin], { type: "image/jpeg" });
  const urlCreator = window.URL || window.webkitURL;
  const url = urlCreator.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  await imgutil.waitLoad(img);
  return img;
};

imgutil.resizeImage = async (img, mimeType, maxw) => {
  const iw = img.width;
  const ih = img.height;
  if (Math.max(iw, ih) < maxw) {
    return img;
  }
  const [dw, dh] = iw > ih ? [maxw, maxw / iw * ih] : [maxw / ih * iw, maxw];
  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const g = canvas.getContext("2d");
  g.drawImage(img, 0, 0, iw, ih, 0, 0, dw, dh);
  const dataurl = canvas.toDataURL(mimeType);
  const img2 = new Image();
  img2.src = dataurl;
  await imgutil.waitLoad(img2);
  return img2;
};

imgutil.loadResized = async (file, maxw, maxsize) => {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await imgutil.waitLoad(img);
  if (file.type.indexOf("svg") >= 0 && file.size <= parseSize(maxsize)) {
    return img;
  }
  return await imgutil.resizeImage(img, file.type, maxw);
};

imgutil.fetchImage = async (url) => {
  const img = new Image();
  img.src = url;
  return await waitLoad(img);
};

imgutil.getResized = (w, h, min) => {
  if (w > h) {
      return { width: min, height: min * h / w };
  } else {
      return { width: min * w / h, height: min };
  }
};

const ImageUtil = imgutil;

export { ImageUtil };
