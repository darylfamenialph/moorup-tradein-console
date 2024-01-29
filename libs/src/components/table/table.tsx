/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from 'react';
import { isEmpty } from 'lodash';
import styled, { keyframes } from 'styled-components';
import {
  capitalizeFirstLetter,
  sortByKey,
  sortArray,
} from '../../helpers';
import Pagination from './pagination';

interface ThProps {
  key: any;
  enableSort?: boolean;
  sorted?: boolean;
}

interface TableProps {
  label: string;
  headers: Array<{ label: string; order: number; enableSort?: boolean }>;
  rows: Array<{ [key: string]: string }>;
  isLoading: boolean;
  enableCheckbox?: boolean;
  rightControls?: any;
}

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LeftSection = styled.div`
  margin-right: auto;
  flex: 1;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

const TableWrapper = styled.div`
  box-shadow: none;
  margin-bottom: 16px;
  border-radius: 6px !important;
  display: block;
  width: 100%;
  overflow-x: auto;
`;

const TableStyled = styled.table`
  border-collapse: separate;
  background-color: #fff;
  margin-top: 20px;
  border-spacing: 0;
  width: 100%;

  tbody td {
    white-space: nowrap;
    border-bottom: 1px solid #f0f0f0;
    padding-top: 15px !important;
    padding-bottom: 15px !important;
    padding-left: 30px !important;

    &:nth-child(2) {
      padding-left: 15px !important;
    }
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const Thead = styled.thead`
  white-space: nowrap;

  th {
    text-align: left;
    font-size: 12px;
    color: rgb(155, 155, 155);
    font-weight: 400;
    border-top: 1px solid #e1e4e8;
    border-bottom: 1px solid #e1e4e8;
    white-space: nowrap;
    padding-top: 15px !important;
    padding-bottom: 15px !important;
    padding-left: 30px !important;

    &:nth-child(2) {
      padding-left: 15px !important;
    }

    &.enableSort {
      cursor: pointer;
    }
  }
`;

const Tbody = styled.tbody`
  tr {
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #fffaf2;
      cursor: pointer;
    }
    td {
      padding: 15px 10px;
      border-bottom: 1px solid #e1e4e8;
      color: #333;
      font-size: 12px;
      line-height: 18px;
    }
  }
`;

const Th = styled.th<ThProps>`
  &.enableSort {
    position: relative;
    cursor: pointer;
  }

  .sort-icon {
    display: inline-block;
    margin-left: 5px;
  }
`;

const Tr = styled.tr``;

const Td = styled.td`
  padding: 15px 10px;
  border-bottom: 1px solid #e1e4e8;
  color: #333;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
`;

const LoaderText = styled.div`
  margin: 15px 0;
  text-align: center;
  letter-spacing: 4px;
  border-top: 0;
  border-radius: 0;
  padding-top: 0;
  color: #01463a;
  font-size: 14px;
`;

const TitleContainer = styled.div`
  font-weight: 600;
  font-size: 1.5rem;
  color: #000;
`;

const PrimaryText = styled.span`
  color: #01463a;
  font-weight: bold;
`;

const AscIcon = styled.span`
  &::before {
    content: ' ▲';
  }
`;

const DescIcon = styled.span`
  &::before {
    content: ' ▼';
  }
`;

const Icon = styled.svg`
  width: 12px;
  height: 12px;
  fill: currentColor;
`;

const LinearLoaderWrapper = styled.div`
  position: relative;
  height: 2px;
  display: block;
  width: 100%;
  background-color: #f4f4f5;
  border-radius: 2px;
  background-clip: padding-box;
  overflow: hidden;
`;

const LinearLoader = () => (
  <>
    <LoaderText>LOADING...</LoaderText>
    <LinearLoaderWrapper>
      <Line />
    </LinearLoaderWrapper>
  </>
);

const spinnerLinear = keyframes`
  0%   { left: -35%; right: 100%; }
  60%  { left: 100%; right: -90%; }
  100% { left: 100%; right: -90%; }
`;

const spinnerLinearShort = keyframes`
  0%   { left: -200%; right: 100%; }
  60%  { left: 107%;  right: -8%; }
  100% { left: 107%;  right: -8%; }
`;

const Line = styled.div`
  background-color: #01463a !important;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: inherit;
    top: 0;
    left: 0;
    bottom: 0;
    will-change: left, right;
  }

  &::before {
    animation: ${spinnerLinear} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
      infinite;
  }

  &::after {
    animation: ${spinnerLinearShort} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
      infinite;
    animation-delay: 1.15s;
  }
`;

const Input = styled.input`
  font-size: 12px;
  border: 1px solid #aaa;
  border-radius: 4px;
  margin: 6px 0;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  transition: 0.3s;
  padding-left: 25px;
`;

const StyledInput = styled.div`
  position: relative;

  & > svg {
    position: absolute;
    left: 0;
    top: 8px;
    padding: 9px 8px;
    fill: black;
    transition: 0.3s;
  }

  &.inputWithIcon {
    position: relative;
  }
`;

const PAGE_SIZE = 10;

export function Table({
  label,
  headers,
  rows,
  isLoading,
  enableCheckbox = false,
  rightControls,
}: TableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({ key: '_id', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    let direction = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const parseRowValue = (
    header: string | number,
    row: { [x: string]: string },
    index: any
  ): ReactNode | string => {
    switch (header) {
      case 'ID': {
        if (isEmpty(row['_id'])) return '--';
        return row['_id'];
      }

      case 'First Name': {
        if (isEmpty(row['first_name'])) return '--';
        return row['first_name'];
      }

      case 'Last Name': {
        if (isEmpty(row['last_name'])) return '--';
        return row['last_name'];
      }

      case 'Email': {
        if (isEmpty(row['email'])) return '--';
        return row['email'];
      }

      case 'Status': {
        if (isEmpty(row['status'])) return '--';
        return capitalizeFirstLetter(row['status']);
      }

      default:
        if (isEmpty(row[header])) return '--';
        return capitalizeFirstLetter(row[header]);
    }
  };

  const sortedHeaders = sortByKey(headers, 'order');
  const sortedRows = sortConfig.key
    ? sortArray(rows, sortConfig.key, sortConfig.direction)
    : rows;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filteredRows = searchTerm
    ? sortedRows.filter((row) =>
      Object.values(row).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : sortedRows;

  return (
    <>
      <HeaderSection>
        <LeftSection>
          <TitleContainer>
            <PrimaryText>{label}</PrimaryText>
          </TitleContainer>
        </LeftSection>
        <RightSection>
          <StyledInput className={"inputWithIcon"}>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
            />
            <Icon
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd"></path>
            </Icon>
          </StyledInput>
          {rightControls}
        </RightSection>
      </HeaderSection>
      <TableWrapper>
        <TableStyled>
          <Thead>
            <Tr>
              {sortedHeaders?.map((header) => (
                <Th
                  key={header.label}
                  onClick={() => header.enableSort && handleSort(header.keyName)}
                  className={header.enableSort ? 'enableSort' : ''}
                >
                  {header.label}
                  {header.enableSort && (
                    <span className="sort-icon">
                      {sortConfig.key === header.keyName &&
                        (sortConfig.direction === 'asc' ? (
                          <AscIcon />
                        ) : (
                          <DescIcon />
                        ))}
                    </span>
                  )}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filteredRows?.map((row: any, index: any) => (
              <Tr key={index}>
                {sortedHeaders?.map((header) => (
                  <Td key={`${index}-${header.label}`}>
                    <span>{parseRowValue(header.label, row, index)}</span>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </TableStyled>
        {isLoading && <LinearLoader />}
        {!isLoading && isEmpty(rows) && <span>No data to display</span>}
      </TableWrapper>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredRows.length / PAGE_SIZE)}
        totalRows={filteredRows.length}
        paginate={paginate}
      />
    </>
  );
}
