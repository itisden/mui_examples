import { ReactNode, useMemo } from 'react';
import { Box, Typography, SxProps } from '@mui/material';
import { format } from 'date-fns';
import type { IChatTicket, IHistoryRecord } from 'src/@types/message';
import { mergeMessagesWithTicketsHistory } from 'src/utils/message';
import { ticketStatuses, type TicketStatus } from 'src/@types/ticket';
import ChatMessageItem from './ChatMessageItem';

type Props = {
  ticket: IChatTicket;
  onOpenLightbox: (value: string) => void;
};

const datetimeFormat = 'd MMM yyy, h:mmaaa';

export default function ChatTicket({ ticket, onOpenLightbox }: Props) {
  const { messages, created, closed, history } = ticket;

  const chatItems = useMemo(
    () => mergeMessagesWithTicketsHistory(messages, history),
    [messages, history]
  );

  return (
    <Box>
      {created && (
        <ChatTiketStatusRow>
          {`Ticket created on ${format(new Date(created), datetimeFormat)}`}
        </ChatTiketStatusRow>
      )}
      {chatItems.map((i) => {
        if (i.type === 'message')
          return (
            <ChatMessageItem
              key={i.data.id.toString()}
              message={i.data}
              onOpenLightbox={onOpenLightbox}
            />
          );

        return (
          <ChatTiketStatusRow key={`${i.data.type}_${i.data.date}`}>
            {getHistoryLabel(i.data)}
          </ChatTiketStatusRow>
        );
      })}
      {closed && (
        <ChatTiketStatusRow>
          {`Ticket closed on ${format(new Date(closed), datetimeFormat)}`}
        </ChatTiketStatusRow>
      )}
    </Box>
  );
}

const getHistoryLabel = (data: IHistoryRecord): string => {
  const { type, date } = data;
  const action = type.split('_')[1];
  const datetime = format(new Date(date), datetimeFormat);

  if (!action) {
    return `${type} ${datetime}`;
  }

  if (ticketStatuses.includes(action as TicketStatus)) {
    return `Ticket was marked as ${action} on ${datetime}`;
  }

  return `${type} ${datetime}`;
};

type ChatTicketStatusProps = {
  children: ReactNode;
  sx?: SxProps;
};

const ChatTiketStatusRow = ({ children, sx = {} }: ChatTicketStatusProps) => (
  <Box textAlign="center" mb={1}>
    <Typography
      noWrap
      variant="caption"
      sx={{
        color: 'text.disabled',
        ...sx,
      }}
    >
      {children}
    </Typography>
  </Box>
);
