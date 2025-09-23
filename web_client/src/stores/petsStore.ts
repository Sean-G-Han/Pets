import { defineStore } from 'pinia'
import type { Pet } from '../types/pets'

export const usePetsStore = defineStore('pets', {
  state: () => ({
    pets: [] as Pet[],
  }),

  getters: {
    getPets: (state): Pet[] => state.pets,
  },

  actions: {
    setPets(pets: Pet[]) {
      this.pets = pets
    },
    addPet(pet: Pet) {
      this.pets.push(pet)
    },
  },
})
