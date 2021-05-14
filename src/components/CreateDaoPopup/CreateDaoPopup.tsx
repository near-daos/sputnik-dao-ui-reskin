import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import useMedia from 'hooks/use-media';

import { StepProgressBar } from 'components/StepProgressBar';
import { DaoLogoButton } from 'components/DaoLogoButton';
import { NearService } from 'services/NearService';
import { getRandomLogo } from 'services/LogoRandomizer';
import { AwsUploader } from 'services/AwsUploader';
import { nearConfig } from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { creatingDaoSelector, daoListSelector } from 'redux/selectors';
import { Button, IconButton, SvgIcon, TextField } from '../UILib';
import { CreateDaoErrors, CreateDaoValues } from './types';
import { validateFirstStep, validateSecondStep } from './validators';

import s from './CreateDaoPopup.module.scss';
import { clearCreatingDaoData, setCreatingDaoData } from '../../redux/actions';

export interface CreateDaoPopupProps {
  className?: string;
  onClose?: () => void;
}

const STEPS = ['General info', 'Details', 'DAO Logo'];

const CreateDaoPopup: React.FC<CreateDaoPopupProps> = ({
  className,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const media = useMedia();
  const dispatch = useDispatch();
  const values = useSelector(creatingDaoSelector);
  const [errors, setErrors] = useState<CreateDaoErrors>({});
  const daoList = useSelector(daoListSelector);

  const handleChange = (field: keyof CreateDaoValues, value: string) => {
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }

    dispatch(
      setCreatingDaoData({
        ...values,
        [field]: value,
      }),
    );
  };

  const onSubmitFirstStep = () => {
    const firstStepErrors = validateFirstStep(values, daoList);

    if (Object.keys(firstStepErrors).length) {
      setErrors({
        ...errors,
        ...firstStepErrors,
      });

      return;
    }

    setActiveStep(2);
  };

  const onSubmitSecondStep = () => {
    const fsecondStepErrors = validateSecondStep(values);

    if (Object.keys(fsecondStepErrors).length) {
      setErrors({
        ...errors,
        ...fsecondStepErrors,
      });

      return;
    }

    setActiveStep(3);
  };

  const onSubmit = async () => {
    const file = await getRandomLogo(
      `${values.name}.${nearConfig.contractName}`,
    );

    dispatch(clearCreatingDaoData());

    await AwsUploader.uploadToBucket(file);
    await NearService.createDao(values);

    onClose?.();
  };

  let progressBarSize: 'sm' | 'md' | 'lg' = 'sm';

  if (media.tabletPortrait) {
    progressBarSize = 'md';
  } else if (media.desktop || media.tabletLandscape) {
    progressBarSize = 'lg';
  }

  const handleClose = () => {
    dispatch(clearCreatingDaoData());
    onClose?.();
  };

  useEffect(() => {
    const handleGoBack = () => {
      if (onClose) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('popstate', handleGoBack, false);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('popstate', handleGoBack);
    };
  }, [onClose]);

  return (
    <div className={cn(s.root, className)}>
      <div className={s.wrapper}>
        <div className={s.header}>
          <Link to="/" className={s.logo}>
            <div className={s.logoImage} />
          </Link>
          <IconButton
            icon="close"
            size="lg"
            variant="outline"
            className={s.mobileClose}
            onClick={handleClose}
          />
          <p className={s.mobileTitle}>Add New DAO</p>
          <StepProgressBar
            steps={STEPS}
            current={activeStep}
            className={s.stepProgressBar}
            size={progressBarSize}
          />
        </div>
        <div className={s.formWrapper}>
          <p className={s.desktopTitle}>Add New DAO</p>
          <IconButton
            icon="close"
            size="lg"
            variant="outline"
            className={s.desktopClose}
            onClick={handleClose}
          />
          {activeStep === 1 && (
            <div className={s.form}>
              <div>
                <TextField
                  name="name"
                  value={values.name}
                  onChange={(value) =>
                    handleChange('name', value.toLowerCase().trim())
                  }
                  error={errors.name}
                  label="Enter DAO Name (will be prefix of .sputnikdao.near)"
                  className={cn(s.input, s.daoName)}
                  helperText="This refers to a sputnikdao.near contract instance. Whatever you input here will be the human-readable account ID of that DAO, for example: name.sputnikdao.near"
                />
                <TextField
                  name="purpose"
                  value={values.purpose}
                  onChange={(value) => handleChange('purpose', value)}
                  error={errors.purpose}
                  label="Enter Purpose"
                  multiline
                  maxLength={280}
                  className={cn(s.texArea, s.purpose)}
                  helperText="Why DAO? Maybe indicate a specific goal related to an established project?"
                />
                <TextField
                  name="council"
                  value={values.council}
                  onChange={(value) => handleChange('council', value)}
                  error={errors.council}
                  multiline
                  label="Enter Council"
                  className={cn(s.input, s.council)}
                  helperText="These .near accounts will be initial members of the DAO’s council, and each member gets one vote on every proposal. Participants can be added / removed from a council. We recommend keeping the council small (3-5 members). By default, majority rule is the policy for all votes."
                />
              </div>
              <Button
                size="lg"
                className={s.singleButton}
                onClick={onSubmitFirstStep}
              >
                Continue
              </Button>
            </div>
          )}
          {activeStep === 2 && (
            <div className={s.form}>
              <div>
                <TextField
                  name="bond"
                  type="number"
                  value={values.bond}
                  onChange={(value) => {
                    handleChange('bond', value);
                  }}
                  error={errors.bond}
                  label="Enter Bond in NEAR"
                  className={cn(s.input, s.bond)}
                  helperText="Minimum amount required to submit a proposal to the council. When a proposal gets approved, this amount is returned. However, if rejected, it goes into the DAO account."
                />
                <TextField
                  type="number"
                  name="votePeriod"
                  value={values.votePeriod}
                  onChange={(value) => handleChange('votePeriod', value)}
                  error={errors.votePeriod}
                  label="Enter Vote Period in hours"
                  className={cn(s.input, s.votePeriod)}
                  helperText="Number of hours that proposals are open for voting. After this amount of time, proposals expire."
                />
                <TextField
                  type="number"
                  name="gracePeriod"
                  value={values.gracePeriod}
                  onChange={(value) => handleChange('gracePeriod', value)}
                  error={errors.gracePeriod}
                  label="Enter Grace Period in hours"
                  className={cn(s.input, s.gracePeriod)}
                  helperText={
                    'Number of hours after the vote period, in which council members can vote "NO" to cancel a payout. This provides an opportunity to speak up when a decision is almost finalized.'
                  }
                />
                <TextField
                  type="number"
                  name="amountToTransfer"
                  value={values.amountToTransfer}
                  onChange={(value) => handleChange('amountToTransfer', value)}
                  error={errors.amountToTransfer}
                  label="Amount to transfer to the DAO"
                  className={cn(s.input, s.amountToTransfer)}
                  helperText="Initial treasury. After your DAO is launched, anyone may transfer NEAR using its human-readable account ID, like this: name.sputnikdao.near"
                />
              </div>
              <div className={s.buttonsWrapper}>
                <Button
                  size="lg"
                  variant="monochrome"
                  leftElement={
                    <SvgIcon icon="dd-arrow" className={s.arrowIcon} />
                  }
                  className={s.button}
                  onClick={() => {
                    setActiveStep(1);
                  }}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className={s.button}
                  onClick={onSubmitSecondStep}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          {activeStep === 3 && (
            <div className={s.step3Wrapper}>
              <div className={s.bannerWrapper}>
                <div className={s.bannerContainer}>
                  {/* <DaoLogoButton */}
                  {/*  title="Purchase a curated NFT logo" */}
                  {/*  description="Unique and perfectly matched logo from dozens of handpicked elements." */}
                  {/*  imageType="exclamation" */}
                  {/*  className={cn(s.banner, s.inactive)} */}
                  {/* /> */}
                  <DaoLogoButton
                    title="Free random logo"
                    description="A randomly generated unique logo from dozens of our assets."
                    imageType="question"
                    className={s.banner}
                  />
                </div>
              </div>
              <div className={s.step3ButtonsWrapper}>
                <Button
                  size="lg"
                  variant="monochrome"
                  leftElement={
                    <SvgIcon icon="dd-arrow" className={s.arrowIcon} />
                  }
                  className={s.button}
                  onClick={() => {
                    setActiveStep(2);
                  }}
                >
                  Back
                </Button>
                <Button size="lg" className={s.button} onClick={onSubmit}>
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDaoPopup;
