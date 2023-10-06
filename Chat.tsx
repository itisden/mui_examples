import { Card, Container, Stack } from '@mui/material';
import { useSelector } from 'src/redux/store';
import { selectActiveConversation } from 'src/redux/selectors/conversations';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ChatNav from './chat-nav/ChatNav';
import RoomSidebar from './room-sidebar/RoomSidebar';
import ChatMessageInput from './message/ChatMessageInput';
import ChatMessageList from './message/ChatMessageList';
import ChatHeaderDetail from './header/ChatHeaderDetail';

export default function Chat() {
  const { themeStretch } = useSettingsContext();
  const activeConversation = useSelector(selectActiveConversation);

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Chat"
        links={[
          {
            name: 'Dashboard',
            href: PATH_DASHBOARD.root,
          },
          { name: 'Chat' },
        ]}
      />
      <Card sx={{ height: '72vh', display: 'flex' }}>
        <ChatNav />

        {activeConversation && (
          <Stack flexGrow={1} sx={{ overflow: 'hidden' }}>
            <ChatHeaderDetail activeConversationId={activeConversation.ticket_id} />
            <Stack
              direction="row"
              flexGrow={1}
              sx={{
                overflow: 'hidden',
                borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Stack flexGrow={1} sx={{ minWidth: 0 }}>
                <ChatMessageList
                  conversationId={activeConversation.ticket_id}
                  key={activeConversation.ticket_id}
                />
                {activeConversation.assigned_user_id && (
                  <ChatMessageInput conversationId={activeConversation.ticket_id} />
                )}
              </Stack>
              <RoomSidebar />
            </Stack>
          </Stack>
        )}
      </Card>
    </Container>
  );
}
