/* eslint-disable @typescript-eslint/no-explicit-any */
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { forwardRef } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import styled, { css } from 'styled-components';

const StyledInputContainer = styled.div<{ error?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (props.error ? '0px' : '20px')};
  width: 100%;
`;

const StyledDateRangeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;

  .react-datepicker-wrapper {
    width: 100% !important;
  }
`;

const StyledMutedText = styled.div`
  font-size: 12px;
  color: #ccc;
  font-weight: 400;
`;

const StyledSelectedText = styled.div`
  font-size: 12px;
  color: rgb(42, 45, 49);
  font-weight: 500;
`;

const CustomInputContainer = styled.div<{
  disabled?: boolean;
  error?: boolean;
}>`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dadada;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      background-color: #f0f0f0;
    `}
  ${({ disabled }) =>
    !disabled &&
    css`
      cursor: pointer;
    `}

  border: 1px solid ${(props) => (props.error ? '#f44336' : '#ccc')};
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s ease-in-out;

  :not([disabled]):focus,
  :not([disabled]):hover {
    border-color: #01463a;

    svg {
      color: #01463a;
    }
  }

  &::placeholder {
    color: #ccc;
  }
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

const StyledIcon = styled(FontAwesomeIcon)`
  color: #ccc;
`;

interface CustomInputProps {
  disabled?: boolean;
  value: string | null;
  placeholderText: string;
  onClick?: () => void;
  error?: boolean;
  errorMessage?: string | string[] | undefined;
  onBlur?: any;
}

const CustomInput = forwardRef<HTMLDivElement, CustomInputProps>(
  ({ disabled, value, placeholderText, onClick, error, errorMessage }, ref) => (
    <>
      <CustomInputContainer
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        error={error}
      >
        {!value ? (
          <StyledMutedText>{placeholderText}</StyledMutedText>
        ) : (
          <StyledSelectedText>{value}</StyledSelectedText>
        )}
        <StyledIcon icon={faCalendar} />
      </CustomInputContainer>
      {error && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  ),
);

interface StyledDateRangePickerProps extends ReactDatePickerProps {
  startDateInput: {
    onChange: (date: Date | null) => void;
    placeholder: string;
    value: Date | null;
    name: string;
    error?: boolean;
    errorMessage?: string;
    onBlur: any;
  };
  endDateInput: {
    onChange: (date: Date | null) => void;
    placeholder: string;
    value: Date | null;
    name: string;
    error?: boolean;
    errorMessage?: string;
    onBlur: any;
  };
  label?: string;
  disabled?: boolean;
}

export function StyledDateRangePicker({
  startDateInput: {
    onChange: startDateInputChange,
    placeholder: startDatePlaceholder,
    value: startDateValue,
    name: startDateName,
    error: startDateError,
    errorMessage: startDateErrorMessage,
    onBlur: startDateOnBlur,
  },
  endDateInput: {
    onChange: endDateInputChange,
    placeholder: endDatePlaceholder,
    value: endDateValue,
    name: endDateName,
    error: endDateError,
    errorMessage: endDateErrorMessage,
    onBlur: endDateOnBlur,
  },
  label,
  disabled,
}: StyledDateRangePickerProps) {
  const setStartDate = (date: Date | null) => {
    if (date) {
      startDateInputChange(date);
    }
  }

  const setEndDate = (date: Date | null) => {
    if (date) {
      endDateInputChange(date);
    }
  }

  const formattedStartDateValue = startDateValue
    ? moment(startDateValue).format('YYYY-MM-DD')
    : null;
  const formattedEndDateValue = endDateValue
    ? moment(endDateValue).format('YYYY-MM-DD')
    : null;

  return (
    <StyledInputContainer>
      {label ? <StyledSelectLabel>{label}</StyledSelectLabel> : null}
      <StyledDateRangeContainer>
        <ReactDatePicker
          customInput={
            <CustomInput
              disabled={disabled}
              placeholderText={startDatePlaceholder}
              value={formattedStartDateValue}
              error={startDateError}
              errorMessage={startDateErrorMessage}
            />
          }
          selected={startDateValue}
          onChange={setStartDate}
          selectsStart
          startDate={startDateValue}
          endDate={endDateValue}
          name={startDateName}
          value={formattedStartDateValue || ''}
          onCalendarClose={() => startDateOnBlur()}
          popperPlacement="bottom"
          showPopperArrow={false}
          enableTabLoop={false}
        />
        <ReactDatePicker
          customInput={
            <CustomInput
              disabled={disabled}
              placeholderText={endDatePlaceholder}
              value={formattedEndDateValue}
              error={endDateError}
              errorMessage={endDateErrorMessage}
            />
          }
          selected={endDateValue}
          onChange={setEndDate}
          selectsEnd
          startDate={startDateValue}
          endDate={endDateValue}
          filterDate={(date: Date) => date >= (startDateValue || new Date())}
          name={endDateName}
          value={formattedEndDateValue || ''}
          allowSameDay
          onCalendarClose={() => endDateOnBlur()}
          popperPlacement="bottom"
          showPopperArrow={false}
          enableTabLoop={false}
          disabled={isEmpty(formattedStartDateValue)}
        />
      </StyledDateRangeContainer>
    </StyledInputContainer>
  );
}
