import cn from 'classnames';
import React, { FC } from 'react';
import ReactCountdown, { zeroPad, CountdownRenderProps } from 'react-countdown';

import s from './Countdown.module.scss';

interface CountdownProps {
  hidden?: boolean;
  className?: string;
  date: Date | number | string;
}

export const Countdown: FC<CountdownProps> = (props) => {
  const { date, hidden, className } = props;

  function renderTimeSlot(slot: number, index: number, slots: number[]) {
    const delimiter = index < slots.length - 1 ? ':' : '';

    const slotClassName = cn(s.part, {
      [s.positive]: slot > 0 || slots[index - 1] > 0,
    });

    return (
      <span key={index}>
        <span className={slotClassName}>{zeroPad(slot)}</span>
        <span className={s.part}>{delimiter}</span>
      </span>
    );
  }

  function renderer(renderProps: CountdownRenderProps) {
    const { days, hours, minutes, seconds, completed } = renderProps;

    if (completed || hidden) {
      return null;
    }

    const slots = [days, hours, minutes, seconds];

    return (
      <span className={cn(s.root, className)}>{slots.map(renderTimeSlot)}</span>
    );
  }

  return <ReactCountdown date={date} renderer={renderer} />;
};
