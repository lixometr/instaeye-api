if (process.env.NODE_ENV !== 'development') {
  require('@tensorflow/tfjs-node');
}
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import * as path from 'path';
import fetch from 'node-fetch';

const minConfidence = 0.5;
const { Canvas, Image, ImageData } = canvas;
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch });
export class ImageDetect {
  async init() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(
      path.resolve(__dirname, '../../../public/weights'),
    );
    await faceapi.nets.faceLandmark68Net.loadFromDisk(
      path.resolve(__dirname, '../../../public/weights'),
    );
    await faceapi.nets.ageGenderNet.loadFromDisk(
      path.resolve(__dirname, '../../../public/weights'),
    );
  }
  async detect(imagePath: string) {
    const img = await canvas.loadImage(imagePath);
    const detections = await faceapi
      .detectSingleFace(
        // @ts-ignore
        img,
        new faceapi.SsdMobilenetv1Options({ minConfidence }),
      )
      .withAgeAndGender();
    return detections;
  }
}
