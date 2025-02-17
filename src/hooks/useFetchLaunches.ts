import { useState, useEffect } from 'react';
import { Launch } from '@customTypes/Launch';
import { API_BASE_URL } from '@utils/api';

const rocketCostCache = new Map<string, number>();

export const useFetchLaunches = (page = 1) => {
  const [launches, setLaunches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/launches?limit=10&offset=${(page - 1) * 10}&order=desc`,
        );
        const data = await response.json();

        const uniqueRockets = [
          ...new Set(data.map((launch: Launch) => launch.rocket.rocket_id)),
        ];

        await Promise.all(
          uniqueRockets.map(async (rocketId) => {
            if (!rocketCostCache.has(rocketId as string)) {
              const response = await fetch(
                `${API_BASE_URL}/rockets/${rocketId}`,
              );
              if (response.ok) {
                const rocketData = await response.json();
                rocketCostCache.set(
                  rocketId as string,
                  rocketData.cost_per_launch,
                );
              }
            }
          }),
        );

        const updatedLaunches = data.map((launch: any) => ({
          ...launch,
          rocket: {
            ...launch.rocket,
            cost_per_launch: rocketCostCache.get(launch.rocket.rocket_id) || 0,
          },
        }));

        setLaunches(updatedLaunches);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, [page]);

  return { launches, loading, error, rocketCostCache };
};
