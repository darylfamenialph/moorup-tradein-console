import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import styled from 'styled-components';
import { StyledIcon } from '../styled';

interface CopyToClipboardButtonProps {
  textToCopy: string;
}

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
`;

const CopyButtonContainer = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

export function CopyToClipboardButton({
  textToCopy,
}: CopyToClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <CopyButtonContainer onClick={copyToClipboard} aria-label="copy">
      <IconWrapper>
        <StyledIcon icon={isCopied ? faCheck : faCopy} color={isCopied ? '#16a34a' : '#666666'} />
      </IconWrapper>
    </CopyButtonContainer>
  );
}
