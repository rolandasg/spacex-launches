import { createContext, ReactNode, useState } from 'react';
import { Launch } from '@customTypes/Launch';
import { useBroadcastListener } from '@hooks/useBroadcastListener';
import usePayloadOptions from '@hooks/usePayloadOptions';

export interface LaunchContextProps {
  launches: Launch[];
  setLaunches: React.Dispatch<React.SetStateAction<Launch[]>>;
  payloadOptions: string[];
}

interface LaunchProviderProps {
  children: ReactNode;
}

export const LaunchContext = createContext<LaunchContextProps>({
  launches: [],
  setLaunches: () => {},
  payloadOptions: [],
});

export const LaunchProvider: React.FC<LaunchProviderProps> = ({ children }) => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const payloadOptions = usePayloadOptions(launches);

  useBroadcastListener(({ flightNumber, cost, payloadType }) => {
    setLaunches((launches) =>
      launches.map((launch) => {
        if (launch.flight_number !== flightNumber) {
          return launch;
        }

        const { rocket } = launch;
        const { second_stage } = rocket;

        return {
          ...launch,
          rocket: {
            ...rocket,
            cost_per_launch: cost ?? rocket.cost_per_launch,
            second_stage: {
              ...second_stage,
              payloads: second_stage.payloads.map((payload, index) =>
                index === 0 && payloadType !== undefined
                  ? { ...payload, payload_type: payloadType }
                  : payload,
              ),
            },
          },
        };
      }),
    );
  });

  return (
    <LaunchContext.Provider
      value={{
        launches,
        setLaunches,
        payloadOptions,
      }}
    >
      {children}
    </LaunchContext.Provider>
  );
};
