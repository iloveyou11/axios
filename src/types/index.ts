import axios from "../axios";
import { Interface } from "readline";
import { transformRequest } from "../helpers/data";

export type Method = 'get' | 'GET'
  | 'delete' | 'Delete'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType //`"" | "arraybuffer" | "blob" | "document" | "json" | "text"` 字符串字面量类型
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken


  [propName: string]: any //通过 `config2[key]` 这种索引的方式访问，所以需要给 `AxiosRequestConfig` 的接口定义添加一个字符串索引签名
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

// 自定义错误类
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response: AxiosResponse
  isAxiosError: boolean
}

// 接口扩展
export interface Axios {
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
}

export interface ResponseData<T=any> {
  code: number
  result: T
  message: string
}

// 拦截器
export interface ResolvedFn<T=any> {
  (val: T): T | Promise<T>
}
export interface RejectedFn {
  (error: any): any
}
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}


// CancelToken接口
export interface AxiosTransformer {
  (data: any, headers?: any): any
}



// 取消请求的接口设计
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new(executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new(message?: string): Cancel
}

