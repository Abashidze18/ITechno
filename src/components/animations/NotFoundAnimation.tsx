'use client'

import Lottie from 'lottie-react'
import cameraAnimation from '@/assets/animations/camera_404.json'

export default function NotFoundAnimation() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <Lottie
        animationData={cameraAnimation}
        loop={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
