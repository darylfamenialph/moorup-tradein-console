import styled from 'styled-components';

const SliderContainer = styled.div`
  width: 100%;
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #ccc;
  outline: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px: solid #fff;
    background: #01463A;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px: solid #fff;
    background: #01463A;
    cursor: pointer;
  }
`;

const StyledInputLabel = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: inherit;
`;

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step, onChange }: SliderProps)  {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    onChange(newValue);
  }

  return (
    <SliderContainer>
      <StyledInputLabel>{label}</StyledInputLabel>
      <SliderInput type="range" min={min} max={max} step={step} value={value} onChange={handleChange} />
    </SliderContainer>
  );
}

export default Slider;
