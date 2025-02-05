import { isEmpty } from 'lodash';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface FormWrapperProps {
  children: ReactNode;
  formTitle?: string;
  subtTitle?: string;
  width?: string;
  padding?: string;
}

const StyledFormWrapper = styled.div<FormWrapperProps>`
  padding: ${(props) => props.padding || '20px'};
  width: ${(props) => props.width || 'auto'};
  display: flex;
  flex-direction: column;
`;

const StyledFormTitle = styled.span<{ withSubtitle?: boolean }>`
  text-align: left;
  margin-top: auto;
  color: #01463a;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: ${(props) => props.withSubtitle ? '4px' : '40px'};
`;

const StyledFormSubTitle = styled.span`
  text-align: left;
  color: #707070;
  font-size: 12px;
  line-spacing: 0px;
  margin-bottom: 40px;
`;

const WCFormWrapper = withChild(StyledFormWrapper);

export function FormWrapper({ children, formTitle, subtTitle, width, padding }: FormWrapperProps): JSX.Element {
  return (
    <WCFormWrapper width={width} padding={padding}>
      {formTitle && <StyledFormTitle withSubtitle={!isEmpty(subtTitle)}>{formTitle}</StyledFormTitle>}
      {subtTitle && <StyledFormSubTitle>{subtTitle}</StyledFormSubTitle>}
      {children}
    </WCFormWrapper>
  );
}
