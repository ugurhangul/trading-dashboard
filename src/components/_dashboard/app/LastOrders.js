import { isEmpty, orderBy } from 'lodash';
import { useRecoilValue } from 'recoil';
import { memo } from 'react';
import { format } from 'date-fns';

// material
import { Card, Typography, CardHeader, CardContent, CircularProgress, Grid } from '@mui/material';


import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@mui/lab';

// utils
import { fCurrency } from '../../../utils/formatNumber';
import { fDateTime } from '../../../utils/formatTime';
import { tradesAtom } from '../../../recoil/atoms';

function Trade({ trade, isLast }) {

  const { side, time, symbol,realizedPnl } = trade;

  const title = `Long ${symbol} ${side === 'BUY' ? 'opened' : 'closed'}`;

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              (side === 'BUY' && 'info.main') || (side === 'SELL' && 'success.main') || 'error.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {fCurrency(realizedPnl)} PNL
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

const LastOrders = () => {
  const trades = useRecoilValue(tradesAtom);
  const today = format(new Date(), 'MM/dd/yyyy');

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title="Last Trades Today" />
      <CardContent>
        <Grid container>

          <Grid item xs={6} md={6} lg={6}>
            <Content trades={orderBy(trades[today], ['time'], ['desc']).slice(0,5)}/>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Content trades={orderBy(trades[today], ['time'], ['desc']).slice(5,10)}/>
          </Grid>
        </Grid>
      </CardContent>

    </Card>
  );
};

const Content = memo(({ trades }) => {
  if (isEmpty(trades)) {
    return <CircularProgress />;
  }


  const tradesLength = trades.length;
  const maxLength = 10;

  return (
    <Timeline>
      {trades.slice(0, maxLength).map((trade, index) => (
        <Trade
          key={trade.id}
          trade={trade}
          isLast={index === tradesLength - 1 || index === maxLength - 1}
        />
      ))}
    </Timeline>
  );
});

export default LastOrders;
