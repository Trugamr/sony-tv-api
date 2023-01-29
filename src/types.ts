export type SonyTvApiOptions = {
  psk?: string
  host: string | URL
}

type Result<T> = {
  result: T
  id: number
}

export type GetJsonBodyOptions = {
  id?: number
  method:
    | 'getCurrentTime'
    | 'getPowerStatus'
    | 'setPowerStatus'
    | 'getRemoteControllerInfo'
  version?: string
  params?: unknown[]
}

export type GetCurrentTimeResult = Result<[string]>

// @TODO: Find out values for "status"
export type GetPowerStatusResult = Result<[{ status: 'active' | 'standby' }]>

export type SetPowerStatusOptions = {
  status: boolean
}

export type SetPowerStatusResult = Result<[]>

export type GetRemoteControllerInfoResult = Result<
  [{ bundled: boolean; type: string }, Array<{ name: string; value: string }>]
>
