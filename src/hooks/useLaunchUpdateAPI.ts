import { useState } from 'react';
import { API_BASE_URL } from '@utils/api';

export type UpdateType = 'payloadType' | 'cost';

export const useUpdateLaunchAPI = (type: UpdateType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (
    identifier: string,
    newValue: string,
    rollbackCallback: () => void,
    successCallback: (data: any) => void,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      let url: string;
      let body: any;

      if (type === 'payloadType') {
        url = `${API_BASE_URL}/payloads/${identifier}`;
        body = { payload_type: newValue };
      } else {
        url = `${API_BASE_URL}/rockets/${identifier}`;
        body = { cost_per_launch: Number(newValue) };
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          type === 'payloadType'
            ? 'Failed to update payload type'
            : 'Failed to update cost',
        );
      }

      const data = await response.json();
      successCallback(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
      rollbackCallback();
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
};
