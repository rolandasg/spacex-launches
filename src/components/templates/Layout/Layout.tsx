import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { purpleTheme } from '@styles/theme';

const customDarkTheme = createTheme(purpleTheme);

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={customDarkTheme}>
    <CssBaseline />
    <Container>{children}</Container>
  </ThemeProvider>
);
