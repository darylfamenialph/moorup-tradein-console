import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRows: number;
  paginate: (pageNumber: number) => void;
}

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  white-space: nowrap;
  flex-wrap: wrap;

  @media screen and (max-width: 425px) {
    flex-direction: column;
    gap: 10px;
    align-items: start;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  padding-right: 0.5em;
`;

const PaginationButton = styled.button`
  border: 1px solid rgba(1, 70, 58, 0.5);
  background-color: transparent;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 4px;
  color: #000;

  &:hover {
    background-color: #01463a;
    color: #ffffff;
  }

  &.active {
    background-color: #01463a;
    color: #ffffff;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #e1e4e8;
    color: #000;
    opacity: 20%;
  }
`;

const PaginationText = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin: 0 10px;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  width: 12px;
  height: 12px;
  fill: currentColor;
`;

export function Pagination({
  currentPage,
  pageSize = 10,
  totalPages,
  totalRows,
  paginate,
}: PaginationProps) {
  return (
    <PaginationWrapper>
      <LeftSection>
        <PaginationText>
          {
            totalRows > 0 && (
              <span>
                {`Showing ${((currentPage - 1) * pageSize) + 1} - ${Math.min(currentPage * pageSize, totalRows)} of ${totalRows} entries`}
              </span>
            )
          }
        </PaginationText>
      </LeftSection>

      {
        totalPages > 1 && (
          <RightSection>
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => paginate(1)}
            >
              <StyledIcon icon={faAnglesLeft}/>
            </PaginationButton>
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <StyledIcon icon={faAngleLeft}/>
            </PaginationButton>
            <PaginationText>
              {currentPage} of {totalPages}
            </PaginationText>
            <PaginationButton
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <StyledIcon icon={faAngleRight}/>
            </PaginationButton>
            <PaginationButton
              disabled={currentPage === totalPages}
              onClick={() => paginate(totalPages)}
            >
              <StyledIcon icon={faAnglesRight}/>
            </PaginationButton>
          </RightSection>
        )
      }
    </PaginationWrapper>
  );
}
