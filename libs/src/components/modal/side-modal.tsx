import { ReactNode } from 'react';
import styled from 'styled-components';
import { ProgressStepper } from '../stepper';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  withSteps?: boolean;
  steps?: string[];
  activeStep?: string;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  z-index: 1005; /* Lower z-index than modal */
`;

const SideModalWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? '0' : '-540px')};
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1006;
  padding: 20px;
  transition: right 0.3s ease-in-out;
  overflow-y: auto;
  max-width: 500px;
  width: 100%;

  @media screen and (max-width: 425px) {
    width: 100%;
    max-width: 325px;
  }

  @media screen and (max-width: 375px) {
    width: 100%;
    max-width: 275px;
  }
`;

const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding-top: 10px;
  padding-bottom: 20px;
`;

export function SideModal({ isOpen, onClose, children, withSteps, steps, activeStep }: SideModalProps): JSX.Element {
  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <SideModalWrapper isOpen={isOpen}>
        {
          withSteps && (
            <StepperContainer>
              <ProgressStepper steps={steps} activeStep={activeStep} />
            </StepperContainer>
          )
        }
       {children}
      </SideModalWrapper>
    </>
  );
}
