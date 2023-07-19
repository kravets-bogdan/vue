import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../components/WeahterApp.vue"),
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: () => import("../components/FavoritesPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
