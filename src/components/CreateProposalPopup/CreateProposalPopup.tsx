import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import useMedia from 'hooks/use-media';

import { StepProgressBar } from 'components/StepProgressBar';
import { ProposalKind, ProposalType } from 'types/proposal';
import { ProposalTypeItem } from 'components/ProposalTypeItem';
import { NearService } from 'services/NearService';
import { DaoItem } from 'types/dao';
import { yoktoNear } from 'services/NearService/NearService';
import Decimal from 'decimal.js';
import { useSelector } from 'react-redux';
import s from './CreateProposalPopup.module.scss';
import { Button, IconButton, SvgIcon, TextField } from '../UILib';

import { CreateProposalErrors, CreateProposalValues } from './types';
import { validateSecondStep, validateThirdStep } from './validators';
import { accountSelector } from '../../redux/selectors';
import { getValidatorValue } from '../../utils/validators';

export interface CreateProposalPopupProps {
  className?: string;
  dao: DaoItem;
  onClose?: () => void;
}

const STEPS = ['Select proposal', 'General info', 'Other details'];

const proposalKinds: ProposalType[] = [
  ProposalType.Payout,
  ProposalType.NewCouncil,
  ProposalType.RemoveCouncil,
  ProposalType.ChangePurpose,
  ProposalType.ChangeVotePeriod,
];

const initialValues: CreateProposalValues = {
  target: '',
  description: '',
  payout: '',
  purpose: '',
  votePeriod: '',
  link: '',
};

const mapToKind = (
  type: ProposalType,
  values: CreateProposalValues,
): ProposalKind => {
  switch (type) {
    case ProposalType.NewCouncil:
    case ProposalType.RemoveCouncil:
      return { type };
    case ProposalType.Payout:
      return { type, amount: values.payout };
    case ProposalType.ChangePurpose:
      return { type, purpose: values.purpose };
    case ProposalType.ChangeVotePeriod:
      return { type, votePeriod: values.votePeriod };
    default:
      throw new Error(`Type: ${type} is not defined!`);
  }
};

const CreateProposalPopup: React.FC<CreateProposalPopupProps> = ({
  className,
  onClose,
  dao,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const media = useMedia();
  const account = useSelector(accountSelector);

  if (account) {
    initialValues.target = account;
  }

  const [type, setType] = useState<ProposalType | null>(null);
  const [values, setValues] = useState<CreateProposalValues>(initialValues);
  const [errors, setErrors] = useState<CreateProposalErrors>({});

  const validationConfig = React.useMemo(
    () => ({
      link: {
        // Min description length should be 3 chars. Max description length is 240
        // chars. It means that max link length is 237 chars. https://app.clickup.com/t/mf6yb4
        maxLength: 237,
      },
      description: {
        maxLength: () => {
          const { length } = values.link;

          return 240 - length;
        },
        minLength: 3,
      },
      purpose: {
        maxLength: 240,
        minLength: 3,
      },
    }),
    [values],
  );

  const handleChange = (field: keyof CreateProposalValues, value: string) => {
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
    if (!type) return;

    setActiveStep(2);
  };

  const onSubmitSecondStep = () => {
    const fsecondStepErrors = validateSecondStep(values, validationConfig);

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
    if (!type) return;

    const thirdStepErrors = validateThirdStep(values, type, validationConfig);

    if (Object.keys(thirdStepErrors).length) {
      setErrors({
        ...errors,
        ...thirdStepErrors,
      });

      return;
    }

    await NearService.createProposal({
      target: values.target,
      description: values.description,
      link: values.link,
      bond: new Decimal(dao.bond).mul(yoktoNear).toFixed(),
      daoId: dao.id,
      kind: mapToKind(type, values),
    });
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

  useEffect(() => {
    if (activeStep === 1 && type) {
      setActiveStep(2);
    }
  }, [type, activeStep]);

  const handleSelectType = (newType: ProposalType) => {
    setType(newType);
  };

  function renderSecondStep() {
    return (
      <div className={s.form}>
        <div>
          <p className={s.description}>
            Create a discussion before submitting a proposal here
          </p>
          <div className={s.linkWrapper}>
            <a
              href="https://gov.near.org/c/10"
              target="_blank"
              className={s.link}
              rel="noreferrer"
            >
              https://gov.near.org/c/10
              <SvgIcon icon="link" className={s.linkIcon} size={24} />
            </a>
            <span className={s.linkText}>and use below</span>
          </div>
          <TextField
            name="link"
            value={values.link}
            error={errors.link}
            onChange={(val) => handleChange('link', val)}
            label="Forum link"
            className={cn(s.input, s.linkInput)}
            helperText="Please copy and paste the forum link here"
            maxLength={getValidatorValue(validationConfig.link.maxLength)}
          />
          <TextField
            name="target"
            value={values.target}
            error={errors.target}
            onChange={(val) => handleChange('target', val.trim())}
            label="Target"
            className={s.input}
            helperText="Recipient NEAR address. For non-payout proposals use your own address."
          />
          <TextField
            name="description"
            value={values.description}
            error={errors.description}
            onChange={(val) => handleChange('description', val)}
            label="Job/proposal description"
            multiline
            maxLength={getValidatorValue(
              validationConfig.description.maxLength,
            )}
            className={s.input}
          />
        </div>
        <div className={s.buttonsWrapper}>
          <Button
            size="lg"
            variant="monochrome"
            leftElement={<SvgIcon icon="dd-arrow" className={s.arrowIcon} />}
            className={s.button}
            onClick={() => {
              setType(null);
              setActiveStep(1);
            }}
          >
            Back
          </Button>
          <Button size="lg" className={s.button} onClick={onSubmitSecondStep}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  function renderThirdStep() {
    return (
      <div className={s.form}>
        <div>
          {type === ProposalType.Payout && (
            <TextField
              type="number"
              name="payout"
              value={values.payout}
              error={errors.payout}
              onChange={(val) => handleChange('payout', val)}
              label="Payout"
              className={s.input}
              helperText="Show payout in NEAR"
              rightElement={
                <SvgIcon icon="token" size={18} className={s.bondTokenIcon} />
              }
            />
          )}
          {type === ProposalType.ChangePurpose && (
            <TextField
              name="purpose"
              value={values.purpose}
              error={errors.purpose}
              multiline
              onChange={(val) => handleChange('purpose', val)}
              label="New purpose"
              className={s.input}
            />
          )}
          {type === ProposalType.ChangeVotePeriod && (
            <TextField
              type="number"
              name="votePeriod"
              value={values.votePeriod}
              error={errors.votePeriod}
              onChange={(val) => handleChange('votePeriod', val)}
              label="New Vote Period"
              className={s.input}
            />
          )}
          <div className={s.bondWrapper}>
            <p className={s.bondTitle}>Bond</p>
            <p className={s.bondValue}>{dao.bond}</p>
            <SvgIcon icon="token" size={18} className={s.bondTokenIcon} />
          </div>
          <p className={s.bondEditionText}>Amount to pay now</p>
        </div>
        <div className={s.buttonsWrapper}>
          <Button
            size="lg"
            variant="monochrome"
            leftElement={<SvgIcon icon="dd-arrow" className={s.arrowIcon} />}
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
    );
  }

  function renderSteps() {
    switch (activeStep) {
      case 1:
        return (
          <div className={s.form}>
            <ul className={s.list}>
              {proposalKinds.map((item) => (
                <ProposalTypeItem
                  key={item}
                  className={s.typeItem}
                  label={item}
                  active={item === type}
                  onClick={() => handleSelectType(item)}
                />
              ))}
            </ul>
            <Button
              size="lg"
              className={s.singleButton}
              onClick={onSubmitFirstStep}
            >
              Continue
            </Button>
          </div>
        );
      case 2:
        return renderSecondStep();
      case 3:
        return renderThirdStep();
      default:
        return null;
    }
  }

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
            onClick={onClose}
          />
          <p className={s.mobileTitle}>Add New proposal</p>
          <p className={s.mobileDaoName}>{dao.id}</p>
          <StepProgressBar
            steps={STEPS}
            current={activeStep}
            className={s.stepProgressBar}
            size={progressBarSize}
          />
        </div>
        <div className={s.formWrapper}>
          <p className={s.desktopTitle}>Add New proposal</p>
          <p className={s.desktopDaoName}>{dao.id}</p>
          <IconButton
            icon="close"
            size="lg"
            variant="outline"
            className={s.desktopClose}
            onClick={onClose}
          />
          {renderSteps()}
        </div>
      </div>
    </div>
  );
};

export default CreateProposalPopup;
