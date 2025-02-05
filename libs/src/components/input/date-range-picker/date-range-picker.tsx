/* eslint-disable @typescript-eslint/no-explicit-any */
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEqual } from 'lodash';
import moment from 'moment-timezone';
import { forwardRef, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAuth } from '../../../store/auth/use-auth';

import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { withChild } from '../../with-child';
import './date-range-picker.css';

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

const StyledCalendarContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  border-radius: 4px;
  width: 100%;
  padding: 4px;
  background-color: white;
  border: 1px solid #ccc;
  margin-top: 5px;
  z-index: 10;
`;

const CustomInputContainer = styled.div<{
  disabled?: boolean;
  error?: boolean;
  inFocus?: boolean;
}>`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dadada;
  width: 100%;

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

  ${({ inFocus }) => 
    inFocus && 
    css`
      border-color: #01463a;

      svg {
        color: #01463a;
      }
    `}

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
  inFocus?: boolean;
}

const CustomInput = forwardRef<HTMLDivElement, CustomInputProps>(
  (
    { disabled, value, placeholderText, onClick, inFocus, error, errorMessage },
    ref,
  ) => (
    <>
      <CustomInputContainer
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        error={error}
        inFocus={inFocus}
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

interface StyledDateRangePickerProps {
  startDateInput: {
    onChange: (date: Date | null) => void;
    placeholder: string;
    value: Date | null;
    error?: boolean;
    errorMessage?: string;
  };
  endDateInput: {
    onChange: (date: Date | null) => void;
    placeholder: string;
    value: Date | null;
    error?: boolean;
    errorMessage?: string;
  };
  label?: string;
  disabled?: boolean;
}

const FOCUS_START = [0, 0];
const FOCUS_END = [0, 1];

const WCDateRange = withChild(DateRange);

export function StyledDateRange({
  startDateInput: {
    onChange: startDateInputChange,
    placeholder: startDatePlaceholder,
    error: startDateError,
    value: startDateValue,
    errorMessage: startDateErrorMessage,
  },
  endDateInput: {
    onChange: endDateInputChange,
    placeholder: endDatePlaceholder,
    error: endDateError,
    value: endDateValue,
    errorMessage: endDateErrorMessage,
  },
  label,
  disabled,
}: StyledDateRangePickerProps) {
  const { state: authState } = useAuth();
  const { platformConfig } = authState;
  const timezone = platformConfig?.timezone || 'Australia/Victoria';
  const [dateRange, setDateRange] = useState<any>(
    {
      key: 'exportDate',
      startDate: startDateValue,
      endDate: endDateValue,
    },
  );

  const [showCalendar, setShowCalendar] = useState(false);
  const [focusRange, setFocusRange] = useState<any>(FOCUS_START);
  const calendarRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = (focus: any) => {
    setShowCalendar(true);
    setFocusRange(focus);
  };

  const handleChangeDate = (item: any) => {
    setDateRange(item.exportDate);
    startDateInputChange(item.exportDate?.startDate);
    endDateInputChange(item.exportDate?.endDate);

    if (isEqual(focusRange, FOCUS_END)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        calendarRef.current &&
        !calendarRef.current?.contains(event.target) &&
        !startInputRef.current?.contains(event.target) &&
        !endInputRef.current?.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formattedStartDateValue = dateRange.startDate
    ? moment(dateRange.startDate).tz(timezone).format('YYYY-MM-DD')
    : null;

  const formattedEndDateValue = dateRange.endDate
    ? moment(dateRange.endDate).tz(timezone).format('YYYY-MM-DD')
    : null;

  return (
    <div className="dateRangePicker relative block w-full">
      <div className='flex flex-col gap-1'>
        <StyledSelectLabel>{label}</StyledSelectLabel>
          <div className="flex items-center gap-2">
          <CustomInput
            ref={startInputRef}
            disabled={disabled}
            placeholderText={startDatePlaceholder}
            value={formattedStartDateValue}
            error={startDateError}
            errorMessage={startDateErrorMessage}
            inFocus={showCalendar && isEqual(focusRange, FOCUS_START)}
            onClick={() => handleInputFocus(FOCUS_START)}
          />
          to
          <CustomInput
            ref={endInputRef}
            disabled={disabled}
            placeholderText={endDatePlaceholder}
            value={formattedEndDateValue}
            error={endDateError}
            errorMessage={endDateErrorMessage}
            inFocus={showCalendar && isEqual(focusRange, FOCUS_END)}
            onClick={() => handleInputFocus(FOCUS_END)}
          />
        </div>
      </div>
      {showCalendar && (
        <StyledCalendarContainer ref={calendarRef}>
          <WCDateRange
            editableDateInputs={true}
            showDateDisplay={false}
            moveRangeOnFirstSelection={false}
            onChange={handleChangeDate}
            rangeColors={['#01463A']}
            ranges={[dateRange]}
            onRangeFocusChange={setFocusRange}
            focusedRange={focusRange}
          />
        </StyledCalendarContainer>
      )}
    </div>
  );
}
