import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import CardsView from "@views/CardsView.vue";
import CollectionView from "@views/CollectionView.vue";
import DecksView from "@views/DecksView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Cards",
    component: CardsView,
  },
  {
    path: "/collection",
    name: "Collection",
    component: CollectionView,
  },
  {
    path: "/decks",
    name: "Decks",
    component: DecksView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
