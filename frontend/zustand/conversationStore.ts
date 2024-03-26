// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'

// type ConversationStore = {
  
// }

// const useFishStore = create(
//   persist(
//     (set, get) => ({
//       fishes: 0,
//       addAFish: () => set({ fishes: get().fishes + 1 }),
//     }),
//     {
//       name: 'food-storage', // name of the item in the storage (must be unique)
//       storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
//     },
//   ),
// )
