import { ReactNode } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface TabProps {
  label: string;
  children: ReactNode;
}

const StyledTab = styled.div`
  display: inline;
`;

const WCTab = withChild(StyledTab);

export function Tab({ children }: TabProps) {
  return <WCTab>{children}</WCTab>;
}
