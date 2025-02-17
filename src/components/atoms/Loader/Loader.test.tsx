import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loader } from './Loader';

test('renders the Loader component with CircularProgress', () => {
  render(<Loader />);

  const loaderElement = screen.getByRole('progressbar');
  expect(loaderElement).toBeInTheDocument();
});
