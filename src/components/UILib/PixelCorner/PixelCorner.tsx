import React, { useCallback, useEffect, useState, useRef } from 'react';
import cn from 'classnames';

import { shuffleArray } from 'utils/shuffleArray';
import { getRandomInt, getRandomNum } from 'utils/randomNumber';

import s from './PixelCorner.module.scss';

const ANIMATION_MAX_TIMING = 50000;
const ANIMATION_COOL_DOWN = 10000;
const ANIMATED_PIXELS_RANGE_PERCENTAGE = 60;
const DELAY_RANGE = 0.5;

const pixelsMatrix = [
  '1111111111',
  '1111111110',
  '1111111100',
  '1111111100',
  '1111110000',
  '1111000000',
  '1111000000',
];

export enum PixelCornerColors {
  Grey = 'grey',
  Green = 'green',
  Red = 'red',
  Yellow = 'yellow',
  Pink = 'pink',
}

export interface PixelCornerProps {
  className?: string;
  animated?: boolean;
  color?: PixelCornerColors;
}

const PixelCorner: React.FC<PixelCornerProps> = ({
  color = 'grey',
  animated = true,
  className,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeElements, setActiveElements] = useState<number[]>([]);

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pickActiveElements = useCallback(() => {
    let elements: number[] = [];
    const pixels = Array.from(pixelsMatrix.join('')).reduce(
      (acc, character) => acc + Number(character),
      0,
    );

    for (let i = 0; i < pixels; i += 1) {
      elements[i] = i;
    }

    elements = shuffleArray(elements);

    elements.length = getRandomInt(
      elements.length * ((50 - ANIMATED_PIXELS_RANGE_PERCENTAGE / 2) / 100),
      elements.length * ((50 + ANIMATED_PIXELS_RANGE_PERCENTAGE / 2) / 100),
    );

    return elements;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeouts.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
  }, [timeouts]);

  const runAnimation = useCallback(() => {
    setActiveElements(pickActiveElements());

    timeouts.current[0] = setTimeout(() => {
      setShowAnimation(true);
      setActiveElements(pickActiveElements());

      timeouts.current[1] = setTimeout(() => {
        setShowAnimation(false);
      }, 1000);

      timeouts.current[2] = setTimeout(() => {
        runAnimation();
      }, ANIMATION_COOL_DOWN);
    }, getRandomInt(0, ANIMATION_MAX_TIMING));
  }, [pickActiveElements]);

  useEffect(() => {
    if (animated) {
      runAnimation();
    }

    return clearAllTimeouts;
  }, [runAnimation, animated, clearAllTimeouts]);

  const renderPixels = () => {
    let index = 0;

    return pixelsMatrix.map((pixelRow, y) =>
      Array.from(pixelRow).map((pixel, x) => {
        if (!Number(pixel)) {
          return null;
        }

        index += 1;

        return (
          <rect
            key={index}
            width="1"
            height="1"
            x={x}
            y={y}
            style={{ animationDelay: `${getRandomNum(0, DELAY_RANGE)}s` }}
            className={activeElements.includes(index) ? s.active : ''}
          />
        );
      }),
    );
  };

  return (
    <div
      className={cn(
        s.root,
        s[color],
        { [s.animated]: showAnimation },
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${pixelsMatrix[0].length} ${pixelsMatrix.length}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderPixels()}
      </svg>
    </div>
  );
};

export default PixelCorner;
