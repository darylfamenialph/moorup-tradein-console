import styled, { keyframes } from 'styled-components';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const SkeletonWrapper = styled.div<SkeletonProps>`
  display: inline-block;
  height: ${props => props.height || '2rem'};
  width: ${props => props.width || '100px'};
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200px 100%;
  border-radius: 4px;
  animation: ${shimmer} 1.5s infinite;
`;

export function Skeleton({ width, height }: SkeletonProps) {
  return <SkeletonWrapper width={width} height={height} />;
}
