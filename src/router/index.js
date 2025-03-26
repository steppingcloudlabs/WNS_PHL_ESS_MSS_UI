import { createRouter, createWebHistory } from "vue-router";

import ViewOnly from "../view/ViewOnly.vue";
import Editable from "../view/Editable.vue";    
import Approval from "../view/Approval.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'view',
        component: ViewOnly,
      },
      {
        path:"/edit",
        name:"edit",
        component:Editable,
      },

      {
        path:"/approve",
        name:"approve",
        component:Approval,
      }
      
    ],
  })

  export default router