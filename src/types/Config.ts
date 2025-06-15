export const TeusKey = {
  isFirstVisit: 'isFirstVisit',
} as const

interface TeusConfig {
  id: number
  first_visit: boolean
}

export interface TeusConfigSchema extends Partial<TeusConfig> {}
