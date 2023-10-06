import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'src/redux/store';
import { Button } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { getConversations, setActiveConversationId } from 'src/redux/slices/chat';
import { selectActiveTicketId } from 'src/redux/selectors/conversations';
import * as paginationUtils from 'src/utils/pagination';
import Conversation from 'src/components/conversation';
import ConversationLoader from 'src/components/conversation-loader';
import type { IConversation } from 'src/@types/conversations';

type Props = {
  type: string;
};

export default function ChatNavList({ type }: Props) {
  const selectedConversationId = useSelector(selectActiveTicketId);
  const conversations = useSelector((state) => state.chat.conversations);
  const conversationType = conversations.types[type];
  const canLoadMore =
    conversationType.status !== 'pending' && paginationUtils.canLoadMore(conversationType);
  const dispatch = useDispatch();

  const conversationList = useMemo(
    () => conversationType.allIds.map((id) => conversations.byId[id]),
    [conversationType, conversations.byId]
  );

  const conversationsByLastInterection = useMemo(
    () => [...conversationList].sort(sortConversationsByLastMessage),
    [conversationList]
  );

  useEffect(() => {
    if (conversationType.status === 'idle') {
      dispatch(getConversations({ type }));
    }
  }, [conversationType.status, type, dispatch]);

  const hadnleLoadMore = () => {
    dispatch(getConversations({ type, page: conversationType.page + 1 }));
  };

  const handleClickOnCoversation = (id: string) => {
    dispatch(setActiveConversationId(id));
  };

  return (
    <Scrollbar>
      {conversationsByLastInterection.map((conv, index) => (
        <Conversation
          key={conv.ticket_id}
          conversation={conv}
          onClick={() => handleClickOnCoversation(conv.ticket_id.toString())}
          isSelected={conv.ticket_id.toString() === selectedConversationId}
        />
      ))}
      {conversationType.status === 'pending' && <ConversationLoader numberOfItems={10} />}
      {canLoadMore && (
        <Button
          variant="outlined"
          onClick={hadnleLoadMore}
          disabled={conversationType.status === 'pending'}
          fullWidth
        >
          Load more
        </Button>
      )}
    </Scrollbar>
  );
}

const sortConversationsByLastMessage = (a: IConversation, b: IConversation) => {
  const aTime = a.latest_message_created;
  const bTime = b.latest_message_created;

  if (aTime !== null && bTime !== null) {
    return new Date(bTime).valueOf() - new Date(aTime).valueOf();
  }

  if (aTime !== null && bTime === null) {
    return -1;
  }

  if (aTime === null && bTime !== null) {
    return 1;
  }

  return 0;
};
