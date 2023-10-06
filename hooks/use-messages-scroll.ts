import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { type IChatTicket } from 'src/@types/message';

const FOLLOW_GAP_THRESHOLD_PX = 100;
const SCROLL_DEBOUNCE_MS = 300;

export default function useMessagesScroll(chatTickets: IChatTicket[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [followMessages, setFollowMessages] = useState(true);

  useEffect(() => {
    const messageList = messagesEndRef.current;

    const onScroll = debounce((e: Event) => {
      const list = e.target as HTMLDivElement;
      const distanceToBottom = list.scrollHeight - (list.scrollTop + list.offsetHeight);

      if (followMessages && distanceToBottom > FOLLOW_GAP_THRESHOLD_PX) {
        setFollowMessages(false);
      } else if (!followMessages && distanceToBottom < FOLLOW_GAP_THRESHOLD_PX) {
        setFollowMessages(true);
      }
    }, SCROLL_DEBOUNCE_MS);

    messageList?.addEventListener('scroll', onScroll);

    return () => {
      messageList?.removeEventListener('scroll', onScroll);
    };
  }, [messagesEndRef, followMessages]);

  const scrollMessagesToBottom = useCallback(() => {
    if (!chatTickets.length || !messagesEndRef.current) {
      return;
    }

    if (messagesEndRef.current && followMessages) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chatTickets, followMessages]);

  useEffect(
    () => {
      scrollMessagesToBottom();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatTickets, followMessages]
  );

  return {
    messagesEndRef,
  };
}
