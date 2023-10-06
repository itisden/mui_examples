import { Typography, LinearProgress, Alert } from '@mui/material';
import { useDispatch } from 'src/redux/store';
import SearchNotFound from 'src/components/search-not-found';
import { useChatSearch } from 'src/hooks/chat';
import Conversion from 'src/components/conversation';
import { IConversation } from 'src/@types/conversations';
import { setActiveConversation } from 'src/redux/slices/chat';
import Scrollbar from 'src/components/scrollbar';

type Props = {
  searchQuery: string;
};

export default function ChatNavSearchResults({ searchQuery }: Props) {
  const dispatch = useDispatch();

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useChatSearch(searchQuery, !!searchQuery);

  const notFound = !isLoading && !isError && data.length === 0;

  const handleClickOnConversation = (conversation: IConversation) => {
    dispatch(setActiveConversation(conversation));
  };

  return (
    <>
      <Typography
        paragraph
        variant="h6"
        sx={{
          px: 2.5,
        }}
      >
        Conversations
      </Typography>

      {(isLoading || isFetching) && <LinearProgress />}

      {isError && (
        <Alert severity="error" sx={{ m: 1 }}>
          {error?.message}
        </Alert>
      )}

      {notFound ? (
        <SearchNotFound
          query={searchQuery}
          sx={{
            p: 3,
            mx: 'auto',
            width: `calc(100% - 40px)`,
            bgcolor: 'background.neutral',
          }}
        />
      ) : (
        <Scrollbar>
          {data.map((conversation) => (
            <Conversion
              key={conversation.ticket_id}
              conversation={conversation}
              onClick={() => handleClickOnConversation(conversation)}
            />
          ))}
        </Scrollbar>
      )}
    </>
  );
}
