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
export const SHEET_ID = {
  SELECT_DATE_RANGE: 'select-date-range',
  SELECT_STATUS_PAYMENT: 'select-status-payment',
  SELECT_ITEMS_SHEET: 'selectItemsSheet',
  EDIT_SELECT_ITEMS_SHEET: 'editSelectItemsSheet',
  UPDATE_CART_SHEET: 'updateCartSheet',
};
