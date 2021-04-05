import { useEffect, useState } from 'react';

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
        mobile: window.innerWidth < 768,
        tabletPortrait: window.innerWidth <= 992 && window.innerWidth >= 768,
        tabletLandscape: window.innerWidth < 1200 && window.innerWidth > 992,
        desktop: window.innerWidth > 1200,
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
