/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRandomIntInclusive, shuffle } from 'utils';
import { GradientEffect } from './filters/GradientEffect';
import { iconColors, ringColors } from './settings';

const cardWidth = 450;
const cardHeight = 600;
const frameWidth = 400;
const frameHeight = 600;

const getVariation = (
  numberOfRings: number,
  numberOfShapes: number,
  numberOfRingColors: number,
  numberOfShapeColors: number,
) => {
  const variations = [];

  for (let r = 0; r < numberOfRings; r++) {
    for (let s = 0; s < numberOfShapes; s++) {
      for (let rc = 0; rc < numberOfRingColors; rc++) {
        for (let sc = 0; sc < numberOfShapeColors; sc++) {
          variations.push([r, s, rc, sc]);
        }
      }
    }
  }

  shuffle(variations);

  return variations;
};

const loadScript = (src: string) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.onload = resolve;
    script.onerror = reject;
    script.src = src;
    document.head.append(script);
  });

export const loadImage = (url: string): any =>
  new Promise((resolve) => window.fabric.Image.fromURL(url, resolve));

export const getGradient = (
  colorParams: any,
  width: number,
  height: number,
): any => ({
  x1: 0,
  y1: 0,
  x2: colorParams.type === 'vertical' ? 0 : width,
  y2: height,
  colorStops: colorParams.colors,
});

export const addBack = (canvas: any, img: any, colorParams: any): void => {
  const gradient = getGradient(colorParams, img.width, img.height);

  img.filters.push(
    new window.fabric.Image.filters.GradientEffect({
      gradient,
      img,
    }),
  );

  img.applyFilters(canvas.renderAll.bind(canvas));

  img.set({
    width: frameWidth,
    height: frameHeight,
    left: cardWidth / 2,
    top: cardHeight / 2,
    originX: 'center',
    originY: 'center',
  });

  canvas.moveTo(img, 1);
};

export function addShape(canvas: any, img: any, colorParams: any): void {
  const gradient = getGradient(colorParams, img.width, img.height);

  img.filters.push(
    new window.fabric.Image.filters.GradientEffect({
      gradient,
      img,
    }),
  );

  img.applyFilters(canvas.renderAll.bind(canvas));

  img.set({
    width: img.width,
    height: img.height,
    left: cardWidth / 2,
    top: cardHeight / 2,
    originX: 'center',
    originY: 'center',
  });

  canvas.moveTo(img, 2);
}

export const addFront = (canvas: any, img: any, colorParams: any): void => {
  const gradient = getGradient(colorParams, img.width, img.height);

  img.filters.push(
    new window.fabric.Image.filters.GradientEffect({
      gradient,
      img,
    }),
  );

  img.applyFilters(canvas.renderAll.bind(canvas));

  img.set({
    width: frameWidth,
    height: frameHeight,
    left: cardWidth / 2,
    top: cardHeight / 2,
    originX: 'center',
    originY: 'center',
  });

  canvas.moveTo(img, 3);
};

let fabricPromise: Promise<unknown> | null = null;
const variations = getVariation(11, 13, 4, 7);

export const getRandomLogo = async (logoName: string): Promise<File> =>
  new Promise<File>((resolve) => {
    if (!fabricPromise) {
      fabricPromise = loadScript(
        '//cdnjs.cloudflare.com/ajax/libs/fabric.js/1.5.0/fabric.min.js',
      );
    }

    fabricPromise.then(async () => {
      GradientEffect(window);

      const [
        ringIndex,
        shapeIndex,
        ringColorIndex,
        shapeColorIndex,
      ] = variations[getRandomIntInclusive(0, variations.length - 1)];

      const back = await loadImage(
        `/logo-randomizer/back/back${ringIndex + 1}.png`,
      );
      const shape = await loadImage(
        `/logo-randomizer/shape/shape${shapeIndex + 1}.png`,
      );
      const front = await loadImage(
        `/logo-randomizer/front/front${ringIndex + 1}.png`,
      );

      const canvasEl = document.createElement('canvas');

      canvasEl.width = cardWidth;
      canvasEl.height = cardHeight;

      const canvas = new window.fabric.Canvas(canvasEl);

      canvas.interactive = false;

      canvas.clear();
      addBack(canvas, back, ringColors[ringColorIndex]);
      addShape(canvas, shape, iconColors[shapeColorIndex]);
      addFront(canvas, front, ringColors[ringColorIndex]);

      const blob = await new Promise<Blob | null>((resolve1) => {
        setTimeout(() => canvasEl.toBlob(resolve1), 0);
      });

      if (!blob) {
        throw new Error('Error while creating logo');
      }

      const file = new File([blob], `${logoName}.png`);

      resolve(file);
    });
  });
