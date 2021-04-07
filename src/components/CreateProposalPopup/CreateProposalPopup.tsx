import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { SputnikDaoLogo } from 'components/SputnikDaoLogo';
import useMedia from 'hooks/use-media';

import { StepProgressBar } from 'components/StepProgressBar';
import s from './CreateProposalPopup.module.scss';
import { Button, IconButton, SvgIcon, TextField } from '../UILib';

export interface CreateProposalPopupProps {
  className?: string;
  daoName: string;
  onClose?: () => void;
}

const STEPS = ['General info', 'Required details', 'Other details'];

const CreateProposalPopup: React.FC<CreateProposalPopupProps> = ({
  className,
  onClose,
  daoName,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const media = useMedia();

  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [council, setCouncil] = useState('');

  const [bond, setBond] = useState('');
  const [votePeriod, setVotePeriod] = useState('');
  const [gracePeriod, setGracePeriod] = useState('');
  const [amountToTransfer, setAmountToTransfer] = useState('');

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit form');
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

    window.addEventListener('popstate', handleGoBack, false);

    return () => {
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
          <p className={s.mobileTitle}>Add New proposal</p>
          <p className={s.desktopDaoName}>{daoName}</p>
          <StepProgressBar
            steps={STEPS}
            current={activeStep}
            className={s.stepProgressBar}
            size={progressBarSize}
          />
        </div>
        <div className={s.formWrapper}>
          <p className={s.desktopTitle}>Add New proposal</p>
          <p className={s.desktopDaoName}>{daoName}</p>
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
                  value={name}
                  onChange={setName}
                  label="Enter DAO Name"
                  className={s.input}
                />
                <TextField
                  name="purpose"
                  value={purpose}
                  onChange={setPurpose}
                  label="Enter Purpose"
                  multiline
                  maxLength={300}
                  className={s.texArea}
                />
                <TextField
                  name="council"
                  value={council}
                  onChange={setCouncil}
                  label="Enter Council"
                  className={s.input}
                  helperText="One account per line"
                />
              </div>
              <Button
                size="lg"
                className={s.singleButton}
                onClick={() => {
                  setActiveStep(2);
                }}
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
                  value={bond}
                  onChange={setBond}
                  label="Enter Bond in NEAR"
                  className={s.input}
                />
                <TextField
                  name="votePeriod"
                  value={votePeriod}
                  onChange={setVotePeriod}
                  label="Enter Vote Period in hours"
                  className={s.input}
                />
                <TextField
                  name="gracePeriod"
                  value={gracePeriod}
                  onChange={setGracePeriod}
                  label="Enter Grace Period in hours"
                  className={s.input}
                />
                <TextField
                  name="amountToTransfer"
                  value={amountToTransfer}
                  onChange={setAmountToTransfer}
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
                  onClick={() => {
                    setActiveStep(3);
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          {activeStep === 3 && (
            <div className={s.form}>
              <div>
                <TextField
                  name="bond"
                  value={bond}
                  onChange={setBond}
                  label="Enter Bond in NEAR"
                  className={s.input}
                />
                <TextField
                  name="votePeriod"
                  value={votePeriod}
                  onChange={setVotePeriod}
                  label="Enter Vote Period in hours"
                  className={s.input}
                />
                <TextField
                  name="gracePeriod"
                  value={gracePeriod}
                  onChange={setGracePeriod}
                  label="Enter Grace Period in hours"
                  className={s.input}
                />
                <TextField
                  name="amountToTransfer"
                  value={amountToTransfer}
                  onChange={setAmountToTransfer}
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

export default CreateProposalPopup;
