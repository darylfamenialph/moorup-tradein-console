/* eslint-disable @typescript-eslint/no-explicit-any */
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
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
  action: () => void;
  icon?: any;
}

interface MenuProps {
  menuItems: MenuAction[];
  rowData: any;
  index?: number;
}

const WCReactTooltip = withChild(ReactTooltip);

export function StyledMenuIcon({ menuItems, rowData, index }: MenuProps) {
  return (
    <>
      <StyledIcon data-tooltip-id={String(index)} icon={faEllipsisV} />
      <WCReactTooltip
        id={String(index)} 
        opacity={100}
        clickable 
        openOnClick
        noArrow
        place="bottom-end"
        border='0px'
        style={{ padding: '0px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 8px 0px' }}
        render={() => (
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {menuItems.map((item: any, idx: number) => (
              <MenuItem key={idx} onClick={() => item.action(rowData)}>{item.label}</MenuItem>
            ))}
          </div>
        )} 
      />
    </>
  );
}
