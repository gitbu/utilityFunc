import { isArray, isObject } from './type';

const isEmpty = (data) => {
  if (data === null) return true;

  if (isArray(data)) return data.length < 1;

  if (isObject(data)) return Object.keys(data).length < 1;

  return !!data;
}

const decimalDigit = (num: number) => {
  const strNum = "" + num;
  const [integer, decimal] = strNum.split('.')

  return decimal ? decimal.length : 0
}

const isDecimal = (num: number) => {
  return !!decimalDigit(num);
}

export {
  isEmpty,
  isDecimal
}