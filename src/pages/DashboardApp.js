// material
import { Grid, Container } from '@mui/material';

// components
import Page from '../components/Page';
import {
   LastOrders,
  PositionsRepartition,
  PerformanceOverview,
   TopPerformersToday,
  TopPerformersWeek
} from '../components/_dashboard/app';
import Summary from '../layouts/dashboard/Summary';

// ----------------------------------------------------------------------

const DashboardApp = () => (
  <Page title="Binance Futures Dashboard">
    <Container style={{ marginTop: 20 }} maxWidth="xxxl">
  
      <Grid container spacing={3}>
        <Summary />

        <Grid item xs={12} md={6} lg={6}>
          <LastOrders />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <PositionsRepartition />
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
          <TopPerformersToday />
        </Grid>
    
        <Grid item xs={12} md={12} lg={6}>
          <TopPerformersWeek />
        </Grid>
      
       
        <Grid item xs={12} md={12} lg={12}>
          <PerformanceOverview />
        </Grid>
      </Grid>
    </Container>
  </Page>
);

export default DashboardApp;
