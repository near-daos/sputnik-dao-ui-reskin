import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from 'components/UILib';

import { ReactComponent as Houses } from 'images/houses.svg';
import { ReactComponent as CometSky } from 'images/comet-sky.svg';

import s from './CreateYourDao.module.scss';

const CreateYourDao: React.FC = () => {
  const history = useHistory();

  const handleCreateDao = () => {
    history.push(`/select-dao?create-dao-popup=true`);
  };

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h3 className={s.heading}>Create your dao</h3>
        <p className={s.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <Button className={s.button} size="lg" onClick={handleCreateDao}>
          Create DAO
        </Button>
      </div>
      <div className={s.figureContainer}>
        <CometSky className={s.cometsFigure} />
        <Houses className={s.cityFigure} />
      </div>
    </div>
  );
};

export default CreateYourDao;
