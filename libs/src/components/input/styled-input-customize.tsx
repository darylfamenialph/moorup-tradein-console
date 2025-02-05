/* eslint-disable @typescript-eslint/no-explicit-any */
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { isUndefined } from 'lodash';
import { InputHTMLAttributes } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled, { css } from 'styled-components';
import { defaultTheme } from '../../helpers';
import { FormGroup } from '../form';
import { StyledIcon } from '../styled';
import { withChild } from '../with-child';
import { StyledTextarea } from './styled-textearea';

interface StyledInputFieldProps {
  error?: boolean;
  placeholder?: string;
  type?: string;
  children?: any;
}

const StyledInputContainer = styled.div<{ error?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (isUndefined(props.error) ? '0px' : '10px')};
  width: 100%;

  & > svg {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px 10px;
    color: #ccc;
    transition: 0.3s;
  }

  &.inputWithIcon {
    position: relative;
  }
`;

const StyledInputLabel = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: inherit;
`;

const StyledInputField = styled.input<StyledInputFieldProps>`
  padding: 10px;
  border: 1px solid ${(props) => (props.error ? '#f44336' : '#ccc')};
  border-radius: ${(props) => (props.name === 'search' ? '20px' : '4px')};
  outline: none;
  transition: border-color 0.2s ease-in-out;
  padding-right: 30px;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      background-color: #f0f0f0;

      &:focus,
      &:hover {
        border-color: #ccc;
      }
    `}

  ${({ disabled }) =>
    !disabled &&
    css`
      &:focus,
      &:hover {
        border-color: #01463a;
      }
    `}

  &::placeholder {
    color: #ccc;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
`;

const CustomizeLabel = styled.div`
  font-size: 12px;
  margin-top: 5px;
  text-align: right;
  cursor: pointer;
`;

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  name: string;
  onCustomize: any;
  value: any;
  info?: any;
  variant?: 
  | 'input-field'
  | 'text-area';
}

const WCReactTooltip = withChild(ReactTooltip);

export function StyledInputCustomize({
  label,
  type,
  placeholder,
  error,
  errorMessage,
  name,
  value,
  onChange,
  onBlur,
  onCustomize,
  info,
  variant = 'input-field',
}: StyledInputProps): JSX.Element {

  const renderInputVariant = (variant: string) => {
    switch (variant) {
      case 'input-field':
        return (
          <StyledInputField
            type={type}
            placeholder={placeholder}
            onBlur={onBlur}
            error={error}
            value={value}
            name={name}
            disabled={true}
          />
        );

      case 'text-area':
        return (
          <StyledTextarea
            type={type}
            placeholder={placeholder}
            error={error}
            value={value}
            name={name}
            disabled={true}
            readOnly={true}
            rows={1}
            onChange={onChange}
          />
        );
    
      default:
        return (
          <StyledInputField
            type={type}
            placeholder={placeholder}
            onBlur={onBlur}
            error={error}
            value={value}
            name={name}
            disabled={true}
          />
        );
    }
  }

  return (
    <StyledInputContainer error={error}>
      <FormGroup marginBottom="4px">
        {label ? <StyledInputLabel>{label}</StyledInputLabel> : <span />}
        {info && (
          <>
            <StyledIcon
              data-tooltip-id={name}
              icon={faCircleExclamation}
              color={defaultTheme.default.text}
              disabled
            />
            <WCReactTooltip
              id={name}
              place="right"
              variant="info"
              render={() => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {info.map((item: any, idx: number) => (
                    <span
                      key={idx}
                    >{`{{${item.field}}} ${item.description}`}</span>
                  ))}
                </div>
              )}
            />
          </>
        )}
      </FormGroup>
      {renderInputVariant(variant)}
      <FormGroup>
        <span />
        <CustomizeLabel onClick={onCustomize}>Customize</CustomizeLabel>
      </FormGroup>
      {!isUndefined(error) && error && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
    </StyledInputContainer>
  );
}
