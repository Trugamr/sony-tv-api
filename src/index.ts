import ky from 'ky-universal'
import type { KyInstance } from 'ky/distribution/types/ky'
import {
  SonyTvApiOptions,
  GetCurrentTimeResult,
  GetJsonBodyOptions,
  GetPowerStatusResult,
  SetPowerStatusOptions,
  SetPowerStatusResult,
  GetRemoteControllerInfoResult,
  GetIrccXmlBodyOptions,
  IrccCommandOrCode,
  IrccCommand,
} from './types'
import { IRCC_CODE_REGEX } from './constants'

// @TODO: Better error handling

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

  async sendIrccCommand(command: IrccCommandOrCode) {
    const code = await this.#getCodeFromIrccCommand(command)
    const xml = this.#getIrccXmlBody({ code })
    // @TODO: Fix response error even if ircc command works
    return this.#client.post('sony/ircc', {
      headers: {
        SOAPACTION: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
      },
      body: xml,
    })
  }

  #getJsonBody({
    id = this.#id,
    method,
    version = '1.0',
    params = [''],
  }: GetJsonBodyOptions) {
    return { id, method, version, params }
  }

  #getIrccXmlBody({ code }: GetIrccXmlBodyOptions) {
    return `<?xml version="1.0"?>
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
            <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
                <IRCCCode>${code}</IRCCCode>
            </u:X_SendIRCC>
        </s:Body>
    </s:Envelope>`
  }

  #isIrccCommand(value: string): value is keyof typeof IrccCommand {
    return value in IrccCommand
  }

  async #getCodeFromIrccCommand(value: IrccCommandOrCode): Promise<string> {
    if (this.#isIrccCommand(value)) {
      return IrccCommand[value]
    }
    // Early test is provided value is close to an IRCC code to avoid making an api call
    if (IRCC_CODE_REGEX.test(value)) {
      return value
    }
    // @TODO: Get commands from api and try to find code for specified command
    return value
  }
}
