import axios, { AxiosRequestConfig } from 'axios'
import { transformError } from '../../models/api-response'

const apiURL = process.env.NEXT_PUBLIC_API_URL || ''

export const fetcher = {
  get: (url: string, config?: AxiosRequestConfig<any>) =>
    axios
      .get(url, config)
      .then((res) => res.data.data)
      .catch((err) => transformError(err)),
  delete: (url: string, config?: AxiosRequestConfig<any>) =>
    axios
      .delete(url, config)
      .then((res) => res.data.data)
      .catch((err) => transformError(err)),
  post: (url: string, data: any, config?: AxiosRequestConfig<any>) =>
    axios
      .post(url, data, config)
      .then((res) => res.data.data)
      .catch((err) => transformError(err)),
  put: (url: string, data: any, config?: AxiosRequestConfig<any>) =>
    axios
      .put(url, data, config)
      .then((res) => res.data.data)
      .catch((err) => transformError(err)),
  patch: (url: string, data: any, config?: AxiosRequestConfig<any>) =>
    axios
      .patch(url, data, config)
      .then((res) => res.data.data)
      .catch((err) => transformError(err)),
}

export const buildApiURL = (path: string) => {
  let sep = ''

  if (!path.startsWith('/')) {
    sep = '/'
  }

  return apiURL + sep + path
}
