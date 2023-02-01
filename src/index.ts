import { Headers, ofetch } from 'ofetch'
import type { $Fetch } from 'ofetch'
import {
  SonyTvApiOptions,
  GetCurrentTimeResult,
  GetJsonBodyOptions,
  GetPowerStatusResult,
  SetPowerStatusResult,
  GetRemoteControllerInfoResult,
  GetIrccXmlBodyOptions,
  IrccCommandOrCode,
  IrccCommand,
  GetApplicationListResult,
  SetActiveAppOptions,
  SetActiveAppResult,
  GetVolumeInformationResult,
  SetAudioMuteResult,
} from './types'
import { IRCC_CODE_REGEX } from './constants'

// @TODO: Better error handling

export class SonyTvApi {
  #id = 1
  #psk?: string
  #client: $Fetch

  constructor({ psk, host }: SonyTvApiOptions) {
    this.#psk = psk
    this.#client = ofetch.create({
      baseURL: host,
      onRequest: ({ options }) => {
        options.headers = new Headers(options.headers)
        if (this.#psk) {
          options.headers.set('X-AUTH-PSK', this.#psk)
        }
      },
    })
  }

  getCurrentTime() {
    return this.#client<GetCurrentTimeResult>('/sony/system', {
      method: 'POST',
      body: this.#getJsonBody({ method: 'getCurrentTime' }),
    })
  }

  getPowerStatus() {
    return this.#client<GetPowerStatusResult>('/sony/system', {
      method: 'POST',
      body: this.#getJsonBody({ method: 'getPowerStatus' }),
    })
  }

  setPowerStatus(status: boolean) {
    return this.#client<SetPowerStatusResult>('/sony/system', {
      method: 'POST',
      body: this.#getJsonBody({
        method: 'setPowerStatus',
        params: [{ status }],
      }),
    })
  }

  getRemoteControllerInfo() {
    return this.#client<GetRemoteControllerInfoResult>('/sony/system', {
      method: 'POST',
      body: this.#getJsonBody({ method: 'getRemoteControllerInfo' }),
    })
  }

  async sendIrccCommand(command: IrccCommandOrCode) {
    const code = await this.#getCodeFromIrccCommand(command)
    // @TODO: Fix response error even if ircc command works
    return this.#client('/sony/ircc', {
      method: 'POST',
      headers: {
        SOAPACTION: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
      },
      body: this.#getIrccXmlBody({ code }),
    })
  }

  getApplicationList() {
    return this.#client<GetApplicationListResult>('/sony/appControl', {
      method: 'POST',
      body: this.#getJsonBody({ method: 'getApplicationList' }),
    })
  }

  setActiveApp(options: SetActiveAppOptions) {
    return this.#client<SetActiveAppResult>('/sony/appControl', {
      method: 'POST',
      body: this.#getJsonBody({ method: 'setActiveApp', params: [options] }),
    })
  }

  getVolumeInformation() {
    return this.#client<GetVolumeInformationResult>('/sony/audio', {
      method: 'POST',
      body: this.#getJsonBody({ method: 'getVolumeInformation' }),
    })
  }

  setAudioMute(status: boolean) {
    return this.#client<SetAudioMuteResult>('/sony/audio', {
      method: 'POST',
      body: this.#getJsonBody({ method: 'setAudioMute', params: [{ status }] }),
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
    // If named command present in enum return code for it
    if (this.#isIrccCommand(value)) {
      return IrccCommand[value]
    }
    // Early test is provided value is close to an IRCC code to avoid making an api call
    if (IRCC_CODE_REGEX.test(value)) {
      return value
    }
    // Try to find command using remote controller info method
    const {
      result: [, commands],
    } = await this.getRemoteControllerInfo()

    const command = commands.find(command => command.name === value)
    if (command) {
      return command.value
    }

    return value
  }
}
