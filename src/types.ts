export type SonyTvApiOptions = {
  host: string | URL
}

type Result<T> = {
  result: T
  id: number
}

export type GetCurrentTimeResult = Result<[string]>

// @TODO: Find out values for "status"
export type GetPowerStatusResult = Result<[{ status: 'active' | 'standby' }]>
