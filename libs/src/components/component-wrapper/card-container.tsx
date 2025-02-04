import { ReactNode } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface CardContainerProps {
  children: ReactNode;
  direction?: string;
}

const StyledCardContainer = styled.div<{ direction?: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #F4F4F5;
  overflow: auto;
`;

const WCCard = withChild(StyledCardContainer);

export function CardContainer({ children, direction }: CardContainerProps): JSX.Element {
  return <WCCard direction={direction}>{children}</WCCard>;
}
