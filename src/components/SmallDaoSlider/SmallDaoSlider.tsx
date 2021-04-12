import React, { useState } from 'react';
import cn from 'classnames';

import { Swiper, SwiperSlide } from 'swiper/react';
import { DaoCardMini } from 'components/DaoCardMini';
import { DaoItem } from 'types/dao';
import { useHistory } from 'react-router-dom';
import s from './SmallDaoSlider.module.scss';

export interface SmallDaoSliderProps {
  className?: string;
  daos: DaoItem[];
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

  return (
    <div className={cn(s.root, className)}>
      <Swiper
        spaceBetween={30}
        loop
        slidesPerView={2}
        slideToClickedSlide
        centeredSlides
        grabCursor
        initialSlide={activeSlide}
        breakpoints={{
          500: {
            slidesPerView: 2,
          },
          620: {
            slidesPerView: 3,
          },
          800: {
            slidesPerView: 4,
          },
          1000: {
            slidesPerView: 5,
          },
          1200: {
            slidesPerView: 6,
          },
          1400: {
            slidesPerView: 7,
          },
        }}
        onSlideChange={(swiper) => {
          const index = swiper.realIndex;

          setActiveSlide(index);
          console.log(index);
          history.push(`/dao/${daos[index].id}`);
        }}
      >
        {daos.map((dao) => (
          <SwiperSlide key={dao.id}>
            <DaoCardMini
              key={dao.id}
              className={s.daoCard}
              dao={dao}
              active={dao.id === daos[activeSlide].id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SmallDaoSlider;
