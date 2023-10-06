import { useEffect, useState, useMemo } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'src/redux/store';
import Scrollbar from 'src/components/scrollbar';
import Lightbox from 'src/components/lightbox';
import { getMessages, resetMessages } from 'src/redux/slices/chat';
import { selectChatTickets } from 'src/redux/selectors/messages';
import { IChatTicket } from 'src/@types/message';
import useMessagesScroll from 'src/sections/@dashboard/chat/hooks/use-messages-scroll';
import ChatTickets from './ChatTickets';

type Props = {
  conversationId: string | number;
};

export default function ChatMessageList({ conversationId }: Props) {
  const dispatch = useDispatch();
  const conversation = useSelector((state) => state.chat.conversations.byId[conversationId]);
  const messagesByTickets = useSelector(selectChatTickets);
  const { messagesEndRef } = useMessagesScroll(messagesByTickets);
  const status = useSelector((state) => state.chat.messages.status);
  const [selectedImage, setSelectedImage] = useState<number>(-1);

  useEffect(() => {
    dispatch(resetMessages());
    const promise = dispatch(getMessages({ familyId: conversation.family_id.toString() }));

    // cancel previous call for messages if family id was changed
    return () => {
      promise.abort();
    };
  }, [dispatch, conversation.family_id]);

  const imagesLightbox = useMemo(
    () =>
      getMessageList(messagesByTickets)
        .filter((i) => i.media)
        .map((i) => ({ src: i.media! })),
    [messagesByTickets]
  );

  const handleOpenLightbox = (imageUrl: string) => {
    const imageIndex = imagesLightbox.findIndex((image) => image.src === imageUrl);
    setSelectedImage(imageIndex);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{
          ref: messagesEndRef,
        }}
        sx={{ p: 3, height: 1 }}
      >
        {status === 'pending' && (
          <Stack direction="row" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}
        <ChatTickets tickets={messagesByTickets} onOpenLightbox={handleOpenLightbox} />
      </Scrollbar>

      <Lightbox
        index={selectedImage}
        slides={imagesLightbox}
        open={selectedImage >= 0}
        close={handleCloseLightbox}
      />
    </>
  );
}

const getMessageList = (ticketsMessages: IChatTicket[]) => {
  const onlyMessagesByTickets = ticketsMessages.map((i) => i.messages);
  return onlyMessagesByTickets.flat();
};
