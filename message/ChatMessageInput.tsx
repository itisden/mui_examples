import { useRef, useState, useEffect, useMemo, KeyboardEvent } from 'react';
import { uniqBy } from 'lodash';
import { Stack, InputBaseProps, IconButton, Box, Chip, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'src/redux/store';
import Iconify from 'src/components/iconify';
import type { Channel } from 'src/@types/channel';
import ButtonSelect from 'src/components/button-select';
import { sendSocialNetworkMessage, sendSMS } from 'src/redux/slices/chat';
import { useChatChannels } from 'src/hooks/channels';
import { useChatActivityStatus } from 'src/hooks/chat';
import { channelToIcon } from 'src/constants/chat';
import FormProvider from 'src/components/hook-form';
// import { IConversation } from 'src/@types/conversations';
import { getChannelById } from 'src/utils/channels';
import { selectMessagesOfActiveTicket } from 'src/redux/selectors/messages';
import EmojiButton, { EmojiData } from './EmojiButton';
import TemplatesMessageDialog from './TemplatesMessageDialog';
import TimeWindowRestriction from './TimeWindowRestriction';
import ChatInput from './ChatInput';

interface Props extends InputBaseProps {
  conversationId: string | number;
}

interface FormValuesProps {
  message: string;
  attachment: FileList | null;
}

const defaultValues = {
  message: '',
  attachment: null,
};

export default function ChatMessageInput({ conversationId }: Props) {
  const messages = useSelector(selectMessagesOfActiveTicket);
  const [templatesIsOpen, setTemplatesOpenState] = useState(false);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const conversation = useSelector((state) => state.chat.conversations.byId[conversationId]);
  const { channels = [] } = useChatChannels(conversation.family_id);
  const [channelId, setChannelId] = useState<string | null>(null);
  const methods = useForm<FormValuesProps>({ defaultValues });
  const selectedChannel = useMemo(
    () => (channelId ? getChannelById(channels, channelId) : null),
    [channels, channelId]
  );
  const chatIsActive = useChatActivityStatus(messages, selectedChannel);
  const channelOptions = useMemo(() => getChannelOptions(channels), [channels]);
  const channel = channelId !== null ? getChannelById(channels, channelId) : null;

  useEffect(() => {
    setChannelId(conversation.channel_id);
  }, [conversation]);

  const {
    reset,
    setValue,
    getValues,
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, isSubmitSuccessful, isDirty },
  } = methods;

  const { ref: fileRef, ...fileInputProps } = register('attachment');

  const watchedFormValues = watch();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [reset, isSubmitSuccessful]);

  const onSubmit = async (data: FormValuesProps) => {
    if (!selectedChannel) return;

    switch (selectedChannel.platform) {
      case 'whatsapp':
        if (!conversation.phone) return;
        await dispatch(
          sendSocialNetworkMessage({
            recipient: conversation.phone,
            text: data.message,
            attachment: data.attachment,
            channel: selectedChannel.platform,
            ticket_id: conversation.ticket_id,
            channelId: selectedChannel.channel,
          })
        ).unwrap();
        break;
      case 'facebook':
        if (!conversation.fb_id) return;
        await dispatch(
          sendSocialNetworkMessage({
            recipient: conversation.fb_id,
            text: data.message,
            attachment: data.attachment,
            channel: selectedChannel.platform,
            ticket_id: conversation.ticket_id,
            channelId: selectedChannel.channel,
          })
        ).unwrap();
        break;
      case 'sms':
        if (!conversation.phone) return;
        await dispatch(
          sendSMS({
            recipient: conversation.phone,
            text: data.message,
            channel: selectedChannel.platform,
            ticket_id: conversation.ticket_id,
          })
        ).unwrap();
        break;
      default:
    }
  };

  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAttachment = () => {
    setValue('attachment', null, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleEmojiSelect = (data: EmojiData) => {
    const msg = getValues('message');
    setValue('message', msg + data.native, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleClickTemplates = () => {
    setTemplatesOpenState(true);
  };

  const handleCloseTemplates = () => {
    setTemplatesOpenState(false);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const onlyEnterWasPressed = event.key === 'Enter' && !event.shiftKey;
    if (onlyEnterWasPressed && !formDataIsEmpty(watchedFormValues) && !isSubmitting) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <ChatInput name="message" onKeyDown={handleInputKeyDown} disabled={!chatIsActive} />

        {watchedFormValues.attachment?.[0] && (
          <Stack direction="row" sx={{ p: 1 }} justifyContent="end">
            <Chip
              variant="soft"
              size="small"
              label={watchedFormValues.attachment[0].name}
              onDelete={handleRemoveAttachment}
            />
          </Stack>
        )}

        <Stack direction="row" sx={{ p: 1 }}>
          <Box flexGrow={1}>
            <ButtonSelect
              placeholder="Loading..."
              options={channelOptions}
              onOptionSelect={setChannelId}
              value={channelId || undefined}
              size="small"
            />
          </Box>

          <IconButton disabled size="small">
            <Iconify icon="solar:phone-bold" />
          </IconButton>

          <IconButton size="small" onClick={handleClickAttach}>
            <Iconify icon="eva:attach-2-fill" />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleClickTemplates}
            disabled={channel?.platform !== 'whatsapp'}
          >
            <Iconify icon="mdi:message-plus" />
          </IconButton>

          <EmojiButton onEmojiSelect={handleEmojiSelect} />

          <IconButton
            disabled={!isDirty || isSubmitting || !chatIsActive}
            size="small"
            type="submit"
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : (
              <Iconify icon="material-symbols:send-rounded" />
            )}
          </IconButton>
        </Stack>

        <input
          type="file"
          ref={(ref) => {
            fileInputRef.current = ref;
            fileRef(ref);
          }}
          {...fileInputProps}
          style={{ display: 'none' }}
        />

        <TimeWindowRestriction
          messages={messages}
          channel={selectedChannel}
          chatIsActive={chatIsActive}
        />
      </FormProvider>
      <TemplatesMessageDialog
        open={templatesIsOpen}
        onClose={handleCloseTemplates}
        channelId={channelId}
        recipient={conversation.phone}
        ticket_id={conversation.ticket_id}
      />
    </>
  );
}

const getChannelOptions = (channels: Channel[]) =>
  uniqBy(channels, 'channel').map((i) => ({
    icon: <Iconify icon={channelToIcon[i.platform]} sx={{ mr: 0.5 }} />,
    value: i.channel,
    label: `${i.platform} ${i.phone || ''}`,
  }));

const formDataIsEmpty = (data: FormValuesProps) => !data.message.trim() && !data.attachment?.[0];
