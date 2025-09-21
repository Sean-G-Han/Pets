import type { Pet } from './pets'

enum PetSprite {
  'monster_a' = './public/Sprite-0001.gif',
  'monster_b' = './public/Sprite-0002.gif',
}

export class PetAnimation {
  static getSprite(arg: string | Pet): string {
    if (typeof arg === 'string') {
      return PetSprite[arg as keyof typeof PetSprite] || ''
    } else {
      return PetSprite[arg.species_name as keyof typeof PetSprite] || ''
    }
  }
}
