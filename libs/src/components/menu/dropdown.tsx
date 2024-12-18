/* eslint-disable @typescript-eslint/no-explicit-any */
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled from 'styled-components';

const MenuItem = styled.div`
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  padding: 8px 15px;
  font-size: 12px;
  font-weight: 400;
  color: gray;

  &:hover {
    background-color: #dff1f0;
    color: #216A4C;
  }
`;

const LabelContainer = styled.div`
  cursor: pointer;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  font-size: 12px;
  color: #4caf50;
  font-weight: 700;
  border-radius: 20px;
  text-decoration: none;
  background-color: #dff7e9;
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
}

export function Dropdown({ menuItems, defaultLabel, onSelect }: MenuProps) {
  const [selectedLabel, setSelectedLabel] = useState(defaultLabel);
  const [menuOptions, setMenuOptions] = useState(
    menuItems.filter(item => item.label !== defaultLabel)
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (newLabel: string, newValue: any) => {
    const updatedOptions = menuOptions.filter(item => item.label !== newLabel);
    setSelectedLabel(newLabel);
    setMenuOptions([...updatedOptions, { label: selectedLabel, value: newValue }]);
    setIsOpen(false);
    if (onSelect) {
      onSelect(newValue);
    }
  };

  return (
    <LabelContainer onClick={() => setIsOpen(!isOpen)}>
      {selectedLabel}
      <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      {isOpen && (
        <DropdownMenu>
          {menuOptions.map((item, idx) => (
            <MenuItem key={idx} onClick={() => handleSelect(item.label, item.value)}>
              {item.label}
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </LabelContainer>
  );
}
