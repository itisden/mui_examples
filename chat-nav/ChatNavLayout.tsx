import { useState, useEffect, ReactNode } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Drawer, IconButton, IconButtonProps } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';
import Iconify from 'src/components/iconify';

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  children: ReactNode;
};

export default function ChatNavLayout({ children }: Props) {
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const [openNav, setOpenNav] = useState(false);

  const isCollapse = isDesktop && !openNav;

  useEffect(() => {
    if (!isDesktop) {
      handleCloseNav();
    } else {
      handleOpenNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  const handleToggleNav = () => {
    setOpenNav(!openNav);
  };

  const handleOpenNav = () => {
    setOpenNav(true);
  };

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  return (
    <>
      {!isDesktop && (
        <StyledToggleButton onClick={handleToggleNav}>
          <Iconify width={16} icon="eva:people-fill" />
        </StyledToggleButton>
      )}

      {isDesktop ? (
        <Drawer
          open={openNav}
          variant="persistent"
          PaperProps={{
            sx: {
              pb: 1,
              width: 1,
              position: 'static',
              ...(isCollapse && {
                transform: 'none !important',
                visibility: 'visible !important',
              }),
            },
          }}
          sx={{
            width: NAV_WIDTH,
            transition: theme.transitions.create('width'),
            ...(isCollapse && {
              width: NAV_COLLAPSE_WIDTH,
            }),
          }}
        >
          {children}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={handleCloseNav}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              pb: 1,
              width: NAV_WIDTH,
            },
          }}
        >
          {children}
        </Drawer>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

const StyledToggleButton = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker,
  },
}));
