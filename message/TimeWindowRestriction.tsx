import { useMemo } from 'react';
import { Typography } from '@mui/material';
import { type Channel } from 'src/@types/channel';
import CountdownTimer from 'src/components/countdown-timer';
import { getDeadline } from 'src/utils/common';
import { IMessage } from 'src/@types/message';

type Props = {
  channel?: Channel | null;
  messages: IMessage[];
  chatIsActive: boolean;
};

const TimeWindowRestriction = ({ messages, chatIsActive, channel }: Props) => {
  const deadline = useMemo(
    () => (channel ? getDeadline(messages, channel) : null),
    [messages, channel]
  );

  if (!channel) {
    return null;
  }

  if (!chatIsActive) {
    return (
      <Typography variant="subtitle2" align="center" sx={{ p: 0.5 }}>
        reply window is closed
      </Typography>
    );
  }

  if (deadline) {
    return (
      <CountdownTimer
        end={deadline}
        activeText="until reply window closes"
        expiredText="reply window is closed"
        sx={{ p: 0.5 }}
      />
    );
  }

  return null;
};

export default TimeWindowRestriction;
