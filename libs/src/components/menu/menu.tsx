/* eslint-disable @typescript-eslint/no-explicit-any */
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { StyledIcon } from '../styled';
import { withChild } from '../with-child';

const MenuItem = styled.div`
  cursor: pointer;
  border-radius: 4px;
  color: #000;
  transition: background-color 0.3s ease;
  padding: 8px 15px;

  &:hover {
    background-color: #dff1f0;
  }
`;

interface MenuAction {
  label: string;
  action: (rowData: any) => void;
  icon?: any;
}

interface MenuProps {
  menuItems: MenuAction[];
  rowData: any;
  index?: number;
}

const WCReactTooltip = withChild(ReactTooltip);

export function StyledMenuIcon({ menuItems, rowData, index }: MenuProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setTooltipOpen(false);
      }
    }

    if (tooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipOpen]);

  const handleActionClick = (action: (rowData: any) => void) => {
    action(rowData);
    setTooltipOpen(false);
  };

  return (
    <div ref={iconRef}>
      <StyledIcon 
        data-tooltip-id={String(index)} 
        icon={faEllipsisV} 
        onClick={() => setTooltipOpen(!tooltipOpen)}
        tabIndex={-1}
        aria-hidden="true"
      />
      <WCReactTooltip
        id={String(index)} 
        opacity={100}
        clickable 
        isOpen={tooltipOpen}
        noArrow
        place="bottom-end"
        border='0px'
        style={{ padding: '0px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 8px 0px' }}
        render={() => (
          tooltipOpen && (
            <div ref={menuRef} style={{ display: 'flex', flexDirection: 'column'}}>
              {menuItems?.map((item: MenuAction, idx: number) => (
                <MenuItem key={idx} onClick={() => handleActionClick(item.action)}>
                  {item.label}
                </MenuItem>
              ))}
            </div>
          )
        )} 
      />
    </div>
  );
}
