import styled from 'styled-components';

export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  button {
    flex: 1 1 calc(50% - 4px);
  }

  button:nth-last-child(1):nth-child(odd) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;
