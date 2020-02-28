/**
 * @param {number} num 原始数据
 * @param {number} precision 精度
 * @return {number}
 */
export function round(num, precision) {
  const res = Math.round(+(num + 'e' + precision)) / Math.pow(10, precision);

  return res;
}

