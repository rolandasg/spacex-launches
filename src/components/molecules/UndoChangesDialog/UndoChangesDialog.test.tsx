import { render, screen, fireEvent } from '@testing-library/react';
import { UndoChangesDialog } from './UndoChangesDialog';
import '@testing-library/jest-dom';

describe('UndoChangesDialog', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    open: true,
    title: 'Undo Changes?',
    message: 'Are you sure you want to undo the changes?',
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  };

  it('renders dialog with title and message', () => {
    render(<UndoChangesDialog {...defaultProps} />);

    expect(screen.getByText('Undo Changes?')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to undo the changes?'),
    ).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<UndoChangesDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('Keep'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<UndoChangesDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('Undo'));

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('displays custom cancel and confirm text if provided', () => {
    const customProps = {
      ...defaultProps,
      confirmText: 'Yes, Undo',
      cancelText: 'No, Keep',
    };

    render(<UndoChangesDialog {...customProps} />);

    expect(screen.getByText('No, Keep')).toBeInTheDocument();
    expect(screen.getByText('Yes, Undo')).toBeInTheDocument();
  });
});
