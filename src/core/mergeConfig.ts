import { AxiosRequestConfig } from '../types'
export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
  if (!config2) return config1

  let config = Object.create(null)


}
