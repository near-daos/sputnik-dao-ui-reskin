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

      if (!isLogoExist) {
        const file = await getRandomLogo(dao.id);

        await AwsUploader.uploadToBucket(file);
      }
    });
  }, [daoList]);

  return null;
};

export default LogoRegenerationPage;
