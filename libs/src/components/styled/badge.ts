import styled from 'styled-components';

interface BadgeProps {
  backgroundColor?: string;
  textColor?: string;
}

export const Badge = styled.div<BadgeProps>`
  display: block;
  padding: 2px 8px;
  background-color: ${props => props.backgroundColor || '#01463a'};
  color: ${props => props.textColor || 'white'}; 
  width: fit-content;
  border-radius: 3px;
  font-size: 12px;
  margin-bottom: 2px;
`;
