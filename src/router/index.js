import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/play'
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue'),
    beforeEnter:(to,from,next) =>{
      if(store.getters['auth/authenticated']){
        return next({
          name:'Play'
        })
      }
      next()
    }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    beforeEnter:(to,from,next) =>{
      if(store.getters['auth/authenticated']){
        return next({
          name:'Play'
        })
      }
      next()
    }
  },
  {
    path: '/play',
    name: 'Play',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Play.vue'),
    beforeEnter:(to,from,next) =>{
      if(!store.getters['auth/authenticated']){
        return next({
          name:'Login'
        })
      }
      next()
    }

  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Leaderboard.vue'),
    beforeEnter:(to,from,next) =>{
      if(!store.getters['auth/authenticated']){
        return next({
          name:'Login'
        })
      }
      next()
    }

  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
