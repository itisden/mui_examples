import { Box, Divider } from '@mui/material';
import { IChatTicket } from 'src/@types/message';
import ChatTicket from './ChatTicket';

type Props = {
  tickets: IChatTicket[];
  onOpenLightbox: (value: string) => void;
};

export default function ChatTickets({ tickets, onOpenLightbox }: Props) {
  return (
    <>
      {tickets.map((ticket, index) => (
        <Box key={ticket.ticket_id.toString()}>
          {index !== 0 && <Divider sx={{ my: 1 }} />}
          <ChatTicket ticket={ticket} onOpenLightbox={onOpenLightbox} />
        </Box>
      ))}
    </>
  );
}
