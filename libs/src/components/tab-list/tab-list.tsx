import { useState } from 'react';
import styled from 'styled-components';
import { withChild } from '../with-child';

const TabListContainer = styled.div`
  display: flex;
  padding: 0px 20px;
  margin-top: 20px;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? 'white' : 'transparent')};
  border-radius: 4px;
  box-shadow: ${({ active }) => (active ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none')};
`;

const TabContent = styled.div``;

const WCTabContent = withChild(TabContent);

type TabListProps = {
  tabs: string[];
  children: React.ReactNode[];
  onTabChange?: (activeTab: string) => void;
};

export function TabList({ tabs, children, onTabChange }: TabListProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (tab: string, activeIndex: number) => {
    setActiveTabIndex(activeIndex);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <>
      <TabListContainer>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            active={index === activeTabIndex}
            onClick={() => handleTabClick(tab, index)}
          >
            {tab}
          </Tab>
        ))}
      </TabListContainer>
      <WCTabContent>
        {children[activeTabIndex]}
      </WCTabContent>
    </>
  );
}
