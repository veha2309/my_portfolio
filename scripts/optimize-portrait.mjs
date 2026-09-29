import sharp from "sharp";

// Re-encode the supplied photograph without cropping or altering its contents.
const source = "public/images/vedant-portrait.png";
await sharp(source)
  .rotate()
  .webp({ quality: 85, effort: 6 })
  .toFile("public/images/vedant-portrait.webp");
const metadata = await sharp("public/images/vedant-portrait.webp").metadata();
console.log(
  JSON.stringify({
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
  }),
);
