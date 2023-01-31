export type SonyTvApiOptions = {
  psk?: string
  host: string
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
    | 'getApplicationList'
    | 'setActiveApp'
  version?: string
  params?: unknown[]
}

export type GetIrccXmlBodyOptions = {
  code: string
}

export type GetCurrentTimeResult = Result<[string]>

// @TODO: Find out values for "status"
export type GetPowerStatusResult = Result<[{ status: 'active' | 'standby' }]>

export type SetPowerStatusResult = Result<[]>

export type GetRemoteControllerInfoResult = Result<
  [{ bundled: boolean; type: string }, Array<{ name: string; value: string }>]
>

export enum IrccCommand {
  Home = 'AAAAAQAAAAEAAABgAw==',
  Return = 'AAAAAgAAAJcAAAAjAw==',
  Num1 = 'AAAAAQAAAAEAAAAAAw==',
  Num2 = 'AAAAAQAAAAEAAAABAw==',
  Num3 = 'AAAAAQAAAAEAAAACAw==',
  Num4 = 'AAAAAQAAAAEAAAADAw==',
  Num5 = 'AAAAAQAAAAEAAAAEAw==',
  Num6 = 'AAAAAQAAAAEAAAAFAw==',
  Num7 = 'AAAAAQAAAAEAAAAGAw==',
  Num8 = 'AAAAAQAAAAEAAAAHAw==',
  Num9 = 'AAAAAQAAAAEAAAAIAw==',
  Num0 = 'AAAAAQAAAAEAAAAJAw==',
  DOT = 'AAAAAgAAAJcAAAAdAw==',
  VolumeUp = 'AAAAAQAAAAEAAAASAw==',
  VolumeDown = 'AAAAAQAAAAEAAAATAw==',
  Mute = 'AAAAAQAAAAEAAAAUAw==',
  TvPower = 'AAAAAQAAAAEAAAAVAw==',
  EPG = 'AAAAAgAAAKQAAABbAw==',
  Confirm = 'AAAAAQAAAAEAAABlAw==',
  ChannelUp = 'AAAAAQAAAAEAAAAQAw==',
  ChannelDown = 'AAAAAQAAAAEAAAARAw==',
  Up = 'AAAAAQAAAAEAAAB0Aw==',
  Down = 'AAAAAQAAAAEAAAB1Aw==',
  Left = 'AAAAAQAAAAEAAAA0Aw==',
  Right = 'AAAAAQAAAAEAAAAzAw==',
  Display = 'AAAAAQAAAAEAAAA6Aw==',
  SubTitle = 'AAAAAgAAAJcAAAAoAw==',
  Audio = 'AAAAAQAAAAEAAAAXAw==',
  MediaAudioTrack = 'AAAAAQAAAAEAAAAXAw==',
  Jump = 'AAAAAQAAAAEAAAA7Aw==',
  Exit = 'AAAAAQAAAAEAAABjAw==',
  Tv = 'AAAAAQAAAAEAAAAkAw==',
  Input = 'AAAAAQAAAAEAAAAlAw==',
  TvInput = 'AAAAAQAAAAEAAAAlAw==',
  Red = 'AAAAAgAAAJcAAAAlAw==',
  Green = 'AAAAAgAAAJcAAAAmAw==',
  Yellow = 'AAAAAgAAAJcAAAAnAw==',
  Blue = 'AAAAAgAAAJcAAAAkAw==',
  Teletext = 'AAAAAQAAAAEAAAA/Aw==',
  Stop = 'AAAAAgAAAJcAAAAYAw==',
  Rewind = 'AAAAAgAAAJcAAAAbAw==',
  Forward = 'AAAAAgAAAJcAAAAcAw==',
  Prev = 'AAAAAgAAAJcAAAA8Aw==',
  Next = 'AAAAAgAAAJcAAAA9Aw==',
  Play = 'AAAAAgAAAJcAAAAaAw==',
  Rec = 'AAAAAgAAAJcAAAAgAw==',
  Pause = 'AAAAAgAAAJcAAAAZAw==',
  OneTouchView = 'AAAAAgAAABoAAABlAw==',
  GooglePlay = 'AAAAAgAAAMQAAABGAw==',
  Netflix = 'AAAAAgAAABoAAAB8Aw==',
  PartnerApp6 = 'AAAAAwAACB8AAAAFAw==',
  PartnerApp5 = 'AAAAAwAACB8AAAAEAw==',
  YouTube = 'AAAAAgAAAMQAAABHAw==',
  PartnerApp9 = 'AAAAAwAACB8AAAAIAw==',
  PartnerApp7 = 'AAAAAwAACB8AAAAGAw==',
  ActionMenu = 'AAAAAgAAAMQAAABLAw==',
  ApplicationLauncher = 'AAAAAgAAAMQAAAAqAw==',
  Help = 'AAAAAgAAAMQAAABNAw==',
  ShopRemoteControlForcedDynamic = 'AAAAAgAAAJcAAABqAw==',
  WakeUp = 'AAAAAQAAAAEAAAAuAw==',
  PowerOff = 'AAAAAQAAAAEAAAAvAw==',
  Sleep = 'AAAAAQAAAAEAAAAvAw==',
  Hdmi1 = 'AAAAAgAAABoAAABaAw==',
  Hdmi2 = 'AAAAAgAAABoAAABbAw==',
  Hdmi3 = 'AAAAAgAAABoAAABcAw==',
  DemoMode = 'AAAAAgAAAJcAAAB8Aw==',
}

// eslint-disable-next-line @typescript-eslint/ban-types
type AnyString = string & {}

export type IrccCommandOrCode =
  | IrccCommand
  | keyof typeof IrccCommand
  | AnyString

export type GetApplicationListResult = Result<
  [Array<{ title: string; uri: string; icon: string }>]
>

export type SetActiveAppOptions = {
  uri: string
  data?: string
}

export type SetActiveAppResult = Result<[]>
