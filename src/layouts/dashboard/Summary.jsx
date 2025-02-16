import React from 'react';
import { Grid } from '@mui/material';
import { sum, flatten } from 'lodash';
import { useRecoilValue } from 'recoil';
import { format } from 'date-fns';

import SummaryBox from '../../components/_dashboard/SummaryBox';
import { fCurrency, fNumber } from '../../utils/formatNumber';
import { tradesAtom, incomesAtom, accountAtom } from '../../recoil/atoms';
import { getPercentIncrease } from '../../utils/functions';

const Summary = () => {
  const trades = useRecoilValue(tradesAtom);
  const incomes = useRecoilValue(incomesAtom);
  const account = useRecoilValue(accountAtom);

  const today = format(new Date(), 'MM/dd/yyyy');
  const incomeToday = incomes[today];
  const tradesToday = trades[today];

  const profitToday = sum(incomeToday?.map((inc) => JSON.parse(inc?.income)));
  const weekProfit = sum(flatten(Object.values(incomes)).map((inc) => JSON.parse(inc?.income)));
  const netBalance = parseFloat(account.totalWalletBalance) + parseFloat(account.totalUnrealizedProfit);
  const currentNetProfit =  parseFloat(profitToday) + parseFloat(account.totalUnrealizedProfit);
  const tradesNumber = {};


  tradesToday?.forEach((trade) => {
    tradesNumber[trade.symbol] = (tradesNumber[trade.symbol] || 0) + 1;
  });

  const sortedPerformersOfToday = Object.entries(tradesNumber).sort(
    (prev, next) => prev[1] - next[1]
  );

  return (
    <>
      <Grid item xs={4} sm={4} md={4}>
        <SummaryBox
          text="Profit Today"
          total={getPercentIncrease(profitToday, account?.totalWalletBalance)}
          subText={fCurrency(profitToday)}
          color="primary"
          backgroundColor="success"
        />
      </Grid>

      <Grid item xs={4} sm={4} md={4}>
        <SummaryBox
          text="Current Net Profit Today"
          total={getPercentIncrease(currentNetProfit, account?.totalWalletBalance)}
          subText={fCurrency(currentNetProfit)}
          color="primary"
          backgroundColor="success"
        />
      </Grid>


      <Grid item xs={4} sm={4} md={4}>
        <SummaryBox
          text="Profit last 7 days"
          total={getPercentIncrease(weekProfit, account?.totalWalletBalance)}
          color="info"
          subText={fCurrency(weekProfit)}
          backgroundColor="info"
        />
      </Grid>
      <Grid item xs={4} sm={4} md={4}>
        <SummaryBox
          text="Unrealised PnL"
          total={fCurrency(account?.totalUnrealizedProfit)}
          color="warning"
          backgroundColor="error"
        />
      </Grid>
      <Grid item xs={4} sm={4} md={4}>
        <SummaryBox
          text="Most traded today"
          total={sortedPerformersOfToday?.pop()?.[0]}
          color="error"
          backgroundColor="warning"
        />
      </Grid>
      <Grid item xs={4} sm={4} md={4}>
        <SummaryBox
          text="Trades today"
          total={fNumber(tradesToday?.length)}
          color="warning"
          backgroundColor="secondary"
        />
      </Grid>
      <Grid item xs={6} sm={6} md={6}>
        <SummaryBox
          text="Balance"
          total={fCurrency(account?.totalWalletBalance)}
          color="error"
          backgroundColor="primary"
        />
      </Grid>
      
      <Grid item xs={6} sm={6} md={6}>
        <SummaryBox
          text="Net Balance"
          total={fCurrency(netBalance)}
       
          color="primary"
          backgroundColor="success"
        />
      </Grid>
    </>
  );
};

export default Summary;
