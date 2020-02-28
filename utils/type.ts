enum DATA_TYPE {
  DATE = 'Date',
  OBJECT = 'Object',
  ARRAY = 'Array',
  NUMBER = 'Number',
  STRING = 'String',
}

const _toString = Object.prototype.toString

function toRawType(data: any) {

  return _toString.call(data).slice(8, -1);
}

function isString(data) {
  const type = toRawType(data);

  return type === DATA_TYPE.STRING;
}

function isNumber(data) {
  const type = toRawType(data);

  return type === DATA_TYPE.NUMBER;
}

function isDate(data) {
  const type = toRawType(data);

  return type === DATA_TYPE.DATE;
}

function isObject(data) {
  const type = toRawType(data);

  return type === DATA_TYPE.OBJECT
}

function isArray(data) {
  const type = toRawType(data);

  return type === DATA_TYPE.ARRAY
}

export  {
  isDate,
  isString,
  isNumber,
  isArray,
  isObject,
}
