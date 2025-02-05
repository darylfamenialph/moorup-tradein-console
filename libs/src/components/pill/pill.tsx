/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

interface PillProps {
  label: string;
  onClick: () => void;
  active: boolean;
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 10px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const PillStyled = styled.div<{ active: boolean }>`
  display: inline-block;
  background: ${({ active }) => (active ? 'linear-gradient(to right, #216A4C, #01463A)' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#01463A')};
  border-radius: 4px;
  padding: 8px 16px;
  margin: 4px;
  font-size: 14px;
  cursor: pointer;
  text-wrap: nowrap;
  width: 100%;
`;

const PillsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: 20px;
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.1);
  width: 100%;
  background-color: white;
  border-radius: 8px;

  @media screen and (max-width: 768px) {
    margin-left: 0px;
    margin-top: 20px;
    padding: 20px;
  }
`;

const Content = styled.div`
  display: ${({ active }: { active: boolean }) => (active ? 'block' : 'none')};
  width: 100%;
`;

const WCContent = withChild(Content);

export function Pill({ label, onClick, active }: PillProps) {
  return <PillStyled onClick={onClick} active={active}>{label}</PillStyled>;
}

export function VerticalPills({ labels, contents, onChange, defaultActive = 0 }: { labels: string[]; onChange?: (index: string) => void, contents: React.ReactNode[], defaultActive?: number }) {
  const [activePill, setActivePill] = useState<number>(defaultActive);

  const handleChange = (index: any) => {
    if (onChange) {
      onChange(index);
    }
    setActivePill(index)
  }

  return (
    <StyledDiv>
      <PillsWrapper>
        {labels.map((label, index) => (
          <Pill
            key={index}
            label={label}
            onClick={() => handleChange(index)}
            active={activePill === index}
          />
        ))}
      </PillsWrapper>
      <ContentContainer>
        {contents.map((content, index) => (
          <WCContent key={index} active={activePill === index}>
            {content}
          </WCContent>
        ))}
      </ContentContainer>
    </StyledDiv>
  );
}
