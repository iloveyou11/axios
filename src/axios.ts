import { AxiosStatic, AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaultConfig from './default'
import mergeConfig from './core/mergeConfig'
import defaults from './default'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaultConfig)
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
