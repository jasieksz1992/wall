export type SiteNavigationItem = {
  label: string
  href: string
}

export type SiteLink = {
  label: string
  href: string
}

export type SiteStat = {
  value: string
  label: string
}

export type SiteCard = {
  title: string
  description: string
  icon: string
  image?: string
}

export type ProcessStep = {
  title: string
  description: string
  image: string
}

export type Realization = {
  title: string
  description: string
  image: string
}

export type FeatureSection = {
  eyebrow: string
  title: string
  description: string
  image: string
  features: string[]
  cta?: SiteLink
}

export type FooterColumn = {
  title: string
  links: SiteLink[]
}

export type SiteConfig = {
  brand: {
    name: string
    claim: string
    logoText: string
    primaryColor: string
  }
  seo: {
    title: string
    description: string
  }
  navigation: SiteNavigationItem[]
  hero: {
    eyebrow: string
    title: string
    highlight: string
    description: string
    primaryCta: SiteLink
    secondaryCta: SiteLink
    image: string
    stats: SiteStat[]
    trustBadges: string[]
  }
  benefits: SiteCard[]
  processSteps: ProcessStep[]
  systemsSection: FeatureSection
  aiSection: FeatureSection
  realizations: Realization[]
  interiorSection: FeatureSection
  finalCta: {
    title: string
    description: string
    cta: SiteLink
  }
  footer: {
    description: string
    columns: FooterColumn[]
    social: SiteLink[]
  }
  contact: {
    phone: string
    email: string
    address: string
  }
  auth: {
    googleEnabled: boolean
  }
}
