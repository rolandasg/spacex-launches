import { render, screen } from '@testing-library/react';
import { TableHeader } from './TableHeader';
import '@testing-library/jest-dom';

test('renders TableHeader with the correct headers', () => {
  const headers = ['Header 1', 'Header 2', 'Header 3'];

  render(<TableHeader headers={headers} />);

  headers.forEach((header) => {
    const headerElement = screen.getByText(header);
    expect(headerElement).toBeInTheDocument();
  });
});
