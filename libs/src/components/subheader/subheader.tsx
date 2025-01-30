/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';

const StyledContainer = styled.div<{
  overflowx?: string;
  overflowy?: string;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
}>`
  height: 54px;
  width: calc(100% - 40px);
  padding: 4px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
  gap: 8px;
  z-index: 888;
  ${(props) => props.margin && `margin: ${props.margin};`}
  ${(props) => props.marginTop && `margin-top: ${props.marginTop};`}
  ${(props) => props.marginBottom && `margin-bottom: ${props.marginBottom};`}
  ${(props) => props.marginLeft && `margin-left: ${props.marginLeft};`}
  ${(props) => props.marginRight && `margin-right: ${props.marginRight};`}
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  column-gap: 8px;
`;

interface SubHeaderProps {
  leftSection?: any;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
}

export function SubHeader({
  leftSection,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: SubHeaderProps) {
  return (
    <div className="card">
      <StyledContainer
        margin={margin}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
      >
        <LeftSection>{leftSection}</LeftSection>
      </StyledContainer>
    </div>
  );
}
