import { useState, Fragment, useMemo } from 'react';
import { useChatMetadata } from 'src/hooks/chat';
import { Stack, Tabs, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import TabWithCounter from 'src/components/tab-with-counter';
// import BadgeStatus from 'src/components/badge-status';
import ChatNavConversationList from './ChatNavConversationList';
import ScheduledMessages from './ScheduledMessages';
import FiltersAndSortingDialog from './FiltersAndSortingDialog';

type Props = {};

export default function MainNavTabs(props: Props) {
  const [currentTab, setCurrentTab] = useState('assigned');
  const [filtersIsOpen, setFiltersOpenState] = useState(false);
  const {
    data: {
      top_bar: { unassigned, assigned, scheduled },
    },
    error,
    isError,
    isLoading,
  } = useChatMetadata();

  const TABS = useMemo(
    () => [
      {
        value: 'unassigned',
        icon: 'solar:letter-bold',
        component: <ChatNavConversationList type="unassigned" />,
        total: unassigned.total,
      },
      {
        value: 'assigned',
        icon: 'wpf:chat',
        component: <ChatNavConversationList type="assigned" />,
        total: assigned.total,
        unread: assigned.unread,
      },
      {
        value: 'sheduled',
        icon: 'ic:round-schedule-send',
        component: <ScheduledMessages />,
        total: scheduled.total,
      },
    ],
    [unassigned, assigned, scheduled]
  );

  const handleCreateTicketClick = () => {
    setFiltersOpenState(true);
  };

  const handleCreateTicketModal = () => {
    setFiltersOpenState(false);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ px: 2.5 }}>
        <Tabs
          value={currentTab}
          variant="fullWidth"
          onChange={(event, newValue) => setCurrentTab(newValue)}
          sx={{ flexGrow: 1 }}
        >
          {TABS.map((tab) => (
            <TabWithCounter
              key={tab.value}
              value={tab.value}
              total={tab.total}
              unread={tab.unread}
              iconName={tab.icon}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          ))}
        </Tabs>
        <IconButton
          size="medium"
          color="success"
          onClick={handleCreateTicketClick}
          sx={{
            ml: 1,
            flex: '0 0 auto',
            color: 'common.black',
          }}
        >
          <Iconify icon="mingcute:filter-fill" />
        </IconButton>
      </Stack>

      {TABS.map(
        (tab) => tab.value === currentTab && <Fragment key={tab.value}>{tab.component}</Fragment>
      )}

      <FiltersAndSortingDialog open={filtersIsOpen} onClose={handleCreateTicketModal} />
    </>
  );
}
