import defaultConfig from '@/public/site-config.json'
import { SiteConfig } from '@/types/site-config'

export const localConfigKey = 'wall-site-config'
export const siteConfig = defaultConfig as SiteConfig

export function readLocalConfig(): SiteConfig {
  if (typeof window === 'undefined') {
    return siteConfig
  }

  const savedConfig = window.localStorage.getItem(localConfigKey)

  if (!savedConfig) {
    return siteConfig
  }

  return JSON.parse(savedConfig) as SiteConfig
}

export function saveLocalConfig(config: SiteConfig) {
  window.localStorage.setItem(localConfigKey, JSON.stringify(config, null, 2))
}

export function clearLocalConfig() {
  window.localStorage.removeItem(localConfigKey)
}
