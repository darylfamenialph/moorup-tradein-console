import { ReactNode } from 'react';
import styled from 'styled-components';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  z-index: 998; /* Lower z-index than modal */
`;

const SideModalWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? '0' : '-540px')};
  height: 100%;
  width: 500px;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 20px;
  transition: right 0.3s ease-in-out;
  overflow-y: auto;
`;

export function SideModal({ isOpen, onClose, children }: SideModalProps): JSX.Element {
  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <SideModalWrapper isOpen={isOpen}>
        {children}
      </SideModalWrapper>
    </>
  );
}
