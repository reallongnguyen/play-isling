export interface Collection<T> {
  edges: T[]
  offset: number
  limit: number
  total: number
}
