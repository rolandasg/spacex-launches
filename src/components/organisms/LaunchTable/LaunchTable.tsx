import { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableContainer, Paper } from '@mui/material';
import { Loader } from '@components/atoms/Loader';
import { TableHeader } from '@components/atoms/TableHeader';
import { LaunchRow } from '@components/molecules/LaunchRow';
import { LaunchContext } from '@context/LaunchContext';
import { Launch, Payload } from '@customTypes/Launch';
import { useFetchLaunches } from '@hooks/useFetchLaunches';
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';
import { tableStyle } from '@styles/theme';
import { calculateTimeElapsed } from '@utils/timeUtils';

export const LaunchTable = () => {
  const { launches, setLaunches } = useContext(LaunchContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { launches: fetchedLaunches, loading, error } = useFetchLaunches(page);

  useEffect(() => {
    if (loading || error) {
      return;
    }

    if (fetchedLaunches.length === 0) {
      setHasMore(false);
      return;
    }

    const previouslySaved = JSON.parse(
      localStorage.getItem('launchUpdates') || '{}',
    );

    const updatedLaunches = fetchedLaunches.map((launch) => {
      const updates = previouslySaved[launch.flight_number];

      if (!updates) {
        return launch;
      }

      const { cost: newCost, payloadType: newPayloadType } = updates;

      const updatedRocket = {
        ...launch.rocket,
        cost_per_launch: newCost ?? launch.rocket.cost_per_launch,
        second_stage: {
          ...launch.rocket.second_stage,
          payloads: launch.rocket.second_stage.payloads.map(
            (payload: Payload) => ({
              ...payload,
              payload_type: newPayloadType ?? payload.payload_type,
            }),
          ),
        },
      };

      return { ...launch, rocket: updatedRocket };
    });

    setLaunches((prev: Launch[]) => {
      return [
        ...prev,
        ...updatedLaunches.filter(
          (launch) =>
            !prev.find(
              (existing) => existing.flight_number === launch.flight_number,
            ),
        ),
      ];
    });
  }, [fetchedLaunches, loading, error, setLaunches]);

  const observerRef = useIntersectionObserver(
    () => {
      if (!hasMore || loading) {
        return;
      }
      setPage((prev) => prev + 1);
    },
    loading,
    hasMore,
  );

  const headers = [
    'Mission Name',
    'Flight Number',
    'Launch Date',
    'Cost Per Launch',
    'Payload Count',
    'Time elapsed since last launch',
    '',
  ];

  return (
    <TableContainer component={Paper} sx={tableStyle}>
      <Table stickyHeader>
        <TableHeader headers={headers} />
        <TableBody>
          {launches.map((launch, index) => (
            <LaunchRow
              key={`${launch.flight_number}-${index}`}
              launch={launch}
              timeElapsedHours={calculateTimeElapsed(index, launches)}
            />
          ))}
        </TableBody>
      </Table>
      <div ref={observerRef} style={{ height: 1 }} />
      {loading && <Loader />}
    </TableContainer>
  );
};
