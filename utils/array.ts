import { isObject } from '@utils/type';

enum ORDER {
  AESC = 'AESC',
  DESC = 'DESC'
}

const getVal = (val, field) => {
      return field ? val[field] : val;
}

const sortBy = (array, order: ORDER, field: string) => {
  const res = array.sort((a, b) => {
    let first;
    let seconde;
    if (order === ORDER.AESC) { first = a; seconde = b }
    if (order === ORDER.DESC) { first = b; seconde = a}

    return getVal(first, field) - getVal(seconde, field);
  })

  return res;
}

const get = (data, path) => {
  const pathArr = path.split('.');

  return pathArr.reduce((_value, _path) => _value[_path], data)
}

const set = (data, path, value) => {
  const pathArr = path.split('.');
  const lastPos = pathArr.length - 1;

  pathArr.reduce((_value, _path, index) => {
    if (!isObject(_value)) {
      _value = {}
    } 

    if(index === lastPos) {
      _value[_path] = value;
    } else {
      return _value[_path]; 
    }
  }, data) 

  return data;
}

const uniqBy = (data, key) => {
  const map = new Map();
  const res = [];
  
  data.forEach((item, index) => {
    const _val = item[key];
    if(!map.has(_val)) {
        map.set(_val, true);
        res.push(item); 
    }
  })

  return res;
}

export {
  sortBy,
  ORDER,
  uniqBy,
}