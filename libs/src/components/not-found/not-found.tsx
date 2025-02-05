import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const NotFoundTitle = styled.h1`
  font-size: 3rem;
  color: #01463A;
`;

const NotFoundMessage = styled.p`
  font-size: 1.5rem;
  color: #333;
`;

export function NotFound(): JSX.Element {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404 - Not Found</NotFoundTitle>
      <NotFoundMessage>The page you are looking for does not exist.</NotFoundMessage>
    </NotFoundContainer>
  );
}

export default NotFound;
