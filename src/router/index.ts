import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NotFound from '../views/404.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
  {
    path: '/',
    name: 'home',
    meta: {
      keepAlive: true // 设置页面是否需要使用缓存
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  // {
  //   path: '/404',
  //   name: '404',
  //   component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
  // },
  {
    path: '/setting',
    name: 'setting',
    component: () => import(/* webpackChunkName: "setting" */ '../views/Setting.vue'),
    meta: {
      redirectToLogin: true
    }
  },
  {
    path: '/createBlog',
    name: 'createBlog',
    component: () => import(/* webpackChunkName: "createBlog" */ '../views/CreateBlog.vue'),
    meta: {
      redirectToLogin: true
    }
  },
  {
    path: '/follow',
    name: 'follow',
    component: () => import(/* webpackChunkName: "follow" */ '../views/Follow.vue'),
    meta: {
      redirectToLogin: true
    }
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
    meta: {
      // redirectToLogin: true,
      keepAlive: true
    }
  },
  {
    path: '/fans/:id',
    name: 'fans',
    component: () => import(/* webpackChunkName: "fans" */ '../views/Fans.vue'),
    meta: {
      redirectToLogin: true,
      keepAlive: true
    }
  },
  {
    path: '/me',
    name: 'me',
    component: () => import(/* webpackChunkName: "me" */ '../views/Me.vue'),
    meta: {
      redirectToLogin: true,
      keepAlive: true
    }
  },
  {
    path: '/follower/:id',
    name: 'follower',
    component: () => import(/* webpackChunkName: "follower" */ '../views/Follower.vue'),
    meta: {
      redirectToLogin: true,
      keepAlive: true
    }
  },
  {
    path: '/error',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '../views/error.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const { redirectToLogin } = to.meta
  const isLogin = JSON.parse(localStorage.getItem('isLogin') as string)
  if (!isLogin && redirectToLogin) {
    next({
      name: 'login',
      query: {
        from: to.path
      }
    })
  } else if (to.name === 'profile' && (to.params.id === 'undefined') && !isLogin) {
    next({
      name: 'login',
      query: {
        from: to.path
      }
    })
  } else {
    next()
  }
})

export default router
