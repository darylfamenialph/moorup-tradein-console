/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from 'lodash';
import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const StyledTextareaContainer = styled.div<{ withMarginBottom?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (isUndefined(props.withMarginBottom) ? '0px' : '20px')};
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

const StyledTextareaLabel = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: inherit;
`;

const StyledTextareaField = styled.textarea<{ error?: boolean, name?: string, disabled?: boolean; }>`
  padding: 10px;
  border: 1px solid ${(props) => (props.error ? '#f44336' : '#ccc')};
  border-radius: ${(props) => (props.name === 'search' ? '20px' : '4px')};
  outline: none;
  transition: border-color 0.2s ease-in-out;
  padding-right: 30px;
  font-size: 12px;
  line-height: 18px;

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

interface StyledTextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  name: string;
  value: any;
  rows?: number;
  disabled?: boolean;
  withMarginBottom?: boolean;
  onChange?: (event: React.ChangeEvent<any>) => void;
}

export function StyledTextarea({
  label,
  type,
  placeholder,
  error,
  errorMessage,
  name,
  value,
  onBlur,
  disabled,
  withMarginBottom,
  onChange,
}: StyledTextareaProps): JSX.Element {
  const [computedRows, setComputedRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = 30;
      const lines = value.split('\n').length;
      const height = textareaRef.current.scrollHeight;
      const rowsCount = Math.ceil(height / lineHeight);
      setComputedRows(Math.max(rowsCount, lines));
    }
  }, [value]);

  return (
    <StyledTextareaContainer withMarginBottom={withMarginBottom} >
      {label && <StyledTextareaLabel>{label}</StyledTextareaLabel>}
      <StyledTextareaField
        ref={textareaRef}
        placeholder={placeholder}
        onBlur={onBlur}
        error={error}
        name={name}
        value={value}
        disabled={disabled}
        rows={computedRows}
        onChange={onChange}
      />
      {!isUndefined(error) && error && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
    </StyledTextareaContainer>
  );
}
