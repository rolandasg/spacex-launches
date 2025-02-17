import { PaletteMode } from '@mui/material';

export const purpleTheme = {
  palette: {
    mode: 'dark' as PaletteMode,
    background: {
      default: '#181818',
      paper: '#242424',
    },
    primary: {
      main: '#BB86FC',
      contrastText: '#121212',
    },
    text: {
      primary: '#EAEAEA',
      secondary: '#C4C4C4',
    },
    divider: '#292929',
  },
};

export const scrollbarStyle = {
  '&::-webkit-scrollbar': {
    width: '9px',
    height: '9px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#BB86FC',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#181818',
    borderRadius: '10px',
  },
};

export const tableStyle = {
  width: '100%',
  height: '90vh',
  border: `1px solid ${purpleTheme.palette.divider}`,
  borderRadius: '8px',
  ...scrollbarStyle,
};
