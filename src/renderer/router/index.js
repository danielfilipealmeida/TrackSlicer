import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-menu',
      component: require('@/components/MainMenu').default
    },
    {
      path: '/new',
      name: 'new',
      component: require('@/components/New').default
    },
    {
      path: '/open',
      name: 'open',
      component: require('@/components/Open').default
    },
    {
      path: '/project',
      name: 'project',
      component: require('@/components/Project').default
    },
    {
      path: '/landing-page',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
