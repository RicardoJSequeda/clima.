declare module 'react-animated-weather' {
  import { Component } from 'react'

  interface ReactAnimatedWeatherProps {
    icon: string
    color: string
    size: number
    animate: boolean
  }

  export default class ReactAnimatedWeather extends Component<ReactAnimatedWeatherProps> {}
}
