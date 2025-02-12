import styled, { keyframes } from 'styled-components';
import { GenericResponseTypes } from '../../constants';
import { defaultTheme } from '../../helpers';
import { AppButton } from '../button';
import { withChild } from '../with-child';

interface ModalProps {
  title: string;
  subtitle?: string | null;
  type: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const modalIn = keyframes`
  from {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

const modalOut = keyframes`
  from {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'block' : 'block')};
  opacity: 0;
  animation: ${(props) => (props.isOpen ? fadeIn : fadeOut)} 0.3s ease-in-out forwards;
  z-index: 1010;
`;

const ModalWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  z-index: 1011;
  opacity: 0;
  pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};
  max-height: calc(100vh - 100px);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  padding: 20px;
  justify-items: center;
  animation: ${(props) => (props.isOpen ? modalIn : modalOut)} 0.3s ease-in-out forwards;
`;

const ModalHeader = styled.div<{ marginBottom?: string }>`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : '20px')};
`;

const ModalTitle = styled.h2<{  color: string }>`
  margin-top: 0;
  color: ${(props) => (props.color ? props.color : '#01463A')};
  font-size: 18px;
  text-align: center;
  margin-bottom: 4px;
`;

const ModalSubTitle = styled.h6`
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  margin: 20px 0;
`;

const HDivider = styled.hr`
  height: 1px;
  width: 100%;
  background-color: "#E0E0E0";
  margin: 20px 0;
`;

const WCModal = withChild(ModalWrapper);

export function ResponseModal({ title, subtitle, type, isOpen, onClose }: ModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  if (type === GenericResponseTypes.SUCCESS) {
    setTimeout(() => {
      onClose();
    }, 1000);
  }

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <WCModal isOpen={isOpen}>
        <ModalHeader marginBottom='0px'>
          <ModalTitle color={type === GenericResponseTypes.FAILED ? defaultTheme.danger.text : defaultTheme.primary.text}>{title}</ModalTitle>
        </ModalHeader>
        <HDivider />
        <ModalSubTitle>{subtitle}</ModalSubTitle>
        {
          type === GenericResponseTypes.FAILED && (
            <AppButton
              width='150px'
              onClick={onClose}
              variant='error'
            >
              Okay
            </AppButton>
          )
        }
      </WCModal>
    </>
  );
}
