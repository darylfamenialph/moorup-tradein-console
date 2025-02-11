import React from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface ModalProps {
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  z-index: 1002; /* Higher z-index than side modal */
`;

const ModalWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  z-index: 1003;
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};
  max-height: calc(100vh - 100px);
  border-radius: 4px;
  width: 100%;
  max-width: 600px;
  padding: 20px;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  color: #01463A;
  font-size: 20px;
`;

const ModalSubTitle = styled.h6`
  margin-top: 4px;
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: normal;
`;

const ModalFooter = styled.div`
  display: flex;
  margin-top: 20px;
`;

const WCModal = withChild(ModalWrapper);
const WCModalFooter = withChild(ModalFooter);

export function GenericModal({ title, subtitle, content, footer, isOpen, onClose }: ModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <WCModal isOpen={isOpen}>
        <ModalTitle>{title}</ModalTitle>
        <ModalSubTitle>{subtitle}</ModalSubTitle>
        {content}
        {
          footer && (
            <WCModalFooter>
              {footer}
            </WCModalFooter>
          )
        }
      </WCModal>
    </>
  );
}
