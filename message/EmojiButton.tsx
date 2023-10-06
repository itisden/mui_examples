import * as React from 'react';
import { IconButton, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
// eslint-disable-next-line import/no-extraneous-dependencies
import data from '@emoji-mart/data';
// eslint-disable-next-line import/no-extraneous-dependencies
import Picker from '@emoji-mart/react';

export const EmojiPickerContainer = styled('div')({
  width: '352px',
});

type Props = {
  onEmojiSelect: (data: EmojiData) => void;
};

// TODO: load data for picker asynchronously to reduce bundle size
// https://github.com/missive/emoji-mart#-data
export default function EmojiButton({ onEmojiSelect }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <Iconify icon="fe:smile" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <EmojiPickerContainer>
          <Picker data={data} onEmojiSelect={onEmojiSelect} />
        </EmojiPickerContainer>
      </Popover>
    </>
  );
}

export type EmojiSkin = 1 | 2 | 3 | 4 | 5 | 6;

export interface EmojiData {
  id: string;
  name: string;
  colons: string;
  /** Reverse mapping to keyof emoticons */
  emoticons: string[];
  unified: string;
  skin?: EmojiSkin;
  native: string;
  aliases?: string[];
}
