import { ReactNode } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  z-index: 999; /* Higher z-index than side modal */
`;

const CenterModalWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  // max-width: calc(100% - 100px);
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  z-index: 999;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};
  max-height: 100%;
`;

const WCCenterModal = withChild(CenterModalWrapper);

export function StatusModal({ isOpen, onClose, children }: CenterModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Overlay isOpen={isOpen} onClick={() => onClose()}/>
      <WCCenterModal isOpen={isOpen}>
        {children}
      </WCCenterModal>
    </>
  );
}
