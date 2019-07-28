const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 判断是否为广义的js对象
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

// 判断是否为普通的JSON对象，不包括 `FormData`、`ArrayBuffer` 这些类型
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
// `extend` 的最终目的是把 `from` 里的属性都扩展到 `to` 中，包括原型上的属性。
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ; (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 采用递归的方法实现对象的深度合并（深拷贝）
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
