import { Launch } from '@customTypes/Launch';

export const calculateTimeElapsed = (
  index: number,
  launches: Launch[],
): number | null => {
  if (index === launches.length - 1) {
    return null;
  }

  const currentLaunchDate = new Date(launches[index].launch_date_utc);
  const nextLaunchDate = new Date(launches[index + 1].launch_date_utc);
  const hoursDifference = Math.abs(
    Math.floor(
      (nextLaunchDate.getTime() - currentLaunchDate.getTime()) /
        (1000 * 60 * 60),
    ),
  );
  return hoursDifference;
};
