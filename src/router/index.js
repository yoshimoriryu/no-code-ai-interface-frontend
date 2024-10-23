import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import RetrainModel from '../views/RetrainModel.vue'
import UploadTrainingData from '@/views/addproject/UploadTrainingData.vue'
import DataSplit from '@/views/addproject/DataSplit.vue'
import BuildModel from '@/views/addproject/BuildModel.vue'
// import BuildModel from '../views/BuildModel.vue'
// import TestingModel from '../views/TestingModel.vue'
// import ApiManagement from '../views/ApiManagement.vue'
// import AnomalyDetection from '../views/AnomalyDetection.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/retrain-model',
    name: 'RetrainModel',
    component: RetrainModel
  },
  {
    path: '/upload-training-data',
    name: 'UploadTrainingData',
    component: UploadTrainingData
  },
  {
    path: '/data-split',
    name: 'DataSplit',
    component: DataSplit
  },
  {
    path: '/build-model',
    name: 'BuildModel',
    component: BuildModel
  },
  // {
  //   path: '/retrain-model/add',
  //   name: 'AddProject',
  //   component: AddProject
  // },
  // {
  //   path: '/build-model',
  //   name: 'BuildModel',
  //   component: BuildModel
  // },
  // {
  //   path: '/testing-model',
  //   name: 'TestingModel',
  //   component: TestingModel
  // },
  // {
  //   path: '/api-management',
  //   name: 'ApiManagement',
  //   component: ApiManagement
  // },
  // {
  //   path: '/anomaly-detection',
  //   name: 'AnomalyDetection',
  //   component: AnomalyDetection
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router