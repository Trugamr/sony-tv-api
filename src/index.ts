import ky from 'ky-universal'
import type { KyInstance } from 'ky/distribution/types/ky'
import type {
  SonyTvApiOptions,
  GetCurrentTimeResult,
  GetJsonBodyOptions,
  GetPowerStatusResult,
  SetPowerStatusOptions,
  SetPowerStatusResult,
  GetRemoteControllerInfoResult,
} from './types'

// @TODO: Make method to build json bodies to call methods

export class SonyTvApi {
  #id = 1
  #psk?: string
  #client: KyInstance

  constructor({ psk, host }: SonyTvApiOptions) {
    this.#psk = psk
    this.#client = ky.create({
      prefixUrl: host,
      hooks: {
        beforeRequest: [
          request => {
            // Add pre shared key to headers before every request
            if (this.#psk) {
              request.headers.set('X-AUTH-PSK', this.#psk)
            }
            return request
          },
        ],
      },
    })
  }

  async getCurrentTime() {
    const json = this.#getJsonBody({ method: 'getCurrentTime' })
    return this.#client
      .post('sony/system', { json })
      .json<GetCurrentTimeResult>()
  }

  async getPowerStatus() {
    const json = this.#getJsonBody({ method: 'getPowerStatus' })
    return this.#client
      .post('sony/system', { json })
      .json<GetPowerStatusResult>()
  }

  async setPowerStatus({ status }: SetPowerStatusOptions) {
    const json = this.#getJsonBody({
      method: 'setPowerStatus',
      params: [{ status }],
    })
    return this.#client
      .post('sony/system', { json })
      .json<SetPowerStatusResult>()
  }

  async getRemoteControllerInfo() {
    const json = this.#getJsonBody({ method: 'getRemoteControllerInfo' })
    return this.#client
      .post('sony/system', { json })
      .json<GetRemoteControllerInfoResult>()
  }

  #getJsonBody({
    id = this.#id,
    method,
    version = '1.0',
    params = [''],
  }: GetJsonBodyOptions) {
    return { id, method, version, params }
  }
}
