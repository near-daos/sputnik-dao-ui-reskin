import React, { useRef, useState } from 'react';
import cn from 'classnames';
import Slider from 'react-slick';
import { useMediaQuery } from 'react-responsive';

import { Button, IconButton, SvgIcon } from 'components/UILib';
import { SearchAutoComplete } from 'components/SearchAutoComplete';
import { DaoCard } from 'components/DaoCard';
import { mockDaos } from './mockData';

import s from './SelectDao.module.scss';

export interface SelectDaoProps {
  className?: string;
}

enum Mode {
  Carousel,
  Grid,
}

export const SelectDao: React.FC<SelectDaoProps> = ({ className }) => {
  const [mode, setMode] = useState(Mode.Carousel);
  const [activeSlide, setActiveSlide] = useState(0);
  const carousel = useRef<Slider>(null);

  const isMobile = useMediaQuery({
    query: '(max-device-width: 767px)', // TODO: need to think about better approach
  });

  const carouselSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    arrows: false,
    initialSlide: activeSlide,
    centerPadding: '0px',
    beforeChange: (oldIndex: number, newIndex: number) => {
      setActiveSlide(newIndex);
    },
    ref: carousel,
  };

  const handleCarouselMode = () => {
    setMode(Mode.Carousel);
  };

  const handleGridMode = () => {
    setMode(Mode.Grid);
  };

  return (
    <div className={cn(s.root, className)}>
      <section className={s.panel}>
        <div>
          <h1 className={s.title}>Select DAO</h1>
          <span className={s.number}>(701984)</span>
        </div>
        <div className={s.view}>
          <div className={s.viewModes}>
            <IconButton
              className={cn(s.viewMode, {
                [s.activeMode]: mode === Mode.Carousel,
              })}
              active={mode === Mode.Carousel}
              onClick={handleCarouselMode}
              variant="clear"
              icon="carousel"
              size="lg"
            />
            <IconButton
              className={cn(s.viewMode, { [s.activeMode]: mode === Mode.Grid })}
              active={mode === Mode.Grid}
              onClick={handleGridMode}
              variant="clear"
              icon="grid"
              size="lg"
            />
          </div>
          <SearchAutoComplete className={s.search} searchBarSize="md" />
        </div>
      </section>
      <section className={cn(s.grid, { [s.hidden]: mode !== Mode.Grid })}>
        {mockDaos.map((dao) => (
          <DaoCard key={dao.id} className={s.card} dao={dao} size="md" />
        ))}
      </section>
      <section
        className={cn(s.carousel, { [s.hidden]: mode !== Mode.Carousel })}
      >
        <div className={s.carouselContainer}>
          <div className={s.carouselList}>
            <Slider {...carouselSettings}>
              {mockDaos.map((dao, index) => (
                <div className={s.cardHolder} key={dao.id}>
                  <DaoCard
                    className={cn(s.card, {
                      [s.activeCard]: activeSlide === index,
                    })}
                    dao={dao}
                    size="lg"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
      <section
        className={cn(s.controls, { [s.hidden]: mode !== Mode.Carousel })}
      >
        {isMobile ? (
          <IconButton
            icon="dd-arrow"
            className={s.slideButton}
            variant="monochrome"
            size="lg"
            onClick={() => carousel.current?.slickPrev()}
            iconClassName={s.leftArrowIcon}
          />
        ) : (
          <Button
            className={s.slideButton}
            variant="monochrome"
            leftElement={
              <SvgIcon className={s.leftArrowIcon} icon="dd-arrow" />
            }
            size="lg"
            onClick={() => carousel.current?.slickPrev()}
          >
            Previous DAO
          </Button>
        )}
        <Button size="lg">Select DAO</Button>
        {isMobile ? (
          <IconButton
            icon="dd-arrow"
            className={s.slideButton}
            variant="monochrome"
            size="lg"
            onClick={() => carousel.current?.slickNext()}
            iconClassName={s.rightArrowIcon}
          />
        ) : (
          <Button
            className={s.slideButton}
            variant="monochrome"
            rightElement={
              <SvgIcon className={s.rightArrowIcon} icon="dd-arrow" />
            }
            size="lg"
            onClick={() => carousel.current?.slickNext()}
          >
            Next DAO
          </Button>
        )}
      </section>
    </div>
  );
};
