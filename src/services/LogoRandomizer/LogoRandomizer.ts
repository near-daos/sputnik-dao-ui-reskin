/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRandomIntInclusive } from 'utils';
import { GradientEffect } from './filters/GradientEffect';
import { iconColors, ringColors } from './settings';

const loadScript = (src: string) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.onload = resolve;
    script.onerror = reject;
    script.src = src;
    document.head.append(script);
  });

const cardWidth = 834;
const cardHeight = 1158;
const frameWidth = 600;
const frameHeight = 900;

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

export const getRandomLogo = async (): Promise<Blob> =>
  new Promise<Blob>((resolve) => {
    if (!fabricPromise) {
      fabricPromise = loadScript(
        '//cdnjs.cloudflare.com/ajax/libs/fabric.js/1.5.0/fabric.min.js',
      );
    }

    fabricPromise.then(async () => {
      GradientEffect(window);

      const ring = getRandomIntInclusive(1, 12);

      const back = await loadImage(`/logo-randomizer/back/back${ring}.png`);
      const shape = await loadImage(
        `/logo-randomizer/shape/shape${getRandomIntInclusive(1, 14)}.png`,
      );
      const front = await loadImage(`/logo-randomizer/front/front${ring}.png`);

      const canvasEl = document.createElement('canvas');

      canvasEl.width = 834;
      canvasEl.height = 1158;

      const canvas = new window.fabric.Canvas(canvasEl);

      canvas.interactive = false;

      canvas.clear();
      addBack(canvas, back, ringColors[getRandomIntInclusive(0, 4)]);
      addShape(canvas, shape, iconColors[getRandomIntInclusive(0, 7)]);
      addFront(canvas, front, ringColors[getRandomIntInclusive(0, 4)]);

      const blob = await new Promise<Blob | null>((resolve1) => {
        setTimeout(() => canvasEl.toBlob(resolve1), 0);
      });

      if (!blob) {
        throw new Error('Error while creating logo');
      }

      resolve(blob);
    });
  });
