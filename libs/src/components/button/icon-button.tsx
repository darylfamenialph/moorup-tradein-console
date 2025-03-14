/* eslint-disable @typescript-eslint/no-explicit-any */
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import styled from 'styled-components';
import { StyledIcon } from '../styled';

const ButtonContainer = styled.div<{ disabled?: boolean; width?: string; padding?: string }>`
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-right: 10px;
  width: ${(props) => (props.width ? props.width : 'auto')};
  padding: ${(props) => (props.padding ? props.padding : '2px')};
  opacity: ${(props) => (props.disabled ? '50%' : '100%')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  &:hover {
    svg {
      color: #01463A;
    }
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 4px 8px;
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 50%;
  transform: translateX(-55%) translateY(20%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
  font-size: 10px;
`;

const ButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

interface IconButtonProps {
  icon?: any;
  width?: string;
  padding?: string;
  disabled?: boolean;
  onClick?: () => void;
  tooltipLabel: string;
  hovercolor?: string;
  size?: SizeProp;
}

export function IconButton({
  icon,
  width,
  padding,
  disabled,
  onClick,
  tooltipLabel,
  hovercolor = '#01463A',
  size = '1x',
}: IconButtonProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <ButtonWrapper>
      <ButtonContainer
        disabled={disabled}
        onClick={() => handleClick()}
        width={width}
        padding={padding}
      >
        <StyledIcon icon={icon} color='#9e9e9e' hovercolor={hovercolor} size={size} />
      </ButtonContainer>
      <Tooltip>{tooltipLabel}</Tooltip>
    </ButtonWrapper>
  );
}
