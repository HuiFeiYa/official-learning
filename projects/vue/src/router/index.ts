import { createRouter, createWebHistory } from 'vue-router'
import ElkView from '@/elk/01.vue'
import View2 from '@/elk/02.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: "/",
        redirect: { path: '/elk/view1' }
    },
    {
      path: '/elk/view1',
      name: 'elk-view1',
      component: ElkView
    },
    {
      path: '/elk/view2',
      name: 'view2',
      component: View2
    }   
  ]
})

export default router
