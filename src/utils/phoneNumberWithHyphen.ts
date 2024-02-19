export const phoneNumberWithHyphen = (phoneNumber: string) => {
  const regExp = /^\d{3}-\d{3,4}-\d{4}$/;
  if (regExp.test(phoneNumber)) {
    return phoneNumber;
  }
  const number = phoneNumber.replace(/[^0-9]/g, '');
  let formatNumber = '';
  if (number.length < 4) {
    return number;
  }
  if (number.length < 7) {
    formatNumber = `${number.slice(0, 3)}-${number.slice(3)}`;
  } else if (number.length < 11) {
    formatNumber = `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(
      6,
    )}`;
  } else {
    formatNumber = `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(
      7,
    )}`;
  }
  return formatNumber;
};
