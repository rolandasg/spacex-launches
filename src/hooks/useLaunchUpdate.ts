import { useState, useContext, useEffect, useRef } from 'react';
import { LaunchContext } from '@context/LaunchContext';
import { broadcastChannel } from './useBroadcastListener';
import { useUpdateLaunchAPI, UpdateType } from './useLaunchUpdateAPI';
import { Launch } from '@customTypes/Launch';
import { delay } from '@utils/delayUtils';

const useLaunchUpdate = (launch: Launch, type: UpdateType) => {
  const { setLaunches } = useContext(LaunchContext)!;

  const propertyKey = type === 'payloadType' ? type : 'cost';

  const initialValue: string =
    type === 'payloadType'
      ? launch.rocket.second_stage.payloads[0].payload_type ?? ''
      : String(launch.rocket.cost_per_launch ?? '');

  const [value, setValue] = useState<string>(initialValue);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [undoChanges, setUndoChanges] = useState<boolean>(false);
  const [prevValue, setPrevValue] = useState<string>(initialValue);

  const prevFlightNumberRef = useRef(launch.flight_number);
  const prevTypeRef = useRef(type);

  useEffect(() => {
    const newInitialValue =
      type === 'payloadType'
        ? launch.rocket.second_stage.payloads[0].payload_type ?? ''
        : String(launch.rocket.cost_per_launch ?? '');

    setValue(newInitialValue);

    if (
      prevFlightNumberRef.current !== launch.flight_number ||
      prevTypeRef.current !== type
    ) {
      setPrevValue(newInitialValue);
      prevFlightNumberRef.current = launch.flight_number;
      prevTypeRef.current = type;
    }
  }, [launch, type]);

  const { update } = useUpdateLaunchAPI(type);

  const identifier =
    type === 'payloadType'
      ? launch.rocket.second_stage.payloads[0].payload_id
      : launch.rocket.rocket_id;

  const updateLaunch = (newValue: string) => {
    setLaunches((prev: Launch[]) =>
      prev.map((l) => {

        if (l.flight_number !== launch.flight_number) {
          return l;
        }

        if (type === 'payloadType') {
          return {
            ...l,
            rocket: {
              ...l.rocket,
              second_stage: {
                ...l.rocket.second_stage,
                payloads: l.rocket.second_stage.payloads.map((p) =>
                  p.payload_id === l.rocket.second_stage.payloads[0].payload_id
                    ? { ...p, payload_type: newValue }
                    : p,
                ),
              },
            },
          };
        } else {
          return {
            ...l,
            rocket: {
              ...l.rocket,
              cost_per_launch: Number(newValue),
            },
          };
        }
      }),
    );
  };

  const updateLaunchWithApiResponse = (data: any) => {
    setLaunches((prev: Launch[]) =>
      prev.map((l) => {

        if (l.flight_number !== launch.flight_number) {
          return l;
        }

        const updatedRocket = { ...l.rocket };

        if (type === 'payloadType') {
          updatedRocket.second_stage = {
            ...updatedRocket.second_stage,
            payloads: updatedRocket.second_stage.payloads.map((p) =>
              p.payload_id === data.payload_id
                ? { ...p, payload_type: data.payload_type }
                : p
            ),
          };
        } else {
          updatedRocket.cost_per_launch = data.cost_per_launch;
        }

        return { ...l, rocket: updatedRocket };
      })
    );
  };

  const updateLocalAndBroadcast = (newValue: string, messageType: string) => {
    const updates = JSON.parse(localStorage.getItem('launchUpdates') || '{}');
    updates[launch.flight_number] = {
      ...updates[launch.flight_number],
      [propertyKey]: newValue,
    };
    localStorage.setItem('launchUpdates', JSON.stringify(updates));

    broadcastChannel.postMessage({
      type: messageType,
      flightNumber: launch.flight_number,
      [propertyKey]: newValue,
    });
  };

  const handleSave = async (newValue: string) => {
    if (newValue === value) {
      return;
    }

    setPrevValue(value);
    updateLaunch(newValue);

    updateLocalAndBroadcast(newValue, 'UPDATE_LAUNCH');

    setIsUpdating(true);

    await delay(2000);

    update(
      identifier,
      newValue,
      () => {
        setUndoChanges(true);
      },
      (data: any) => {
        updateLaunchWithApiResponse(data);
        updateLocalAndBroadcast(
          type === 'payloadType'
            ? data.payload_type
            : String(data.cost_per_launch),
          'UPDATE_LAUNCH',
        );
      },
    ).finally(() => setIsUpdating(false));
  };

  const rollbackUpdate = () => {
    updateLaunch(prevValue);
    updateLocalAndBroadcast(prevValue, 'ROLLBACK_LAUNCH');
    setUndoChanges(false);
  };

  return {
    value,
    setValue,
    isUpdating,
    handleSave,
    rollbackUpdate,
    undoChanges,
    setUndoChanges,
  };
};

export const usePayloadUpdate = (launch: Launch) =>
  useLaunchUpdate(launch, 'payloadType');
export const useCostUpdate = (launch: Launch) =>
  useLaunchUpdate(launch, 'cost');

export default useLaunchUpdate;
