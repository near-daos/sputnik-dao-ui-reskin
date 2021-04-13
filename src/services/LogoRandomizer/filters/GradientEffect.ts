/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore

export function GradientEffect(global) {
  const fabric = global.fabric || (global.fabric = {});
  const { extend } = fabric.util.object;

  fabric.Image.filters.GradientEffect = fabric.util.createClass(
    fabric.Image.filters.BaseFilter,
    {
      type: 'GradientEffect',

      initialize(options: any) {
        options = options || {};
        this.gradient = options.gradient || {};
        this.img = options.img;
      },

      applyTo(canvasEl: any) {
        const gr = this.gradient;
        const w = this.img._element.naturalWidth;
        const h = this.img._element.naturalHeight;
        const hc = document.createElement('canvas');

        hc.setAttribute('width', w);
        hc.setAttribute('height', h);

        const fhc = new fabric.Canvas(hc);
        const rect = new fabric.Rect({
          fill: 'transparent',
          width: w,
          height: h,
        });

        rect.setGradient('fill', gr);

        fhc.add(rect);
        fhc.renderAll();

        const ifhcContext = fhc.getContext('2d');
        const fhcImageData = ifhcContext.getImageData(
          0,
          0,
          fhc.width,
          fhc.height,
        );
        const fhcData = fhcImageData.data;

        const context = canvasEl.getContext('2d');
        const imageData = context.getImageData(
          0,
          0,
          canvasEl.width,
          canvasEl.height,
        );
        const { data } = imageData;

        for (let i = 0, n = data.length; i < n; i += 4) {
          if (data[i] !== 0 && data[i + 1] !== 0 && data[i + 2] !== 0) {
            data[i] += fhcData[i];
            data[i + 1] += fhcData[i + 1];
            data[i + 2] += fhcData[i + 2];
          }
        }

        context.putImageData(imageData, 0, 0);
      },

      toObject() {
        return extend(this.callSuper('toObject'), {
          gradient: this.gradient,
        });
      },
    },
  );

  fabric.Image.filters.GradientEffect.fromObject = (object: any): any =>
    new fabric.Image.filters.GradientEffect(object);
}
