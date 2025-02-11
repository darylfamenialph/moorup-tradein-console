import { ReactNode } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

const StyledFlexContainer = styled.div<{ direction?: string, center?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.direction ? props.direction : 'column')};
  background-color: white;
  padding: 20px;
  justify-content: ${(props) => (props.center ? 'center' : 'left')};
  align-items: ${(props) => (props.center ? 'center' : 'left')};
`;

interface FlexProps {
  children: ReactNode;
  direction?: string;
  center?: boolean;
}

const FlexContainer = withChild(StyledFlexContainer);

export function Flex({ children, direction, center }: FlexProps): JSX.Element {
  return <FlexContainer direction={direction} center={center}>{children}</FlexContainer>;
}
