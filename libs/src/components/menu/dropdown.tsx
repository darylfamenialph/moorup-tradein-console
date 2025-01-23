/* eslint-disable @typescript-eslint/no-explicit-any */
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled, { css } from 'styled-components';

const MenuItem = styled.div<{ isActive: boolean }>`
  cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 8px 15px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ isActive }) => (isActive ? '#216A4C' : 'gray')};
  background-color: ${({ isActive }) => (isActive ? '#dff1f0' : 'transparent')};

  ${({ isActive }) =>
    !isActive &&
    css`
      &:hover {
        background-color: #dff1f0;
        color: #216A4C;
      }
    `}
`;

const LabelContainer = styled.div<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  font-size: 12px;
  color: ${({ disabled }) => (disabled ? '#999' : '#4caf50')};
  font-weight: 700;
  border-radius: 20px;
  text-decoration: none;
  background-color: ${({ disabled }) => (disabled ? '#f2f2f2' : '#dff7e9')};
  width: -webkit-fill-available;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 8px 0px;
  padding: 0;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

interface MenuAction {
  label: string;
  value: any;
}

interface MenuProps {
  menuItems: MenuAction[];
  defaultLabel: string;
  onSelect?: (value: any) => void;
  loading?: boolean;
}

export function Dropdown({ menuItems, defaultLabel, onSelect, loading = false }: MenuProps) {
  const [selectedLabel, setSelectedLabel] = useState(defaultLabel);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (newLabel: string, newValue: any) => {
    if (newLabel === selectedLabel) return;
    setSelectedLabel(newLabel);
    setIsOpen(false);
    if (onSelect) {
      onSelect(newValue);
    }
  };

  const toggleDropdown = () => {
    if (!loading) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <LabelContainer onClick={toggleDropdown} disabled={loading}>
      {selectedLabel}
      <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      {isOpen && !loading && (
        <DropdownMenu>
          {menuItems.map((item, idx) => (
            <MenuItem
              key={idx}
              isActive={selectedLabel === item.label}
              onClick={() => handleSelect(item.label, item.value)}
            >
              {item.label}
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </LabelContainer>
  );
}
