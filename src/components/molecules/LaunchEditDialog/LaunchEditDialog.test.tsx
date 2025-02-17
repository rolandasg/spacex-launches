import { render, screen, fireEvent } from '@testing-library/react';
import { LaunchEditDialog } from './LaunchEditDialog';
import '@testing-library/jest-dom';

describe('LaunchEditDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    cost: '100',
    payloadType: 'Type A',
    payloadOptions: ['Type A', 'Type B', 'Type C'],
  };

  it('renders dialog with initial values', () => {
    render(<LaunchEditDialog {...defaultProps} />);

    expect(screen.getByLabelText('Cost per Launch')).toHaveValue('100');
    expect(screen.getByRole('combobox')).toHaveTextContent('Type A');
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<LaunchEditDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onSave when save button is clicked', () => {
    render(<LaunchEditDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Save'));
    expect(mockOnSave).toHaveBeenCalledWith('100', 'Type A');
  });
});
