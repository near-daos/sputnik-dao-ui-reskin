/* eslint-disable no-console */
import { appConfig } from 'config';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { daoListSelector } from 'redux/selectors';
import { AwsUploader } from 'services/AwsUploader';
import { getRandomLogo } from 'services/LogoRandomizer';
import { checkIfLogoExist } from 'utils';

const LogoRegenerationPage: React.FC = () => {
  const daoList = useSelector(daoListSelector);

  useEffect(() => {
    daoList.forEach(async (dao) => {
      const isLogoExist = await checkIfLogoExist(dao.id);

      console.log(
        'Check if logo exist: ',
        `${appConfig.logoPath}${dao.id}.png`,
        ' - ',
        isLogoExist,
      );

      if (!isLogoExist) {
        console.log('Run logo generation for dao: ', dao.id);

        const file = await getRandomLogo(dao.id);

        console.log('Logo generated for dao: ', dao.id);

        await AwsUploader.uploadToBucket(file);

        console.log('Logo uploaded for dao: ', dao.id);
      }
    });
  }, [daoList]);

  return null;
};

export default LogoRegenerationPage;
