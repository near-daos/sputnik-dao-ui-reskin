import React, { useState } from 'react';
import SwiperCore, { Mousewheel, Controller } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperClass from 'swiper/types/swiper-class';

import { LandingHeader } from 'components/LandingHeader';
import { LandingFooter } from 'components/LandingFooter';
import { LandingHome } from 'components/LandingHome';
import { HowItWorks } from 'components/HowItWorks';
import { Developers } from 'components/Developers';
import { CommunityConnect } from 'components/CommunityConnect';
import { CreateYourDao } from 'components/CreateYourDao';
import { breakpoints } from 'hooks/use-media';
import { ProgressBar } from 'components/UILib';

import s from './LandingPage.module.scss';

const DEFAULT_LANDING_THEME = 'dark';

SwiperCore.use([Mousewheel, Controller]);

const landingSlides = [
  {
    name: 'Home',
    children: LandingHome,
  },
  {
    name: 'How it works',
    children: HowItWorks,
  },
  {
    name: 'Developers',
    children: Developers,
  },
  {
    name: 'Community',
    children: CommunityConnect,
  },
  {
    name: 'Create DAO',
    children: CreateYourDao,
  },
];

export const LandingPage: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperClass>();

  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveSlide(swiper.activeIndex);
  };

  const handleGoTo = (index: number) => {
    controlledSwiper?.slideTo(index);
  };

  const progress = ((activeSlide + 1) / landingSlides.length) * 100;

  return (
    <div className={s.root} id="themed" data-theme={DEFAULT_LANDING_THEME}>
      <div className={s.background}>
        <LandingHeader
          className={s.header}
          activeMenuItem={activeSlide}
          goToSlide={handleGoTo}
          menuLinks={landingSlides.map((slide) => slide.name)}
        />
        <main className={s.content}>
          <Swiper
            className={s.slider}
            spaceBetween={50}
            slidesPerView={1}
            direction="vertical"
            speed={700}
            mousewheel
            simulateTouch
            resizeObserver
            onSlideChange={handleSlideChange}
            controller={{ control: controlledSwiper }}
            onSwiper={(swiper) => setControlledSwiper(swiper)}
            breakpoints={{
              [breakpoints.tabletLandscape]: {
                direction: 'horizontal',
              },
            }}
          >
            {landingSlides.map(({ name, children: Element }) => (
              <SwiperSlide className={s.slide} key={name}>
                <Element />
              </SwiperSlide>
            ))}
          </Swiper>
          <ProgressBar className={s.progress} progress={progress} />
        </main>
      </div>
      <LandingFooter className={s.footer} />
    </div>
  );
};
