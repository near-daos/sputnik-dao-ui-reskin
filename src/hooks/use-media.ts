import { useEffect, useState } from 'react';

export const breakpoints = {
  mobile: 768,
  tabletPortrait: 992,
  tabletLandscape: 1200,
};

type Media = {
  mobile: boolean;
  desktop: boolean;
  tabletLandscape: boolean;
  tabletPortrait: boolean;
};

export default function useMedia(): Media {
  const [media, setMedia] = useState<Media>({
    mobile: false,
    desktop: false,
    tabletLandscape: false,
    tabletPortrait: false,
  });

  useEffect(() => {
    const onResize = () => {
      setMedia({
        mobile: window.innerWidth < breakpoints.mobile,
        tabletPortrait:
          window.innerWidth <= breakpoints.tabletPortrait &&
          window.innerWidth >= breakpoints.mobile,
        tabletLandscape:
          window.innerWidth < breakpoints.tabletLandscape &&
          window.innerWidth > breakpoints.tabletPortrait,
        desktop: window.innerWidth > breakpoints.tabletLandscape,
      });
    };

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return media;
}
