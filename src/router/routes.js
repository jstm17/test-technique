import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticateStore } from 'stores/authenticate-store.js'

const routes = [
  {
    path: '/:lang?',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: 'Home' },
        name: 'home',
      },
      // Ajout de ? pour afficher la page Search sans quartier sélectionné
      {
        path: 'search/:search?',
        component: () => import('pages/SearchPage.vue'),
        meta: { title: 'Search' },
        name: 'search',
      },
      {
        path: 'favorites',
        component: () => import('pages/FavoritesPage.vue'),
        meta: { title: 'Favorites' },
        name: 'favorites',
        beforeEnter: (to, from, next) => {
          const { isAuthenticated, openAuthModal } = useAuthenticateStore()
          // J'ai inversé le contenu du if avec celui du else pour bloquer l'accès à cette page si l'utilisateur n'est pas connecté et supprimer l'ouverture de la modal si l'utilisateur est déjà connecté.
          if (!isAuthenticated) {
            next({ name: 'home', params: { lang: to.params.lang } })
            openAuthModal()
          } else {
            next()
          }
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { title: '404' },
    name: 'notFound',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Mise à jour du titre après chaque navigation
router.afterEach((to) => {
  // Récupérer le titre à partir des métadonnées de la route
  const title = to.meta.title || 'Mon Application' // Utiliser un titre par défaut si aucune donnée n'est définie
  const searchTerm = to.params.search ? `: ${to.params.search}` : '' // Ajouter le terme de recherche s'il est présent

  // Mettre à jour le titre de la page
  document.title = `Mon Application${searchTerm} - ${title}`
})

export default routes
