import styled from 'styled-components';
import { withChild } from '../with-child';

const StyledGridContainer = styled.div<{ columns: string; gap?: string; margin?: string }>`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.columns}, minmax(0, 1fr))`};
  gap: ${(props) => props.gap ?? '20px'};
  margin: ${(props) => props.margin ?? '0px'};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  @media (min-width: 481px) and (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledGridItem = styled.div<{ padding?: string; border?: string; borderRadius?: string }>`
  padding: ${(props) => props.padding ?? '20px'};
  display: flex;
  flex-direction: column;
  ${(props) => props.border && `border: ${props.border};`}
  ${(props) => props.borderRadius && `border-radius: ${props.borderRadius};`}
`;

interface GridProps {
  children: React.ReactNode;
  columns: string;
  gap?: string;
  margin?: string;
}

const GridContainer = withChild(StyledGridContainer);

export function Grid({ children, columns, gap, margin }: GridProps): JSX.Element {
  return <GridContainer columns={columns} gap={gap} margin={margin}>{children}</GridContainer>;
}

interface GridItemProps {
  children: React.ReactNode;
  padding?: string;
  border?: string;
  borderRadius?: string;
}

const GridItemContainer = withChild(StyledGridItem);

export function GridItem({ children, padding, border, borderRadius }: GridItemProps): JSX.Element {
  return <GridItemContainer padding={padding} border={border} borderRadius={borderRadius}>{children}</GridItemContainer>;
}
