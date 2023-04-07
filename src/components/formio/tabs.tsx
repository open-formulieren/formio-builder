import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import type {
  ReactTabsFunctionComponent,
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsProps,
} from 'react-tabs';

const CustomTab: ReactTabsFunctionComponent<TabProps> = ({children, ...props}) => {
  const linkClassName = props.selected ? 'nav-link active' : 'nav-link';
  return (
    <Tab className="nav-item" selectedClassName="active" {...props}>
      <a href="#" onClick={e => e.preventDefault()} className={linkClassName}>
        {children}
      </a>
    </Tab>
  );
};

CustomTab.tabsRole = 'Tab';

const CustomTabList: ReactTabsFunctionComponent<TabListProps> = props => (
  <div className="card-header">
    <TabList className="nav nav-tabs card-header-tabs" {...props} />
  </div>
);

CustomTabList.tabsRole = 'TabList';

const CustomTabs: ReactTabsFunctionComponent<TabsProps> = props => (
  <Tabs className="card" {...props} />
);

CustomTabs.tabsRole = 'Tabs';

const CustomTabPanel: ReactTabsFunctionComponent<TabPanelProps> = props => {
  const style = props.selected ? {} : {display: 'none'};
  return (
    <TabPanel className="card-body tab-pane" selectedClassName="active" style={style} {...props} />
  );
};

CustomTabPanel.tabsRole = 'TabPanel';

export {CustomTab as Tab, CustomTabList as TabList, CustomTabPanel as TabPanel, CustomTabs as Tabs};
