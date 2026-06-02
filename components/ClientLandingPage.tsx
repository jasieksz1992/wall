'use client'

import { useEffect, useState } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { readLocalConfig, siteConfig } from '@/lib/site-config'
import { SiteConfig } from '@/types/site-config'

export function ClientLandingPage() {
  const [config, setConfig] = useState<SiteConfig>(siteConfig)

  useEffect(() => {
    setConfig(readLocalConfig())
  }, [])

  return <LandingPage config={config} />
}
