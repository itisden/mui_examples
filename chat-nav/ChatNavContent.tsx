import { useState, ChangeEvent } from 'react';
import { IconButton, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';
import CreateTicketModal from 'src/components/modals/create-ticket';
import SearchInput from 'src/components/searh-input';
import useDebouncedValue from 'src/hooks/useDebouncedValue';
import MainNavTabs from './MainNavTabs';
import ChatNavSearchResults from './ChatNavSearchResults';

type Props = {};

export default function ChatNav(props: Props) {
  const [createTicketModalIsOpen, setCreateTicketModalOpenState] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 500);

  const handleCloseScheduledMessages = () => {
    setCreateTicketModalOpenState(false);
  };

  const handleOpenScheduledMessages = () => {
    setCreateTicketModalOpenState(true);
  };

  const handleChangeSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" flexShrink="0" sx={{ p: 2.5 }}>
        <SearchInput
          value={searchQuery}
          onChange={handleChangeSearch}
          onClickAway={() => setSearchQuery('')}
          placeholder="Search contacts..."
        />
        <IconButton
          size="medium"
          onClick={handleOpenScheduledMessages}
          sx={{
            ml: 1,
            color: 'common.black',
          }}
        >
          <Iconify icon="mdi:pencil" />
        </IconButton>
      </Stack>
      {searchQuery ? <ChatNavSearchResults searchQuery={debouncedQuery} /> : <MainNavTabs />}
      <CreateTicketModal open={createTicketModalIsOpen} onClose={handleCloseScheduledMessages} />
    </>
  );
}
