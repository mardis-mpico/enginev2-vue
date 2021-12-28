import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/Login",
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("../components/Navigatios/Login.vue"),
  },
  {
    path: "/Home",
    meta: { requiresAuth: true },
    component: () => import("../views/Home.vue"),
    children: [
      {
        path: "DashBoard",
        component: () => import("../components/Navigatios/Dashboard.vue"),
      },
      {
        path: "DashBoard/Pollsters",
        component: () => import("../components/Navigatios/Dashboard/Pollsters.vue"),
      },
      {
        path: "DashBoard/Branch",
        component: () => import("../components/Navigatios/Dashboard/Branch.vue"),
      },
      {
        path: "Campaign",
        component: () => import("../components/Navigatios/Campaigns.vue"),
      },
      {
        path: "Client",
        component: () => import("../components/Navigatios/BodegaCentral.vue"),
      },
      {
        path: "CargaBodega",
        component: () => import("../components/Navigatios/CargaBodega.vue"),
      },
      {
        path: "Branch",
        component: () => import("../components/Navigatios/Branches.vue"),
      },
      {
        path: "Task",
        component: () => import("../components/Navigatios/Task.vue"),
      },
      {
        path: "Foco",
        component: () => import("../components/Navigatios/Foco.vue"),
      },
      {
        path: "Loteria",
        component: () => import("../components/Navigatios/Loteria.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.path !== "/Home"){
    store.state.showHomeContent = false;
  }else{
    store.state.showHomeContent = true;
  }
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isLogged = store.state.auth.isLogged;
  console.log(from.path + "  " + to.path + "  " + requiresAuth + "  " +  isLogged);
  if (!requiresAuth && isLogged && to.path === "/Login") {
    if (from.path === "/") {
      next("/Home");
    } else {
      next(from.path);
    }
  } else if (requiresAuth && !isLogged) {
    next("/Login");
  } else if (to.path === from.path) {
    console.log("recarga");
  } else {
    next();
  }
});

export default router;
