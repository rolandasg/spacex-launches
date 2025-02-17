import { LaunchTable } from '@components/organisms/LaunchTable';
import { TotalCostDisplay } from '@components/organisms/TotalCostDisplay';
import { Layout } from '@components/templates/Layout';

export const Home = () => {
  return (
    <Layout>
      <TotalCostDisplay />
      <LaunchTable />
    </Layout>
  );
};
