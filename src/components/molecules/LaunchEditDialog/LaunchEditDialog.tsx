import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface LaunchEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (cost: string, payloadType: string) => void;
  cost: string;
  payloadType: string;
  payloadOptions: string[];
}

export const LaunchEditDialog = ({
  open,
  onClose,
  onSave,
  cost,
  payloadType,
  payloadOptions,
}: LaunchEditDialogProps) => {
  const [newCost, setNewCost] = useState(cost);
  const [newPayloadType, setNewPayloadType] = useState<string>(payloadType);
  const [costError, setCostError] = useState<string | null>(null);

  const isNumberRegex = /^\d+$/;

  useEffect(() => {
    setNewCost(cost);
    setNewPayloadType(payloadType);
    setCostError(null);
  }, [cost, payloadType, open]);

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewCost(value);

    if (!isNumberRegex.test(value)) {
      setCostError('Cost must be a valid number');
    } else if (parseFloat(value) <= 0) {
      setCostError('Cost must be greater than zero');
    } else {
      setCostError(null);
    }
  };

  const handleSave = () => {
    if (!costError) {
      onSave(newCost, newPayloadType);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Launch</DialogTitle>
      <DialogContent>
        <TextField
          label="Cost per Launch"
          value={newCost}
          onChange={handleCostChange}
          fullWidth
          margin="dense"
          error={!!costError}
          helperText={costError}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Payload Type</InputLabel>
          <Select
            value={newPayloadType}
            onChange={(e) => setNewPayloadType(e.target.value)}
            label="Payload Type"
          >
            {payloadOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!!costError}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
