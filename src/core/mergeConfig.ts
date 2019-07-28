import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) return config1

  let config = Object.create(null)  // 合并的结果


  // 创建策略函数map
  const strats = Object.create(null)
  const stratKeysFromVal2 = ['url', 'params', 'data']
  stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat
  })
  const stratKeysDeepMerge = ['headers']
  stratKeysDeepMerge.forEach(key => {
    strats[key] = deepMergeStrat
  })


  // 合并策略函数
  // 默认属性合并策略，2覆盖1
  function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1
  }

  // 只取2中的值，对于一些属性如 `url`、`params`、`data`，合并策略如下
  function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
      return val2
    }
  }

  // 复杂对象的合并策略
  function deepMergeStrat(val1: any, val2: any): any {
    if (isPlainObject(val2)) {
      return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
      return val2
    } else if (isPlainObject(val1)) {
      return deepMerge(val1)
    } else if (typeof val1 !== 'undefined') {
      return val1
    }
  }



  // 使用定义好的合并策略进行合并
  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }
  for (let key in config2) {
    mergeField(key)
  }
  for (let key in config1) {
    if (!config2[key]) mergeField(key)
  }

  return config
}


