export type Gender = 'male' | 'female'

export interface IFish {
  id: number
  gender: Gender
  lifespan: number
  alive: boolean
  size: number
  isLoved: boolean
  lovedBy: number[]
  coords: IFishCoords
}

export interface IFishCoords {
  x: number
  y: number
}

export interface IFishLovedCoords {
  x: number
  y: number
  femaleId: number
  maleId: number
}
