import { ReactNode } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface CardContainerProps {
  children: ReactNode;
  direction?: string;
  backgroundColor?: string;
  height?: string;
  display?: string;
  flexDirection?: string;
  width?: string;
  overflow?: string;
  padding?: string;
}

const StyledCardContainer = styled.div<CardContainerProps>`
  height: ${props => props.height || '100vh'};
  display: ${props => props.display || 'flex'};
  flex-direction: ${props => props.flexDirection || 'column'};
  width: ${props => props.width || '100%'};
  background-color: ${props => props.backgroundColor || '#F4F4F5'};
  overflow: ${props => props.overflow || 'auto'};
  padding: ${props => props.padding || '0px'};
  border-radius: 8px;
`;

const WCCard = withChild(StyledCardContainer);

export function CardContainer({ 
  children, 
  direction, 
  backgroundColor,
  height,
  display,
  flexDirection,
  width,
  overflow,
  padding,
}: CardContainerProps): JSX.Element {
  return (
    <WCCard 
      direction={direction}
      backgroundColor={backgroundColor}
      height={height}
      display={display}
      flexDirection={flexDirection}
      width={width}
      overflow={overflow}
      padding={padding}
    >
      {children}
    </WCCard>
  );
}
