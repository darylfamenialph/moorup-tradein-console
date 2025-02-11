import styled from 'styled-components';

interface ChipProps {
  value: string;
  width?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  onClick?: () => void;
}

const StyledChip = styled.span<{ width?: string; bgColor?: string; textColor?: string; fontSize?: string }>`
  display: inline-block;
  border-radius: 4px;
  padding: 2px 20px;
  text-decoration: none;
  width: ${(props) => props.width ?? 'auto'};
  text-align: center;
  background-color: ${(props) => props.bgColor ?? '#216A4C'};
  color: ${(props) => props.textColor ?? 'white'};
  font-weight: 500;
  font-size: ${(props) => props.fontSize ?? '12px'};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
`;

export function Chip({ value, textColor, bgColor, width, fontSize, onClick }: ChipProps) {
  return (
    <StyledChip
      textColor={textColor}
      bgColor={bgColor}
      width={width}
      fontSize={fontSize}
      onClick={onClick}
    >
      {value}
    </StyledChip>
  );
}
