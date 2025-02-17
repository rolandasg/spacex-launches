import { useContext, useState } from 'react';
import {
  TableRow,
  IconButton,
  TableCell,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { LaunchContext } from '@context/LaunchContext';
import { usePayloadUpdate, useCostUpdate } from '@hooks/useLaunchUpdate';
import { currencyFormatter } from '@utils/currencyUtils';
import { UndoChangesDialog } from '@components/molecules/UndoChangesDialog';
import { LaunchEditDialog } from '@components/molecules/LaunchEditDialog';
import { Launch } from '@customTypes/Launch';

interface LaunchRowProps {
  launch: Launch;
  timeElapsedHours: number | null;
}

export const LaunchRow = ({ launch, timeElapsedHours }: LaunchRowProps) => {
  const {
    value: cost,
    isUpdating: isCostUpdating,
    handleSave: handleSaveCost,
    rollbackUpdate: rollbackCostUpdate,
    undoChanges: undoCostChanges,
    setUndoChanges: setUndoCostChanges,
  } = useCostUpdate(launch);

  const {
    value: currentPayload,
    isUpdating: isPayloadUpdating,
    handleSave: handleSavePayload,
    rollbackUpdate: rollbackPayloadUpdate,
    undoChanges: undoPayloadChanges,
    setUndoChanges: setUndoPayloadChanges,
  } = usePayloadUpdate(launch);

  const [open, setOpen] = useState(false);

  const launchContext = useContext(LaunchContext);
  const payloadOptions = launchContext ? launchContext.payloadOptions : [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (newCost: string, newPayloadType: string) => {
    handleSaveCost(String(newCost));
    handleSavePayload(newPayloadType);
    setOpen(false);
  };

  const isUndoOpen = undoCostChanges || undoPayloadChanges;

  const handleUndoConfirm = () => {
    if (undoCostChanges) {
      rollbackCostUpdate();
      setUndoCostChanges(false);
    }
    if (undoPayloadChanges) {
      rollbackPayloadUpdate();
      setUndoPayloadChanges(false);
    }
  };

  const handleUndoCancel = () => {
    if (undoCostChanges) {
      setUndoCostChanges(false);
    }
    if (undoPayloadChanges) {
      setUndoPayloadChanges(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{launch.mission_name}</TableCell>
        <TableCell>{launch.flight_number}</TableCell>
        <TableCell>
          {new Date(launch.launch_date_utc).toLocaleDateString()}
        </TableCell>
        <TableCell>{cost ? currencyFormatter(cost) : 'N/A'}</TableCell>
        <TableCell>
          <Tooltip title={currentPayload || 'N/A'}>
            <span>{launch.rocket.second_stage.payloads.length}</span>
          </Tooltip>
        </TableCell>
        <TableCell>
          {timeElapsedHours !== null ? `${timeElapsedHours} hrs` : 'N/A'}
        </TableCell>
        <TableCell>
          {isCostUpdating || isPayloadUpdating ? (
            <CircularProgress size={20} />
          ) : (
            <IconButton onClick={handleOpen}>
              <Edit />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      <LaunchEditDialog
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        cost={cost}
        payloadType={currentPayload}
        payloadOptions={payloadOptions}
      />

      <UndoChangesDialog
        open={isUndoOpen}
        title="Operation failed"
        message="Would you like to undo changes?"
        onConfirm={handleUndoConfirm}
        onCancel={handleUndoCancel}
      />
    </>
  );
};
