import { registerSheet } from 'react-native-actions-sheet';
import SelectDateRangeSelect from './SelectDateRangeSheet/SelectDateRangeSelect';
import SelectPaymentStatusSheet from './SelectPaymentStatusSheet/SelectPaymentStatusSheet';
import { SelectItemsSheet } from './SelectItemSheet/SelectItemSheet';

registerSheet('select-date-range', SelectDateRangeSelect);
registerSheet('select-status-payment', SelectPaymentStatusSheet);
registerSheet('selectItemsSheet',SelectItemsSheet)


export {};
