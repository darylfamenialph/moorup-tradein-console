import styled from 'styled-components';

export const DetailCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0px 0px 8px #eee;
  overflow: auto;

  h4:first-of-type {
    margin-bottom: 8px;
    margin-top: 4px;
    line-height: 1.2;
    text-transform: uppercase;
    font-size: 14px;
  }

  h4 {
    margin: 16px 0 8px 0;
    line-height: 1.2;
    color: rgb(155,155,155);
  }
`;

export const DataLine = styled.div`
  display: grid;
  grid-template-columns: 3fr 5fr;
  box-sizing: content-box;
  gap: 16px;
  padding: 8px 0;
  border-top: 1px solid #eee;
  font-size: 14px;
  
  dl {
    width: fit-content;
    margin: 0;
    font-weight: 600;
  }

  @media screen and (max-width: 425px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`
