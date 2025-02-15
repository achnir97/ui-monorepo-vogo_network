import { DeepPartial } from "ts-essentials"

import { DefaultThemeConfig } from "../Defaults/ThemeConfig"
import { IComponentOverrides } from "../Overrides"
import { mergeDeep } from "../utils/deepMerge"
import { IBreakpoints } from "./CreateBreakpoints"

interface IPaletteColor {
  background?: string
  main: string
  active?: string
  border?: string
  hover?: string
  [key: string]: string | undefined
}

interface IPalette {
  primary: IPaletteColor
  common: {
    black: IPaletteColor
    white: IPaletteColor
    [key: string]: IPaletteColor | string
  }
  secondary: IPaletteColor
  error: IPaletteColor
  warning: IPaletteColor
  info?: IPaletteColor
  success: IPaletteColor
  additional: {
    [key: string]: {
      [key: number]: string
    }
  }
  text: {
    primary: string
    secondary?: string
  }
  background: {
    paper: string
    default: string
    [key: string]: string
  }
}

interface IFontWeights {
  light: number
  regular: number
  medium: number
  semibold: number
  bold: number
}

interface ITypography {
  global: Record<string, any>
  fontWeight: IFontWeights
  h1?: Record<string, any>
  h2?: Record<string, any>
  h3?: Record<string, any>
  h4?: Record<string, any>
  h5?: Record<string, any>
  h6?: Record<string, any>
  subtitle1?: Record<string, any>
  subtitle2?: Record<string, any>
  body1?: Record<string, any>
  body2?: Record<string, any>
  button?: Record<string, any>
  caption?: Record<string, any>
  [key: string]: Record<string, any> | undefined
}

interface IConstants {
  generalUnit: number
  modal: Record<string, any>
  icon: Record<string, any>
  [key: string]: number | string | Record<string, any> | undefined
}

interface IAnimation {
  transform: 200
  translate: 400
  [key: string]: any
}

interface IShadows {
  shadow1: string
  shadow2: string
  [key: string]: string
}

interface IThemeConfig<IConstantTypes = IConstants> {
  animation: IAnimation
  breakpoints: IBreakpoints
  constants: IConstantTypes
  palette: IPalette
  typography: ITypography
  misc?: any
  zIndex?: {
    background: number
    layer0: number
    layer1: number
    layer2: number
    layer3: number
    layer4: number
    blocker: number
    [key: string]: number
  }
  shadows: IShadows
  cssBaseline?: Record<string, any>
  globalStyling?: Record<string, any>
  overrides?: IComponentOverrides
}

const createThemeConfig = <IConstantTypes>(themeConfig?: DeepPartial<IThemeConfig<IConstantTypes>>): IThemeConfig<IConstantTypes> => {
  // No conversion or mapping needed for now
  return {
    ...(mergeDeep(
      DefaultThemeConfig,
      themeConfig as IThemeConfig<IConstantTypes>
    ) as IThemeConfig<IConstantTypes>)
  }
}

export default createThemeConfig

export {
  IThemeConfig,
  IPalette,
  IPaletteColor,
  ITypography,
  IBreakpoints,
  IConstants,
  IAnimation,
  IFontWeights
}
