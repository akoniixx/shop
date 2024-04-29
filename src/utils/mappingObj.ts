export const statusHistory = (company: string) => ({
  WAIT_APPROVE_ORDER: 'รอชำระเงิน',
  WAIT_CONFIRM_ORDER: 'รอชำระเงิน',
  CONFIRM_ORDER: 'รอชำระเงิน',
  IN_DELIVERY: 'รอชำระเงิน',
  OPEN_ORDER: 'รอชำระเงิน',
  REJECT_ORDER: 'รอชำระเงิน',
  SHOPAPP_CANCEL_ORDER: 'รอชำระเงิน',
  DELIVERY_SUCCESS:
    company === 'ICPI' || company === 'ICPF'
      ? 'ขึ้นสินค้าเรียบร้อยแล้ว'
      : 'ได้รับสินค้าแล้ว',
  COMPANY_CANCEL_ORDER: 'รอชำระเงิน',
  SALE_CANCEL_ORDER: 'รอชำระเงิน',
});
export const statusHistoryPaid = (company: string) => ({
  WAIT_APPROVE_ORDER: 'ชำระเงินแล้ว',
  WAIT_CONFIRM_ORDER: 'ชำระเงินแล้ว',
  CONFIRM_ORDER: 'ชำระเงินแล้ว',
  IN_DELIVERY: 'ชำระเงินแล้ว',
  OPEN_ORDER: 'ชำระเงินแล้ว',
  REJECT_ORDER: 'ชำระเงินแล้ว',
  SHOPAPP_CANCEL_ORDER: 'ชำระเงินแล้ว',
  DELIVERY_SUCCESS:
    company === 'ICPI' || company === 'ICPF'
      ? 'ขึ้นสินค้าเรียบร้อยแล้ว'
      : 'ได้รับสินค้าแล้ว',
  COMPANY_CANCEL_ORDER: 'ชำระเงินแล้ว',
  SALE_CANCEL_ORDER: 'ชำระเงินแล้ว',
});

export const statusHistoryCashText = (company: string) => ({
  WAIT_APPROVE_ORDER: 'รอยืนยันคำสั่งซื้อ',
  WAIT_CONFIRM_ORDER: 'รอยืนยันคำสั่งซื้อ',
  CONFIRM_ORDER: 'ยืนยันคำสั่งซื้อแล้ว',
  OPEN_ORDER: 'กำลังดำเนินการ',
  IN_DELIVERY:
    company === 'ICPI' || company === 'ICPF' ? 'รอขึ้นสินค้า' : 'กำลังจัดส่ง',
  DELIVERY_SUCCESS:
    company === 'ICPI' || company === 'ICPF'
      ? 'ขึ้นสินค้าเรียบร้อยแล้ว'
      : 'ได้รับสินค้าแล้ว',
  SHOPAPP_CANCEL_ORDER: 'คำสั่งซื้อถูกยกเลิก',
  REJECT_ORDER: 'คำสั่งซื้อถูกยกเลิก',
  COMPANY_CANCEL_ORDER: 'ยกเลิกโดยบริษัท',
  SALE_CANCEL_ORDER: 'ยกเลิกโดยพนักงานขาย',
});
export const statusHistoryCashColor = {
  WAIT_APPROVE_ORDER: 'warning',
  WAIT_CONFIRM_ORDER: 'warning',
  CONFIRM_ORDER: 'primary',
  OPEN_ORDER: 'waiting',
  IN_DELIVERY: 'warning',
  DELIVERY_SUCCESS: 'current',
  SHOPAPP_CANCEL_ORDER: 'error',
  REJECT_ORDER: 'error',
  COMPANY_CANCEL_ORDER: 'error',
  SALE_CANCEL_ORDER: 'error',
};
export const statusHistoryCashBGColor = {
  WAIT_APPROVE_ORDER: 'rgba(244, 191, 0, 0.16)',
  WAIT_CONFIRM_ORDER: 'rgba(244, 191, 0, 0.16)',
  CONFIRM_ORDER: 'rgba(76, 149, 255, 0.16)',
  OPEN_ORDER: 'rgba(255, 136, 36, 0.16)',
  IN_DELIVERY: 'rgba(244, 191, 0, 0.16)',
  DELIVERY_SUCCESS: 'rgba(58, 174, 73, 0.16)',
  SHOPAPP_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
  REJECT_ORDER: 'rgba(255, 93, 93, 0.16)',
  COMPANY_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
  SALE_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
};

export const statusHistoryColor = {
  WAIT_APPROVE_ORDER: 'subheading3',
  WAIT_CONFIRM_ORDER: 'subheading3',
  CONFIRM_ORDER: 'subheading3',
  OPEN_ORDER: 'subheading3',
  IN_DELIVERY: 'subheading3',
  DELIVERY_SUCCESS: 'current',
  SHOPAPP_CANCEL_ORDER: 'error',
  COMPANY_CANCEL_ORDER: 'error',
};
export const statusHistoryColorPaid = {
  WAIT_APPROVE_ORDER: 'primary',
  WAIT_CONFIRM_ORDER: 'primary',
  CONFIRM_ORDER: 'primary',
  OPEN_ORDER: 'primary',
  IN_DELIVERY: 'primary',
  DELIVERY_SUCCESS: 'current',
  SHOPAPP_CANCEL_ORDER: 'error',
  COMPANY_CANCEL_ORDER: 'error',
};
export const statusHistoryBGColor = {
  WAIT_APPROVE_ORDER: 'rgba(186, 145, 255, 0.16)',
  WAIT_CONFIRM_ORDER: 'rgba(186, 145, 255, 0.16)',
  CONFIRM_ORDER: 'rgba(186, 145, 255, 0.16)',
  OPEN_ORDER: 'rgba(186, 145, 255, 0.16)',
  IN_DELIVERY: 'rgba(186, 145, 255, 0.16)',
  DELIVERY_SUCCESS: 'rgba(58, 174, 73, 0.16)',
  SHOPAPP_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
  COMPANY_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
  SALE_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
};
export const statusHistoryBGColorPaid = {
  WAIT_APPROVE_ORDER: 'rgba(76, 149, 255, 0.16)',
  WAIT_CONFIRM_ORDER: 'rgba(76, 149, 255, 0.16)',
  CONFIRM_ORDER: 'rgba(76, 149, 255, 0.16)',
  OPEN_ORDER: 'rgba(76, 149, 255, 0.16)',
  IN_DELIVERY: 'rgba(76, 149, 255, 0.16)',
  DELIVERY_SUCCESS: 'rgba(58, 174, 73, 0.16)',
  SHOPAPP_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
  COMPANY_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
  SALE_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
};

export const statusHistoryCredit = (company: string) => ({
  WAIT_APPROVE_ORDER: 'รออนุมัติคำสั่งซื้อ',
  WAIT_CONFIRM_ORDER: 'รอยืนยันคำสั่งซื้อ',
  CONFIRM_ORDER: 'ยืนยันคำสั่งซื้อแล้ว',
  OPEN_ORDER: 'กำลังดำเนินการ',
  IN_DELIVERY:
    company === 'ICPI' || company === 'ICPF' ? 'รอขึ้นสินค้า' : 'กำลังจัดส่ง',
  DELIVERY_SUCCESS:
    company === 'ICPI' || company === 'ICPF'
      ? 'ขึ้นสินค้าเรียบร้อยแล้ว'
      : 'ได้รับสินค้าแล้ว',
  SHOPAPP_CANCEL_ORDER: 'คำสั่งซื้อถูกยกเลิก',
  REJECT_ORDER: 'คำสั่งซื้อถูกยกเลิก',
  COMPANY_CANCEL_ORDER: 'คำสั่งซื้อถูกยกเลิก',
});
export const statusHistoryColorCredit = {
  WAIT_APPROVE_ORDER: 'waiting',
  REJECT_ORDER: 'error',
  WAIT_CONFIRM_ORDER: 'warning',
  CONFIRM_ORDER: 'primary',
  SHOPAPP_CANCEL_ORDER: 'error',
  OPEN_ORDER: 'waiting',
  IN_DELIVERY: 'warning',
  DELIVERY_SUCCESS: 'current',
  COMPANY_CANCEL_ORDER: 'error',
};
export const statusHistoryBGColorCredit = {
  REJECT_ORDER: 'rgba(255, 93, 93, 0.16)',
  WAIT_APPROVE_ORDER: 'rgba(255, 136, 36, 0.16)',
  WAIT_CONFIRM_ORDER: 'rgba(244, 191, 0, 0.16)',
  CONFIRM_ORDER: 'rgba(76, 149, 255, 0.16)',
  SHOPAPP_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
  OPEN_ORDER: 'rgba(255, 136, 36, 0.16)',
  IN_DELIVERY: 'rgba(244, 191, 0, 0.16)',
  DELIVERY_SUCCESS: 'rgba(58, 174, 73, 0.16)',
  COMPANY_CANCEL_ORDER: 'rgba(255, 93, 93, 0.16)',
};

export const STATUS_ORDER = {
  DELIVERY_SUCCESS: 'DELIVERY_SUCCESS',
  IN_DELIVERY: 'IN_DELIVERY',
  WAIT_APPROVE_ORDER: 'WAIT_APPROVE_ORDER',
  WAIT_CONFIRM_ORDER: 'WAIT_CONFIRM_ORDER',
  CONFIRM_ORDER: 'CONFIRM_ORDER',
  OPEN_ORDER: 'OPEN_ORDER',
  REJECT_ORDER: 'REJECT_ORDER',
  SHOPAPP_CANCEL_ORDER: 'SHOPAPP_CANCEL_ORDER',
  COMPANY_CANCEL_ORDER: 'COMPANY_CANCEL_ORDER',
  SALE_CANCEL_ORDER: 'SALE_CANCEL_ORDER',
};

export const companyFullName = (company: string) => ({
  ICPL: 'บริษัท ไอ ซี พี ลัดดา จำกัด',
  ICPF: 'บริษัท ไอ ซี พี เฟอทิไลเซอร์ จำกัด',
  ICPI: 'บริษัท ไอ ซี พี อินเตอร์เนชั่นแนล จำกัด',
  MGT: 'บริษัท เอ็ม จี ที แพลนท์โกรท จำกัด',
});

export const promotionTypeMap = (promotionType: string) => {
  switch (promotionType) {
    case 'FREEBIES_MIX':
      return 'ของแถมแบบคละ';
    case 'FREEBIES_NOT_MIX':
      return 'ของแถมแบบไม่คละ';
    case 'DISCOUNT_MIX':
      return 'ส่วนลดแบบคละ';
    case 'DISCOUNT_NOT_MIX':
      return 'ส่วนลดแบบไม่คละ';
    case 'OTHER':
      return 'อื่นๆ';
  }
};
