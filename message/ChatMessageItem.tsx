import { ReactNode } from 'react';
import { Avatar, Typography, Stack, Box, type SxProps } from '@mui/material';
import {
  IMessage,
  IMessageDirection,
  IMessageDeliveryStatus,
  IMessageType,
} from 'src/@types/message';
import Image from 'src/components/image';
import PlatformAvatar from 'src/components/platform-avatar';
import MessageStatus from 'src/components/message-status/MessageStatus';
import { getMessageTime } from 'src/utils/datetime';
import Iconify from 'src/components/iconify';
import { getAgentName, isFile, isVideo, hasText, isImage } from 'src/utils/message';
import { Attachment } from 'src/components/attachment';

type Props = {
  message: IMessage;
  onOpenLightbox: (value: string) => void;
};

export default function ChatMessageItem({ message, onOpenLightbox }: Props) {
  const messageWasSent = message.direction === 'sent';
  const agentName = getAgentName(message);
  const showAgentInfo = messageWasSent && (agentName || Boolean(message.bot));

  return (
    <Stack direction="row" justifyContent={messageWasSent ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
      {!messageWasSent && (
        <PlatformAvatar
          platform={message.channel}
          avatarProps={{ sx: { width: 32, height: 32, mr: 2 } }}
        />
      )}

      <Stack spacing={1} alignItems={messageWasSent ? 'flex-end' : 'flex-start'}>
        <Stack direction="row" alignItems="center">
          {showAgentInfo && <AgentInfo label={agentName} bot={!!message.bot} />}
          <MessageContent direction={message.direction} type={message.type}>
            {isImage(message) && (
              <MessageImage
                src={message.media || ''}
                onClick={() => onOpenLightbox(message.media || '')}
              />
            )}
            {(isFile(message) || isVideo(message)) && (
              <Attachment path={message.media || ''} name={message.type} sx={{ mb: 1 }} />
            )}
            {hasText(message) && <MessageText>{message.text}</MessageText>}
            <StatusRow
              direction={message.direction}
              createdAt={message.createdDatetime}
              status={message.deliveryStatus}
            />
          </MessageContent>
        </Stack>
      </Stack>

      {messageWasSent && (
        <PlatformAvatar
          platform={message.channel}
          avatarProps={{ sx: { width: 32, height: 32, ml: 2 } }}
        />
      )}
    </Stack>
  );
}

/** AgentInfo */

type AgentInfoProps = {
  label: string;
  avatarSrc?: string;
  bot: boolean;
};

const AgentInfo = ({ label, bot, avatarSrc = '' }: AgentInfoProps) => (
  <Stack direction="column" alignItems="center">
    {bot ? (
      <Avatar sx={{ width: 32, height: 32, mr: 1, alignSelf: 'center' }}>
        <Iconify icon="icon-park-outline:robot-one" />
      </Avatar>
    ) : (
      <Avatar sx={{ width: 32, height: 32, mr: 1, alignSelf: 'center' }} src={avatarSrc} />
    )}
    <Typography
      noWrap
      variant="caption"
      sx={{ color: 'text.disabled', alignSelf: 'center', mr: 1 }}
    >
      {bot ? 'Automation' : label}
    </Typography>
  </Stack>
);

/** Time */

type MetaProps = {
  children: ReactNode;
  sx?: SxProps;
};

const MetaText = ({ children, sx = {} }: MetaProps) => (
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
);

/** StatusRow */

type StatusRowProps = {
  createdAt: string;
  status: IMessageDeliveryStatus;
  direction: IMessageDirection;
  sx?: SxProps;
};

const StatusRow = ({ createdAt, status, direction, sx = {} }: StatusRowProps) => (
  <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={sx}>
    <MetaText>{getMessageTime(createdAt)}</MetaText>
    {direction === 'sent' && <MessageStatus status={status} sx={{ ml: 1 }} />}
  </Stack>
);

/** MessageContent */

type MessageContentProps = {
  children: ReactNode;
  direction: IMessageDirection;
  type: IMessageType;
};

const MessageContent = ({ children, direction, type }: MessageContentProps) => (
  <Stack
    sx={{
      px: 1.5,
      pt: 1.5,
      pb: 1,
      minWidth: 48,
      maxWidth: 320,
      borderRadius: 1,
      overflow: 'hidden',
      typography: 'body2',
      bgcolor: 'background.neutral',
      ...(direction === 'sent' && {
        color: 'grey.800',
        bgcolor: 'primary.lighter',
      }),
      whiteSpace: 'pre-line'
    }}
  >
    {children}
  </Stack>
);

/** MessageText */

type MessageTextProps = {
  children: ReactNode;
  sx?: SxProps;
};

const MessageText = ({ children, sx = {} }: MessageTextProps) => (
  <Box sx={{ ...sx }}>{children}</Box>
);

/** MessageImage */

type MessageImageProps = {
  src: string;
  onClick: () => void;
  sx?: SxProps;
};

const MessageImage = ({ src, onClick, sx = {} }: MessageImageProps) => (
  <Image
    alt="attachment"
    src={src}
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      height: 150,
      '&:hover': {
        opacity: 0.9,
      },
      ...sx,
    }}
  />
);
