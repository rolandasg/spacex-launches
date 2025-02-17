import { useContext, useMemo } from 'react';
import { LaunchContext } from '../../../context/LaunchContext';

export const TotalCostDisplay = () => {
  const context = useContext(LaunchContext);

  if (!context) {
    return null;
  }

  const { launches } = context;

  const totalCost = useMemo(() => {
    return launches.reduce(
      (sum, launch) => sum + (Number(launch.rocket?.cost_per_launch) || 0),
      0,
    );
  }, [launches]);

  return <h2>Total Cost: ${totalCost.toLocaleString()}</h2>;
};
