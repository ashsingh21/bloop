import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UIContext } from '../../../context/uiContext';
import { DeviceContext } from '../../../context/deviceContext';
import DataFormStep from './DataFormStep';
import FolderSelectStep from './FolderSelectStep';
import LocalReposStep from './LocalReposStep';
import GithubConnectStep from './GithubConnectStep';
import GithubReposStep from './GithubReposStep';
import SelfServeStep from './SelfServeStep';
import FeaturesStep from './FeaturesStep';
import RemoteServicesStep from './RemoteServicesStep';

type Props = {
  onFinish: () => void;
};

enum Steps {
  DATA_FORM,
  FEATURES,
  REMOTE_SERVICES,
  GITHUB_CONNECT,
  GITHUB_REPOS_SELECT,
  FOLDER_SELECT,
  LOCAL_REPOS_SELECT,
  FINISHED,
}

const Onboarding = ({ onFinish }: Props) => {
  const [step, setStep] = useState(Steps.DATA_FORM);
  const { onBoardingState, isGithubConnected } = useContext(UIContext);
  const { isSelfServe } = useContext(DeviceContext);

  useEffect(() => {
    if (isSelfServe ? step === 1 : step === Steps.FINISHED) {
      onFinish();
    }
  }, [step, isSelfServe]);

  const handleNext = useCallback((e: any, skipOne = false) => {
    setStep((prev) => prev + (skipOne ? 2 : 1));
  }, []);

  const handlePrev = useCallback((e: any, skip: number = 1) => {
    setStep((prev) => prev - skip);
  }, []);

  const currentStep = useMemo(() => {
    if (isSelfServe) {
      return <SelfServeStep />;
    }
    switch (step) {
      case Steps.DATA_FORM:
        return <DataFormStep handleNext={handleNext} />;
      case Steps.FEATURES:
        return <FeaturesStep handleNext={handleNext} handleBack={handlePrev} />;
      case Steps.REMOTE_SERVICES:
        return (
          <RemoteServicesStep handleNext={handleNext} handleBack={handlePrev} />
        );
      case Steps.GITHUB_CONNECT:
        return (
          <GithubConnectStep handleNext={handleNext} handleBack={handlePrev} />
        );
      case Steps.GITHUB_REPOS_SELECT:
        return (
          <GithubReposStep
            handleNext={handleNext}
            handleBack={(e) => handlePrev(e, 2)}
          />
        );
      case Steps.FOLDER_SELECT:
        return (
          <FolderSelectStep
            handleNext={handleNext}
            handleBack={(e) => handlePrev(e, isGithubConnected ? 1 : 2)}
          />
        );
      case Steps.LOCAL_REPOS_SELECT:
        return (
          <LocalReposStep handleNext={handleNext} handleBack={handlePrev} />
        );
      default:
        return null;
    }
  }, [
    isSelfServe,
    step,
    onBoardingState.indexFolder,
    handleNext,
    handlePrev,
    isGithubConnected,
  ]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 my-16 bg-[url('/onboarding-background.png')] bg-cover z-50">
      <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-start overflow-auto bg-gray-900 bg-opacity-75">
        <div className="flex flex-col items-center max-w-md2 w-full">
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg shadow-big p-6 flex flex-col gap-8 w-full max-w-md2 w-full relative max-h-[calc(100vh-12rem)]">
            {currentStep}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
