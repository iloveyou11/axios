import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from '../xhr'
import { bulidURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'
import transform from '../core/transform'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  // 因为我们处理 `header` 的时候依赖了 `data`，所以要在处理请求 `body` 数据之前处理请求 `header`
  config.data = transform(config.data, config.headers, config.transformRequest)
  // config.headers = transformHeaders(config)
  // config.data = transformRequestDate(config)
  config.headers = flattenHeaders(config.headers, config.method!)  // !表示类型断言，表示此属性一定存在
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url = '', params } = config
  return bulidURL(url, params)
}
// function transformRequestDate(config: AxiosRequestConfig): any {
//   return transformRequest(config.data)
// }
// function transformHeaders(config: AxiosRequestConfig) {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }
function transformResponseData(res: AxiosResponse): AxiosResponse {
  // res.data = transformResponse(res.data)
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

export default axios
