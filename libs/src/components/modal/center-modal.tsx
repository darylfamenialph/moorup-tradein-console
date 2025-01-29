/* eslint-disable @typescript-eslint/no-explicit-any */
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { IconButton } from '../button';
import { FormGroup } from '../form';

interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: any;
  width?: string;
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

const CenterModalWrapper = styled.div<{ isOpen: boolean, width?: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.width ?? '100%')};
  max-width: calc(100% - 100px);
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  z-index: 1007;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};
  overflow: auto;
  max-height: calc(100vh - 100px);
`;

export function CenterModal({ isOpen, onClose, children, title, width }: CenterModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Overlay isOpen={isOpen} />
      <CenterModalWrapper isOpen={isOpen} width={width}>
        <FormGroup margin='20px'>
          {title || <span />}
          <IconButton
            tooltipLabel="Close"
            icon={faClose}
            onClick={() => {
              onClose()
            }}
          />
        </FormGroup>
        {children}
      </CenterModalWrapper>
    </>
  );
}
