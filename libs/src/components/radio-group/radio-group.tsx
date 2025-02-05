import { useState } from 'react';
import styled from 'styled-components';
import { RadioGroupProps } from '../../constants';

const RadioGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const RadioGroupLabel = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: #01463a;
`;

const RadioLabel = styled.label`
  margin-right: 8px;
  font-size: 16px;
  cursor: pointer;
`;

 const RadioInput = styled.input`
   margin-right: 8px;
   margin-left: 16px;
   transform: scale(1.5);
   accent-color: #01463a;
 `;

 const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
`;

export function RadioGroup({ options, onChange, label, defaultValue }: RadioGroupProps): JSX.Element {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleOptionChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <RadioGroupContainer>
      <RadioGroupLabel>{label}</RadioGroupLabel>
       {options.map((option, index) => (
         <FlexRowContainer key={index}>
           <RadioInput
             type="radio"
             id={option.value}
             name="radio-group"
             value={option.value}
             checked={selectedValue === option.value || defaultValue === option.value}
             onChange={() => handleOptionChange(option.value)}
           />
           <RadioLabel htmlFor={option.value}>{option.label}</RadioLabel>
         </FlexRowContainer>
       ))}
    </RadioGroupContainer>
  );
}
