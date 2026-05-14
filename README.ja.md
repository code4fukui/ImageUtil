# ImageUtil

画像処理および操作のためのJavaScriptライブラリです。

## 機能

- 画像の読み込みと完了の待機
- 画像またはキャンバスから`ArrayBuffer`を取得
- `ArrayBuffer`から`Image`オブジェクトを取得
- アスペクト比を維持したまま画像をリサイズ
- ファイルから画像を読み込んでリサイズ
- URLから画像を取得
- `ArrayBuffer`から画像の拡張子（JPEG、PNG、SVG）を取得

## 要件

外部依存関係はありません。

## 使い方

`ImageUtil`モジュールをインポートします:

```javascript
import { ImageUtil } from "https://js.sabae.cc/ImageUtil.js";
```

その後、利用可能なメソッドを使用します:

```javascript
const img = new Image();
img.src = "example.jpg";
await ImageUtil.waitLoad(img);

const bin = await ImageUtil.getArrayBufferFromImage(img);
const resizedImg = await ImageUtil.resizeImage(img, "image/jpeg", 200);
```

## ライセンス

MIT License — 詳細は[LICENSE](LICENSE)を参照してください。
