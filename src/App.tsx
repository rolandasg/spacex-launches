import { LaunchProvider } from '@context/LaunchContext';
import { Home } from '@pages/Home';

export const App = () => {
  return (
    <LaunchProvider>
      <Home />
    </LaunchProvider>
  );
};
