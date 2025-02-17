import { Launch } from '@customTypes/Launch';
import { useMemo } from 'react';

const usePayloadOptions = (launches: Launch[]): string[] => {
  return useMemo(() => {
    const options = new Set<string>();

    for (const launch of launches) {
      const type = launch?.rocket?.second_stage?.payloads?.[0]?.payload_type;

      if (type) {
        options.add(type);
      }
    }
    return [...options];
  }, [launches]);
};

export default usePayloadOptions;
