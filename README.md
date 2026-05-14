# ImageUtil

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A JavaScript library for image processing and manipulation.

## Features

- Load and wait for image to be loaded
- Get an `ArrayBuffer` from an image or canvas
- Get an `Image` object from an `ArrayBuffer`
- Resize an image while maintaining aspect ratio
- Load and resize an image from a file
- Fetch an image from a URL
- Get the image extension (JPEG, PNG, SVG) from an `ArrayBuffer`

## Requirements

No external dependencies.

## Usage

Import the `ImageUtil` module:

```javascript
import { ImageUtil } from "https://js.sabae.cc/ImageUtil.js";
```

Then, use the available methods:

```javascript
const img = new Image();
img.src = "example.jpg";
await ImageUtil.waitLoad(img);

const bin = await ImageUtil.getArrayBufferFromImage(img);
const resizedImg = await ImageUtil.resizeImage(img, "image/jpeg", 200);
```

## License

MIT License — see [LICENSE](LICENSE).