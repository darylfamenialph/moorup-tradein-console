/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  faArrowDownWideShort,
  faArrowUpWideShort,
} from '@fortawesome/free-solid-svg-icons';
import { isEmpty, isEqual } from 'lodash';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { PAGE_SIZES } from '../../constants';
import { sortArray, sortByKey } from '../../helpers';
import { useCommon } from '../../store';
import { Checkbox } from '../checkbox';
import { StyledReactSelect } from '../input';
import { StyledIcon } from '../styled';
import Pagination from './pagination';

interface ThProps {
  key: any;
  enableSort?: boolean;
  sorted?: boolean;
  alignRight?: boolean;
}

interface TableProps {
  label: string;
  headers: Array<{
    label: string;
    order: number;
    enableSort?: boolean;
    keyName?: any;
  }>;
  rows: Array<{ [key: string]: string }>;
  isLoading: boolean;
  enableCheckbox?: boolean;
  menuItems?: any;
  rightControls?: any;
  filterControls?: any;
  parsingConfig?: { [key: string]: (value: any) => any };
  onRowClick?: (value: any) => any;
  margin?: string;
  onChangeSelection?: any;
}

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0px;
  flex-wrap: wrap;
`;

const LeftSection = styled.div`
  padding-left: 20px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 0px 20px;
  flex-wrap: wrap;
  gap: 10px;

  @media screen and (max-width: 425px) {
    flex-direction: column;
    gap: 10px;
    align-items: start;
    padding-left: 20px;

    span {
      display: none;
    }

    svg {
      margin: 0px;
    }
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const TableWrapper = styled.div`
  box-shadow: none;
  border-radius: 6px !important;
  overflow-x: auto;
  margin: 0px 20px;
`;

const TableStyled = styled.table`
  border-collapse: separate;
  background-color: #fff;
  margin-top: 5px;
  border-spacing: 0;
  width: 100%;

  tbody td {
    white-space: nowrap;
    border-bottom: 1px solid #f0f0f0;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    padding-left: 30px !important;

    &:nth-child(2) {
      padding-left: 15px !important;
    }

    &:last-child {
      padding-right: 15px !important;
    }
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
    padding-top: 12px !important;
    padding-bottom: 12px !important;
    padding-left: 30px !important;

    &:nth-child(2) {
      padding-left: 15px !important;
    }

    &:last-child {
      padding-right: 15px !important;
    }

    &.enableSort {
      cursor: pointer;
    }
  }
`;

const Tbody = styled.tbody`
  tr {
    transition: background-color 0.3s ease;
    td {
      padding: 12px 10px;
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

  ${({ alignRight }) => alignRight && 'text-align-last: right;'}
`;

const Tr = styled.tr<{ hover?: boolean }>`
  transition: background-color 0.3s ease;
  &:hover {
    ${(props) => props.hover && 'background-color: #f5f6f6;'}
    ${(props) => props.hover && 'cursor: pointer;'}
  }
`;

const Td = styled.td<{ alignRight?: boolean }>`
  padding: 12px 10px;
  border-bottom: 1px solid #e1e4e8;
  color: #333;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;

  ${({ alignRight }) => alignRight && 'text-align-last: right;'}
`;

const LoaderText = styled.div`
  margin: 15px 0;
  text-align: center;
  letter-spacing: 2px;
  border-top: 0;
  border-radius: 0;
  padding-top: 0;
  color: #01463a;
  font-size: 14px;
`;

const TitleContainer = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  color: #000;
`;

const PrimaryText = styled.span`
  color: #01463a;
  font-weight: bold;
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

export function Table({
  label,
  headers,
  rows = [],
  isLoading,
  enableCheckbox = false,
  menuItems,
  rightControls,
  filterControls,
  parsingConfig = {},
  margin = '4px 20px',
  onChangeSelection = () => {},
  onRowClick,
}: TableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({ key: '_id', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(new Set());
  const [pageSize, setPageSize] = useState(parseInt(PAGE_SIZES[0].value));
  const { state: commonState } = useCommon();
  const { searchTerm } = commonState;

  const navigate = useNavigate();

  const handleSort = (key: string) => {
    let direction = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    } else if (!isEmpty(row?.viewURL)) {
      navigate(row?.viewURL);
    }
  };

  const parseRowValue = (
    header: any,
    row: { [x: string]: any },
    index: number,
  ): ReactNode | string => {
    const parsingFunction = parsingConfig[header.label];

    if (parsingFunction) {
      return parsingFunction({ row, menuItems, index });
    }

    return row[header.keyName] || '--';
  };

  const sortedHeaders = sortByKey(headers, 'order');
  const sortedRows = sortConfig.key
    ? sortArray(rows, sortConfig.key, sortConfig.direction)
    : rows;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedIndex(new Set([]));
    setIsAllSelected(false);

    if (onChangeSelection) {
      onChangeSelection([]);
    }
  };

  const filteredRows = searchTerm
    ? sortedRows.filter((row) =>
        Object.values(row).some((value) => {
          if (Array.isArray(value)) {
            return value.some((item) => searchItem(item, searchTerm));
          } else if (typeof value === 'object' && value !== null) {
            return searchObject(value, searchTerm);
          } else if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        }),
      )
    : sortedRows;

  function searchObject(obj: any, term: string): boolean {
    return Object.values(obj).some((value) => {
      if (Array.isArray(value)) {
        return value.some((item) => searchItem(item, term));
      } else if (typeof value === 'object' && value !== null) {
        return searchObject(value, term);
      } else if (typeof value === 'string') {
        return value.toLowerCase().includes(term.toLowerCase());
      }
      return false;
    });
  }

  function searchItem(item: any, term: string): boolean {
    if (typeof item === 'object' && item !== null) {
      return searchObject(item, term);
    } else if (typeof item === 'string') {
      return item.toLowerCase().includes(term.toLowerCase());
    }
    return false;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const itemsToDisplay = filteredRows.slice(startIndex, endIndex);

  const toggleSelection = (index: any) => {
    const newSelectedIndex = new Set(selectedIndex);

    if (newSelectedIndex.has(index)) {
      newSelectedIndex.delete(index);
    } else {
      newSelectedIndex.add(index);
    }

    setSelectedIndex(newSelectedIndex);
    if (
      isEqual(
        newSelectedIndex,
        new Set([...Array(itemsToDisplay.length).keys()]),
      )
    ) {
      onChangeSelection(itemsToDisplay);
      setIsAllSelected(true);
    } else {
      const selectedItems = itemsToDisplay?.filter((_, idx) =>
        newSelectedIndex.has(idx),
      );
      onChangeSelection(selectedItems);
      setIsAllSelected(false);
    }
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIndex(new Set([]));
      onChangeSelection([]);
    } else {
      const selectableItems = itemsToDisplay.filter(
        (item) => !item.disableCheckbox,
      );
      const selectableIndices = new Set(
        selectableItems.map((item) => itemsToDisplay.indexOf(item)),
      );

      setSelectedIndex(selectableIndices);
      onChangeSelection(selectableItems);
    }
    setIsAllSelected((value) => !value);
  };

  useEffect(() => {
    if (!isLoading) {
      setIsAllSelected(false);
      setSelectedIndex(new Set([]));
    }
  }, [isLoading]);

  return (
    <div
      style={{
        backgroundColor: 'white',
        boxShadow: '0px 0px 8px #eee',
        border: '1px solid #eee',
        margin: margin,
      }}
    >
      <HeaderSection>
        <LeftSection>
          <TitleContainer>
            <PrimaryText>{label}</PrimaryText>
          </TitleContainer>
        </LeftSection>
        <RightSection>
          <ActionContainer>{filterControls}</ActionContainer>
          <ActionContainer>
            <StyledReactSelect
              name="page_size"
              isMulti={false}
              options={PAGE_SIZES}
              value={pageSize.toString()}
              onChange={(selected) => {
                setPageSize(parseInt(selected.value));
              }}
            />
            {rightControls}
          </ActionContainer>
        </RightSection>
      </HeaderSection>
      <TableWrapper>
        <TableStyled>
          <Thead>
            <Tr>
              {enableCheckbox && (
                <Th key="select-all">
                  <Checkbox
                    label=""
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="!mb-0"
                  />
                </Th>
              )}
              {sortedHeaders?.map((header) => (
                <Th
                  key={header.label}
                  onClick={() =>
                    header.enableSort && handleSort(header.keyName)
                  }
                  className={header.enableSort ? 'enableSort' : ''}
                >
                  {header.label}
                  {header.enableSort && (
                    <span className="sort-icon">
                      {sortConfig.key === header.keyName &&
                        (sortConfig.direction === 'asc' ? (
                          <StyledIcon icon={faArrowUpWideShort} />
                        ) : (
                          <StyledIcon icon={faArrowDownWideShort} />
                        ))}
                    </span>
                  )}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {itemsToDisplay?.map((row: any, index: any) => (
              <Tr
                key={index}
                onClick={() => handleRowClick(row)}
                hover={!!onRowClick || !isEmpty(row?.viewURL)}
              >
                {enableCheckbox && (
                  <Td key="select-all">
                    <Checkbox
                      label=""
                      checked={
                        selectedIndex.has(index) ||
                        (isAllSelected && !row?.disableCheckbox)
                      }
                      onChange={() => toggleSelection(index)}
                      className="!mb-0"
                      disabled={row?.disableCheckbox}
                    />
                  </Td>
                )}
                {sortedHeaders?.map((header) => (
                  <Td key={`${index}-${header.label}`}>
                    <span>{parseRowValue(header, row, index)}</span>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </TableStyled>
        {isLoading && <LinearLoader />}
        {!isLoading && isEmpty(rows) && (
          <LoaderText>No data to display</LoaderText>
        )}
      </TableWrapper>
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={Math.ceil(filteredRows.length / pageSize)}
        totalRows={filteredRows.length}
        paginate={paginate}
      />
    </div>
  );
}
