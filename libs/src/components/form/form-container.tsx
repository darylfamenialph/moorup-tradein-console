import { FormEvent, ReactNode } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface FormContainerProps {
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const StyledFormContainer = styled.form`
  display: flex;
  flex-direction: column;
`;

const WCForm = withChild(StyledFormContainer);
export function FormContainer({ children, onSubmit }: FormContainerProps): JSX.Element {
  return (
    <WCForm onSubmit={onSubmit}>
      {children}
    </WCForm>
  );
}
