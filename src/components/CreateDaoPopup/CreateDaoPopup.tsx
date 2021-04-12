import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { SputnikDaoLogo } from 'components/SputnikDaoLogo';
import useMedia from 'hooks/use-media';

import { StepProgressBar } from 'components/StepProgressBar';
import { DaoLogoButton } from 'components/DaoLogoButton';
import { NearService } from 'services/NearService';
import s from './CreateDaoPopup.module.scss';
import { Button, IconButton, SvgIcon, TextField } from '../UILib';
import { CreateDaoErrors, CreateDaoValues } from './types';
import { validateFirstStep, validateSecondStep } from './validators';

export interface CreateDaoPopupProps {
  className?: string;
  onClose?: () => void;
}

const STEPS = ['General info', 'Details', 'DAO Logo'];

const initialValues: CreateDaoValues = {
  name: '',
  purpose: '',
  council: '',
  bond: '',
  votePeriod: '',
  gracePeriod: '',
  amountToTransfer: '',
};

const CreateDaoPopup: React.FC<CreateDaoPopupProps> = ({
  className,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const media = useMedia();
  const [values, setValues] = useState<CreateDaoValues>(initialValues);
  const [errors, setErrors] = useState<CreateDaoErrors>({});

  const handleChange = (field: keyof CreateDaoValues, value: string) => {
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }

    setValues({
      ...values,
      [field]: value,
    });
  };

  const onSubmitFirstStep = () => {
    const firstStepErrors = validateFirstStep(values);

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
    const response = await NearService.createDao(values);

    console.log('response: ', response);

    onClose?.();
  };

  let progressBarSize: 'sm' | 'md' | 'lg' = 'sm';

  if (media.tabletPortrait) {
    progressBarSize = 'md';
  } else if (media.desktop || media.tabletLandscape) {
    progressBarSize = 'lg';
  }

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
            <SputnikDaoLogo />
          </Link>
          <IconButton
            icon="close"
            size="lg"
            variant="outline"
            className={s.mobileClose}
            onClick={onClose}
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
            onClick={onClose}
          />
          {activeStep === 1 && (
            <div className={s.form}>
              <div>
                <TextField
                  name="name"
                  value={values.name}
                  onChange={(value) => handleChange('name', value)}
                  error={errors.name}
                  label="Enter DAO Name"
                  className={cn(s.input, s.daoName)}
                />
                <TextField
                  name="purpose"
                  value={values.purpose}
                  onChange={(value) => handleChange('purpose', value)}
                  error={errors.purpose}
                  label="Enter Purpose"
                  multiline
                  maxLength={300}
                  className={s.texArea}
                />
                <TextField
                  name="council"
                  value={values.council}
                  onChange={(value) => handleChange('council', value)}
                  error={errors.council}
                  multiline
                  label="Enter Council"
                  className={s.input}
                  helperText="One account per line"
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
                  value={values.bond}
                  onChange={(value) => handleChange('bond', value)}
                  error={errors.bond}
                  label="Enter Bond in NEAR"
                  className={s.input}
                />
                <TextField
                  name="votePeriod"
                  value={values.votePeriod}
                  onChange={(value) => handleChange('votePeriod', value)}
                  error={errors.votePeriod}
                  label="Enter Vote Period in hours"
                  className={s.input}
                />
                <TextField
                  name="gracePeriod"
                  value={values.gracePeriod}
                  onChange={(value) => handleChange('gracePeriod', value)}
                  error={errors.gracePeriod}
                  label="Enter Grace Period in hours"
                  className={s.input}
                />
                <TextField
                  name="amountToTransfer"
                  value={values.amountToTransfer}
                  onChange={(value) => handleChange('amountToTransfer', value)}
                  error={errors.amountToTransfer}
                  label="Amount to transfer to the DAO"
                  className={s.input}
                  helperText="Minimum 35 NEAR for storage"
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
                  <DaoLogoButton
                    title="Purchase a curated NFT logo"
                    description="Unique and perfectly matched logo from dozens of handpicked elements."
                    imageType="exclamation"
                    className={cn(s.banner, s.inactive)}
                  />
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
