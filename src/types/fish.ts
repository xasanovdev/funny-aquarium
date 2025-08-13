export type Gender = 'male' | 'female'

export interface IFish {
  id: number
  gender: Gender
  x: number
  y: number
  lifespan: number
  alive: boolean
  size: number
}
