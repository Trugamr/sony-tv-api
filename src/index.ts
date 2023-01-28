import ky from 'ky-universal'
import type { KyInstance } from 'ky/distribution/types/ky'
import type {
  GetCurrentTimeResult,
  GetPowerStatusResult,
  SonyTvApiOptions,
} from './types'

// @TODO: Make method to build json bodies to call methods

export class SonyTvApi {
  #id = 1
  #client: KyInstance

  constructor(options: SonyTvApiOptions) {
    this.#client = ky.create({
      prefixUrl: options.host,
    })
  }

  async getCurrentTime() {
    return this.#client
      .post('sony/system', {
        json: {
          id: this.#id,
          method: 'getCurrentTime',
          version: '1.0',
          params: [''],
        },
      })
      .json<GetCurrentTimeResult>()
  }

  async getPowerStatus() {
    return this.#client
      .post('sony/system', {
        json: {
          id: this.#id,
          method: 'getPowerStatus',
          version: '1.0',
          params: [''],
        },
      })
      .json<GetPowerStatusResult>()
  }
}
