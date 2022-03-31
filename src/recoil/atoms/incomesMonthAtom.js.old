import { atom } from 'recoil';
import { generateLastNdates } from '../../utils/formatTime';

const generateEmptyIncomes = () => {
  const lastMonthDates = generateLastNdates(30, 'MM/dd/yyyy');
  const emptyIncomes = {};

  lastMonthDates.forEach((d) => {
    emptyIncomes[d] = [];
  });

  return emptyIncomes;
};

const incomesMonthAtom = atom({
  key: 'incomesMonthState',
  default: generateEmptyIncomes()
});

export default incomesMonthAtom;
