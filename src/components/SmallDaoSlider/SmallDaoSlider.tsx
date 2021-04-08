import React, { useRef, useState } from 'react';
import cn from 'classnames';

import Slider from 'react-slick';
import { DaoCardMini } from 'components/DaoCardMini';
import { Dao } from 'types/dao';
import { useHistory } from 'react-router-dom';
import s from './SmallDaoSlider.module.scss';

export interface SmallDaoSliderProps {
  className?: string;
  daos: Dao[];
  activeDaoId: string;
}

const SmallDaoSlider: React.FC<SmallDaoSliderProps> = ({
  className,
  daos,
  activeDaoId,
}) => {
  const [activeSlide, setActiveSlide] = useState(
    daos.findIndex((item) => item.id === activeDaoId),
  );
  const history = useHistory();
  const carousel = useRef<Slider>(null);

  const carouselSettings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 7,
    speed: 500,
    arrows: false,
    focusOnSelect: true,
    initialSlide: activeSlide,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    ref: carousel,
    afterChange: (newIndex: number) => {
      history.push(`/dao/${newIndex}`);
      setActiveSlide(newIndex);
    },
  };

  return (
    <div className={cn(s.root, className)}>
      <Slider {...carouselSettings}>
        {daos.map((dao) => (
          <DaoCardMini
            key={dao.id}
            className={s.daoCard}
            dao={dao}
            active={dao.id === daos[activeSlide].id}
          />
        ))}
      </Slider>
    </div>
  );
};

export default SmallDaoSlider;
