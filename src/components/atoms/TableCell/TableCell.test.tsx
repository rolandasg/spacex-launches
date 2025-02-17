import { render, screen } from '@testing-library/react';
import { TableCell } from './TableCell';
import '@testing-library/jest-dom';

test('renders TableCell with content', () => {
  render(<TableCell>Test Content</TableCell>);

  const cellElement = screen.getByText('Test Content');
  expect(cellElement).toBeInTheDocument();
});
