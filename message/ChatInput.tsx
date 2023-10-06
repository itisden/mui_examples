import { InputBase, InputBaseComponentProps } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

type InputProps = InputBaseComponentProps & {
  name: string;
  disabled?: boolean;
};

export default function ChatInput({ name, onKeyDown, disabled = false }: InputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputBase
          {...field}
          disabled={disabled}
          onKeyDown={onKeyDown}
          multiline
          rows={2}
          placeholder="Type a message"
          sx={{
            p: 1,
            flexShrink: 0,
            borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            width: 1,
            '&.Mui-disabled': {
              backgroundColor: (theme) => theme.palette.grey[100],
            },
          }}
        />
      )}
    />
  );
}
