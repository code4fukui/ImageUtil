import { parseSize } from "https://js.sabae.cc/parseSize.js";

const ImageUtil = {};

ImageUtil.waitLoad = async (img) => {
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject();
  });
};

ImageUtil.getBlobFromCanvas = async (canvas, mimetype, quality) =>
  // defalut image/png
  new Promise((res) => canvas.toBlob((blob) => res(blob), mimetype, quality));

ImageUtil.getArrayBufferFromBlob = async (blob) =>
  new Promise((res) => {
    const r = new FileReader();
    r.addEventListener("loadend", () => res(r.result));
    r.readAsArrayBuffer(blob);
  });

ImageUtil.getArrayBufferFromImage = async (img, mimeType, quality, colorSpace = "srgb") => { // default image/png
  const canvas = document.createElement("canvas");
  const [iw, ih] = [img.orgwidth || img.width, img.orgheight || img.height];
  canvas.width = iw;
  canvas.height = ih;
  const g = canvas.getContext("2d", { colorSpace });
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, iw, ih);
  g.drawImage(img, 0, 0, iw, ih, 0, 0, iw, ih);
  const blob = await ImageUtil.getBlobFromCanvas(canvas, mimeType, quality);
  const bin = await ImageUtil.getArrayBufferFromBlob(blob);
  return bin;
};

ImageUtil.getImageFromArrayBuffer = async (bin) => {
  const blob = new Blob([bin], { type: "image/jpeg" });
  const urlCreator = window.URL || window.webkitURL;
  const url = urlCreator.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  await ImageUtil.waitLoad(img);
  return img;
};

ImageUtil.resizeImage = async (img, mimeType, maxw, colorSpace = "srgb") => {
  const iw = img.width;
  const ih = img.height;
  if (Math.max(iw, ih) < maxw) {
    return img;
  }
  const [dw, dh] = iw > ih ? [maxw, maxw / iw * ih] : [maxw / ih * iw, maxw];
  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const g = canvas.getContext("2d", { colorSpace });
  g.drawImage(img, 0, 0, iw, ih, 0, 0, dw, dh);
  const dataurl = canvas.toDataURL(mimeType);
  const img2 = new Image();
  img2.src = dataurl;
  await ImageUtil.waitLoad(img2);
  return img2;
};

ImageUtil.loadResized = async (file, maxw, maxsize) => {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await ImageUtil.waitLoad(img);
  if (file.type.indexOf("svg") >= 0 && file.size <= parseSize(maxsize)) {
    return img;
  }
  return await ImageUtil.resizeImage(img, file.type, maxw);
};

ImageUtil.fetchImage = async (url) => {
  const img = new Image();
  img.src = url;
  return await waitLoad(img);
};

ImageUtil.getResized = (w, h, min) => {
  if (w > h) {
      return { width: min, height: min * h / w };
  } else {
      return { width: min * w / h, height: min };
  }
};

ImageUtil.isJPEG = (bin) => {
  return bin && bin.length > 0 && bin[0] == 0xff;
};
const binStartsWith = (bin, header) => {
  if (!bin || bin.length < header.length) {
    return false;
  }
  for (let i = 0; i < header.length; i++) {
    if (bin[i] != header[i]) {
      return false;
    }
  }
  return true;
};
ImageUtil.isPNG = (bin) => {
  const header = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  return binStartsWith(bin, header);
}
ImageUtil.isSVG = (bin) => {
  const header = new TextEncoder().encode("<svg ");
  return binStartsWith(bin, header);
}
ImageUtil.getImageExtension = (bin) => {
  if (ImageUtil.isJPEG(bin)) {
    return "jpg";
  } else if (ImageUtil.isPNG(bin)) {
    return "png";
  } else if (ImageUtil.isSVG(bin)) {
    return "svg";
  }
  return null;
};
/*
ImageUtil.parseSize = (bin) => {

};
ImageUtil.parseSizePNG = (bin) => {

};
*/

export { ImageUtil };
