
interface Obj {
  [key: string]: any
}
const obj2Arr = (obj: Obj) => {
  const res = [];

  for (let key in obj) {
    res.push(obj[key])
  }

  return res;
}

export {
  obj2Arr
}