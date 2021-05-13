import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import useMedia from 'hooks/use-media';

import { Button, IconButton, SvgIcon } from 'components/UILib';
import { DaoCard } from 'components/DaoCard';
// import SearchBar from 'components/SearchBar';
import { useHistory } from 'react-router-dom';
import { daoListSelector } from 'redux/selectors';

import { fetchDaoList } from 'redux/actions';
import { DaoItem } from 'types/dao';
import s from './SelectDao.module.scss';

export interface SelectDaoProps {
  className?: string;
}

enum Mode {
  Carousel,
  Grid,
}

export const SelectDao: React.FC<SelectDaoProps> = ({ className }) => {
  const [mode, setMode] = useState(Mode.Grid);
  const [activeSlide, setActiveSlide] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [swiper, setSwiper] = useState<any>();
  const media = useMedia();
  const [searchText] = useState('');
  const history = useHistory();
  const daoList = useSelector(daoListSelector);

  const [filteredDaoList, setFilteredDaoList] = useState<DaoItem[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDaoList.started());
  }, [dispatch]);

  useEffect(() => {
    if (!searchText) {
      const reverseArray = daoList.slice().reverse();

      // test.reverse();
      setFilteredDaoList(reverseArray);

      return;
    }

    const filtered = daoList.filter((i) =>
      i.id.toLowerCase().includes(searchText.toLowerCase()),
    );

    setFilteredDaoList(filtered);
  }, [daoList, searchText]);

  const handleCarouselMode = () => {
    setMode(Mode.Carousel);
    setTimeout(() => {
      swiper.update();
    }, 0);
  };

  const handleGridMode = () => {
    setMode(Mode.Grid);
  };

  const handleSelectDao = () => {
    history.push(`/dao/${daoList[activeSlide].id}`);
  };

  return (
    <div className={cn(s.root, className)}>
      <section className={s.panel}>
        <div>
          <h1 className={s.title}>Select DAO</h1>
          <span className={s.number}>({daoList.length})</span>
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
          {/* <SearchBar */}
          {/*  className={s.search} */}
          {/*  placeholder="DAO search" */}
          {/*  value={searchText} */}
          {/*  onChange={setSearchText} */}
          {/*  name="search" */}
          {/*  size="md" */}
          {/* /> */}
        </div>
      </section>
      <section className={cn(s.grid, { [s.hidden]: mode !== Mode.Grid })}>
        {filteredDaoList.map((dao) => (
          <DaoCard key={dao.id} className={s.card} dao={dao} size="md" />
        ))}
      </section>
      <section
        className={cn(s.carousel, { [s.hidden]: mode !== Mode.Carousel })}
      >
        <div className={s.carouselContainer}>
          <div className={s.carouselList}>
            {filteredDaoList.length > 0 && (
              <Swiper
                observer
                spaceBetween={72}
                loop={filteredDaoList.length > 1}
                slidesPerView="auto"
                centeredSlides
                grabCursor
                initialSlide={activeSlide}
                onSlideChange={(swiperObject) => {
                  const index = swiperObject.realIndex;

                  setActiveSlide(index);
                }}
                onSwiper={(swiperObject) => {
                  setSwiper(swiperObject);
                }}
                onClick={(swiperObject) => {
                  if (swiperObject.clickedIndex === swiperObject.activeIndex) {
                    history.push(`/dao/${daoList[swiperObject.realIndex].id}`);
                  } else {
                    swiperObject.slideTo(swiperObject.clickedIndex);
                  }
                }}
              >
                {filteredDaoList.map((dao, index) => (
                  <SwiperSlide key={dao.id} className={s.cardHolder}>
                    <DaoCard
                      className={cn(s.card, {
                        [s.activeCard]: activeSlide === index,
                      })}
                      dao={dao}
                      size="lg"
                      disableCornerAnimation={activeSlide !== index}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </section>
      <section
        className={cn(s.controls, { [s.hidden]: mode !== Mode.Carousel })}
      >
        {media.mobile ? (
          <IconButton
            icon="dd-arrow"
            className={s.slideButton}
            variant="monochrome"
            size="lg"
            onClick={() => swiper.slidePrev()}
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
            onClick={() => swiper.slidePrev()}
          >
            Previous DAO
          </Button>
        )}
        <Button size="lg" onClick={handleSelectDao}>
          Select DAO
        </Button>
        {media.mobile ? (
          <IconButton
            icon="dd-arrow"
            className={s.slideButton}
            variant="monochrome"
            size="lg"
            onClick={() => swiper.slideNext()}
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
            onClick={() => swiper.slideNext()}
          >
            Next DAO
          </Button>
        )}
      </section>
    </div>
  );
};
