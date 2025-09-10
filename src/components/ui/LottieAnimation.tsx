'use client'

import { useEffect, useRef } from 'react'
import Lottie from 'lottie-react'

interface LottieAnimationProps {
  animationData: any
  width?: number | string
  height?: number | string
  loop?: boolean
  autoplay?: boolean
  speed?: number
  className?: string
}

export function LottieAnimation({
  animationData,
  width = 100,
  height = 100,
  loop = true,
  autoplay = true,
  speed = 1,
  className = ''
}: LottieAnimationProps) {
  return (
    <div className={className} style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
