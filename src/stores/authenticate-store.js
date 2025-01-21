import { defineStore } from 'pinia'
import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'top',
  timeout: 4000,
})

export const useAuthenticateStore = defineStore('authenticate', {
  state: () => ({
    user: null,
    authModal: false,
    favorites: [],
  }),
  getters: {
    isAuthenticated() {
      return this.user !== null
    },
  },
  actions: {
    // Fonction pour charger les datas du Local storage
    loadLocalStorageData() {
      const username = localStorage.getItem('auth-username')

      if (username) {
        this.user = JSON.parse(username)
      }
    },

    async authenticateUser(user) {
      // J'ai remplacé ! par =
      if (user.username === process.env.USERNAME_APP && user.password === process.env.PASSWORD) {
        this.user = user
        Notify.create({
          color: 'positive',
          message: 'You are now logged in!',
        })
        localStorage.setItem('auth-username', JSON.stringify(user))
        return user
      } else {
        Notify.create({
          color: 'negative',
          message: 'Invalid username or password!',
        })
        return null
      }
    },
    async logoutUser() {
      this.user = null
      Notify.create({
        color: 'positive',
        message: 'You are now logged out!',
      })
      localStorage.removeItem('auth-username')
    },
    openAuthModal() {
      this.authModal = !this.authModal
    },
    addToFavorites(favorite) {
      // Check if the favorite already exists
      const existingFavorite = this.favorites.find((f) => f.id === favorite.id)
      if (existingFavorite) {
        Notify.create({
          color: 'negative',
          message: 'This favorite already exists!',
        })
        return false
      } else {
        this.favorites.push(favorite)
        Notify.create({
          color: 'positive',
          message: 'Favorite added!',
        })
      }
    },
    removeFromFavorites(favorite) {
      // J'ai enlevé le .id car la méthode reçoit déja un ID et non un objet
      console.log(this.favorites);
      console.log(favorite.id);
      this.favorites = this.favorites.filter((f) => f.id !== favorite)
      Notify.create({
        color: 'positive',
        message: 'Favorite removed!',
      })
    },
  },
})
