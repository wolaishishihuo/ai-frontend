import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    redirect: '/chat'
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/index.vue'),
    redirect: '/chat-content',
    children: [
      {
        path: '',
        name: 'chat-content',
        component: () => import('@/views/chat/ChatContent.vue'),
        meta: {
          title: '聊天'
        }
      },
      {
        path: ':id',
        name: 'chat-detail',
        component: () => import('@/views/chat/ChatDetail.vue'),
        props: true,
        meta: {
          title: '对话详情',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/not-found/index.vue'),
    meta: {
      title: '页面未找到'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn;

  if (to.path === '/login') {
    if (isLoggedIn) {
      userStore.resetUserStore();
    }
    next();
  }
  else if (to.name === 'not-found') {
    next();
  }
  else if (!isLoggedIn) {
    next({ path: '/login', replace: true });
  }
  else {
    next();
  }
});

export default router;
