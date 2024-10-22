import { createRouter, createWebHistory } from 'vue-router';
import DataSampler from '../components/DataSampler.vue'; // Adjust the path to your component
import HomePage from '../pages/HomePage.vue'; // Example of a home component
import ModelList from '../components/ModelList.vue';
import ModelInference from '../components/ModelInference.vue'
import HomePage2 from '../views/HomePage2.vue';
// import TrainModel from '../components/TrainModel.vue'; // Import TrainModel component

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Home Page' }
  },
  {
    path: '/home',
    name: 'Home2',
    component: HomePage2,
    meta: { title: 'Home Page 2' }
  },
  {
    path: '/data-sampler',
    name: 'DataSampler',
    component: DataSampler,
    meta: { title: 'Data Sampler' }
  },
  {
    path: '/model-list',
    name: 'ModelList',
    component: ModelList,
  },
  {
    path: '/model-inference',
    name: 'ModelInference',
    component: ModelInference,
  },
  // {
  //   path: '/train-model', // New route for TrainModel
  //   name: 'TrainModel',
  //   component: TrainModel,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const title = to.meta.title || 'Default Title'; // Fallback to a default title
  document.title = title;
  next();
});

export default router;
