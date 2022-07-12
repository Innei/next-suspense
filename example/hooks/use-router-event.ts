import { Router } from 'next/router'
import QProgress from 'qier-progress'
import { useEffect } from 'react'

export const useRouterEvent = () => {
  useEffect(() => {
    const Progress = new QProgress({ colorful: false, color: '#27ae60' })

    Router.events.on('routeChangeStart', () => {
      Progress.start()
    })

    Router.events.on('routeChangeComplete', () => {
      Progress.finish()
    })

    Router.events.on('routeChangeError', () => {
      Progress.finish()
    })
  }, [])
}
