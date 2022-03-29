import { merge, sum, max, flatten } from 'lodash';
import { format } from 'date-fns';
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';

// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';
import { fPercent,fCurrency } from '../../../utils/formatNumber';
import { generateLastNdates } from '../../../utils/formatTime';
import { incomesMonthAtom, accountAtom } from '../../../recoil/atoms';

// ----------------------------------------------------------------------

const lastMonthDates = generateLastNdates(30, 'MM/dd/yyyy').reverse();

const getIncomeForDate = (incomes, date) => {
  const incomeList = incomes[format(new Date(date), 'MM/dd/yyyy')];
  return sum(incomeList?.map((inc) => JSON.parse(inc?.income)));
};

const getIncomeOfMonth = (incomes, isRounded = false) => {
  const incomeOfMonth = lastMonthDates.map((date) => getIncomeForDate(incomes, date));

  return isRounded
    ? incomeOfMonth.map((inc) => Math.round(inc))
    : incomeOfMonth.map((inc) => parseFloat(inc.toFixed(2)));
};


const getBalanceLastMonth = (incomes, balance) => {
  let sumIncome = 0;
  const balances = [];

  const incomeOfMonth = getIncomeOfMonth(incomes).reverse();

  incomeOfMonth.forEach((inc, i) => {
    sumIncome += inc;
    balances.push(Math.round(balance - sumIncome + incomeOfMonth[i]));
  });
 
  return balances.reverse();
};



const PerformanceOverview = () => {
  const incomes = useRecoilValue(incomesMonthAtom);
  const account = useRecoilValue(accountAtom);

  const profitLastMonth = sum(
    flatten(Object.values(incomes))?.map((inc) => JSON.parse(inc?.income))
  );

  const { totalCrossWalletBalance = 0 } = account;
  const balance = JSON.parse(totalCrossWalletBalance);
  const increasePercent =
    (balance > 0 && profitLastMonth && (profitLastMonth / (balance - profitLastMonth)) * 100) || 0;

  const balancesOfLastMonth = getBalanceLastMonth(incomes, balance);
  const MonthIncome = getIncomeOfMonth(incomes, true);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: lastMonthDates,
    xaxis: { type: 'datetime' },
    yaxis: [
      {
        seriesName: 'Income',
        opposite: true,
        title: 'Income',
        min: 0,
        max: max(MonthIncome) * 2,
        forceNiceScale: true
      },
      {
        seriesName: 'Balance',
        min: Math.round(balancesOfLastMonth[0] * 0.99),
        max: Math.round(balancesOfLastMonth[balancesOfLastMonth.length - 1] * 1.01),
        forceNiceScale: true,
        title: 'Balance'
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `$${y.toFixed(1)}`;
          }
          return y;
        }
      }
    }
  });

  const CHART_DATA = [
    {
      name: 'Income',
      type: 'column',
      data: MonthIncome
    },
    {
      name: 'Balance',
      type: 'area',
      data: balancesOfLastMonth
    }
  ];

  return (
    <Card>
      <CardHeader
        title="Performance Overview"
        subheader={`${fPercent(increasePercent, '0.00%')} / ${fCurrency(profitLastMonth)} last 30 days`}
      />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
};

export default PerformanceOverview;
