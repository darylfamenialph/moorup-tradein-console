/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty, isUndefined } from 'lodash';
import { default as Select } from 'react-select';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface StyledReactSelectProps {
  label?: string;
  error?: boolean;
  errorMessage?: string | string[] | undefined;
  name: string;
  options: { value: string; label: string; disabled?: any }[]
  isMulti: boolean;
  placeholder?: string;
  disabled?: boolean;
  value: string | string[] | undefined;
  onChange: (value: any) => void;
  onBlur?: (value: any) => void;
  isLoading?: boolean;
}

const StyledSelectContainer = styled.div<{ error?: boolean; }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (isUndefined(props.error) ? '0px' : '20px')};
  width: 100%;
`;

const StyledSelectLabel = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: inherit;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
`;

const customStyles = (error = false) => ({
  control: (provided: any) => ({
    ...provided,
    border: `1px solid ${error ? '#f44336' : '#cccccc'}`,
    borderRadius: '4px',
    transition: 'border-color 0.2s ease-in-out',
    boxShadow: 'none',
    width: '100%',
    '&:hover': {
      border: `1px solid ${error ? '#f44336' : '#01463a'}`,
    },
    fontSize: '14px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    background: state.isFocused ? 'rgba(1, 70, 58, 0.8)' : state.isSelected ? '#01463A' : state.isDisabled ? '#fff' : undefined,
    color: state.isDisabled ? '#ccc' : state.isFocused || state.isSelected ? '#fff' : 'inherit',
    zIndex: 1,
    ':hover': {
      color: state.isDisabled ? '#ccc' : '#fff',
      background: state.isDisabled ? 'inherit' : state.isFocused ? 'rgba(1, 70, 58, 0.8)' : '#01463A',
    },
    ':active': {
      color: state.isDisabled ? '#ccc' : '#fff',
      background: state.isDisabled ? 'inherit' : '#01463A',
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#01463a',
    color: '#fff',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#fff',
    ':hover': {
      color: '#fff',
      opacity: '50%',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '4px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: '12px',
    color: '#ccc'
  }),
});

const WCSelect = withChild(Select);

export function StyledReactSelect({
  label,
  error,
  errorMessage,
  name,
  options,
  isMulti,
  placeholder,
  disabled,
  value,
  onChange,
  onBlur,
  isLoading,
}: StyledReactSelectProps): JSX.Element {
  return (
    <StyledSelectContainer error={error && !isEmpty(errorMessage)}>
      {label && <StyledSelectLabel>{label}</StyledSelectLabel>}
      <WCSelect
        name={name}
        styles={customStyles(error)}
        isMulti={isMulti}
        isDisabled={disabled}
        options={options}
        placeholder={placeholder}
        value={isMulti
          ? options?.filter((option) => value?.includes(option.value))
          : options?.find((option) => value === option?.value) || null}     
        onChange={onChange}
        onBlur={onBlur}
        blurInputOnSelect={false}
        isLoading={isLoading}
        isOptionDisabled={(option: any) => option.disabled}
      />
      {!isUndefined(error) && error && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </StyledSelectContainer>
  );
}
