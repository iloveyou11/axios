import { AxiosRequestConfig, AxiosResponse, AxiosPromise, Method, ResolvedFn, RejectedFn } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from '../core/InterceptorManager'
import mergeConfig from '../core/mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(defaultConfig: AxiosRequestConfig) {
    this.defaults = defaultConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }


  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    config = mergeConfig(this.defaults, config)

    // 拦截器的链式调用
    const chain: PromiseChain[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  // 不需要传递data
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('delete', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('head', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('options', url, config)
  }
  // 需要传递data（data可选）
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('post', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('patch', url, data, config)
  }

  _requestWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }


  _requestWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
