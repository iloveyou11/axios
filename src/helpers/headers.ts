import { isPlainObject, deepMerge } from './util'
import { Method } from '../types';


function normalize(headers: any, name: string): void {
  if (!headers) return
  Object.keys(headers).forEach(key => {
    if (key !== name && key.toUpperCase() === name.toUpperCase()) {
      headers[name] = headers[key]
      delete headers[key]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalize(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  let obj = Object.create(null)
  if (!headers) return obj
  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    if (value) value = value.trim()
    obj[key] = value
  })
  return obj
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) return headers
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['get', 'post', 'delete', 'put', 'head', 'options', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}
