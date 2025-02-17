import { useEffect } from 'react';

interface BroadcastData {
  type: string;
  flightNumber: number;
  cost?: number;
  payloadType?: string;
}

export const broadcastChannel = new BroadcastChannel('launchUpdates');

export const useBroadcastListener = (
  onBroadcast: (data: BroadcastData) => void,
) => {
  useEffect(() => {
    broadcastChannel.onmessage = (event: MessageEvent) => {
      onBroadcast(event.data);
    };

    return () => {
      broadcastChannel.onmessage = null;
    };
  }, [onBroadcast]);
};
