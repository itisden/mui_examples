import { useMemo } from 'react';
import { useDispatch, useSelector } from 'src/redux/store';
import { Stack, Typography, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import ButtonSelect from 'src/components/button-select';
// import type { IConversation } from 'src/@types/conversations';
import type { TicketStatus } from 'src/@types/ticket';
import { getSenderDisplayName } from 'src/utils/conversation';
import { updateTicket, toggleAssignment } from 'src/redux/slices/chat';
import { useAuthContext } from 'src/auth/useAuthContext';

type Props = {
  activeConversationId: string | number;
};

export default function ChatHeaderDetail({ activeConversationId }: Props) {
  const dispatch = useDispatch();
  const { user } = useAuthContext();

  const selectedConversation = useSelector(
    (state) => state.chat.conversations.byId[activeConversationId]
  );

  const isAssigned = selectedConversation.assigned_user_id === user?.uid;

  const displayName = useMemo(
    () => getSenderDisplayName(selectedConversation),
    [selectedConversation]
  );

  const onResolve = () => {
    handleStatusChange('resolved');
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    const actionData = {
      id: selectedConversation.ticket_id,
      updates: {
        status: newStatus,
      },
      original: selectedConversation,
    };
    dispatch(updateTicket(actionData));
  };

  const handleToggleAssignment = async () => {
    const actionData = {
      ticketId: selectedConversation.ticket_id,
      assignee: isAssigned ? null : user?.uid,
    };
    dispatch(toggleAssignment(actionData));
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 1, 2, 2),
      }}
      spacing={2}
    >
      <Typography flexGrow={1} variant="subtitle1">
        {displayName}
      </Typography>

      {!isAssigned && (
        <ButtonSelect
          value={selectedConversation.status}
          onOptionSelect={handleStatusChange}
          options={chatStatusOptions}
          color="inherit"
          disabled
        />
      )}

      <Button
        variant="soft"
        color="inherit"
        startIcon={isAssigned && <Iconify icon="heroicons:arrow-uturn-left-20-solid" />}
        onClick={handleToggleAssignment}
      >
        {isAssigned ? 'Return' : 'Assign'}
      </Button>

      {isAssigned && (
        <>
          <Typography>Assigned: </Typography>

          <ButtonSelect
            value={selectedConversation.status}
            onOptionSelect={handleStatusChange}
            options={chatStatusOptions}
            color="inherit"
          />

          <Button variant="contained" color="primary" onClick={onResolve}>
            Resolve
          </Button>
        </>
      )}
    </Stack>
  );
}

const chatStatusOptions: { value: TicketStatus; label: string }[] = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'onhold',
    label: 'On hold',
  },
  {
    value: 'expired',
    label: 'Expired',
  },
  {
    value: 'resolved',
    label: 'Resolved',
  },
];
