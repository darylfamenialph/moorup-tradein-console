import { useState } from 'react';
import styled from 'styled-components';

const TabListContainer = styled.div`
  display: flex;
  padding: 0px 20px;
  margin-top: 20px;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 10px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? 'white' : 'transparent')};
  border-radius: 4px;
  box-shadow: ${({ active }) => (active ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none')};
`;

const TabContent = styled.div``;

type TabListProps = {
  tabs: string[];
  children: React.ReactNode[];
};

export function TabList({ tabs, children }: TabListProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <TabListContainer>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            active={index === activeTab}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </Tab>
        ))}
      </TabListContainer>
      <TabContent>
        {children[activeTab]}
      </TabContent>
    </>
  );
}
