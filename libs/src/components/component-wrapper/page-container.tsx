import { ReactNode } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface PageContainerProps {
  children: ReactNode;
  bgColor?: string;
  padding?: string;
}

const StyledPageContainer = styled.div<{ bgColor?: string, padding?: string }>`
  display: flex;
  ${(props) => props.bgColor && `background-color: ${props.bgColor};`}
  ${(props) => props.padding && `padding: ${props.padding};`}
`;

const WCPage = withChild(StyledPageContainer);

export function PageContainer({ children, bgColor, padding }: PageContainerProps): JSX.Element {
  return <WCPage bgColor={bgColor} padding={padding}>{children}</WCPage>;
}
