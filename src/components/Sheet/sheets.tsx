import { registerSheet } from 'react-native-actions-sheet';
import SelectDateRangeSelect from './SelectDateRangeSheet/SelectDateRangeSelect';
import SelectPaymentStatusSheet from './SelectPaymentStatusSheet/SelectPaymentStatusSheet';
import { SelectItemsSheet } from './SelectItemSheet/SelectItemSheet';
import { EditSelectItemsSheet } from '../../screens/HistoryDetailScreen/EditSelectItemSheet';
import UpdateCartSheet from './UpdateCartSheet/UpdateCartSheet';

registerSheet('select-date-range', SelectDateRangeSelect);
registerSheet('select-status-payment', SelectPaymentStatusSheet);
registerSheet('selectItemsSheet', SelectItemsSheet);
registerSheet('editSelectItemsSheet', EditSelectItemsSheet);
registerSheet('updateCartSheet', UpdateCartSheet);

export {};
