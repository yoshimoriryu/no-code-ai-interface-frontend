<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-blue-700 text-white p-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <div class="text-xl font-bold">Transaction Anomaly Detection System</div>
      </div>
      <div class="flex items-center space-x-2">
        <i class="fas fa-user"></i>
        <span>User</span>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg h-screen">
        <nav class="p-4">
          <ul class="space-y-2">
            <li class="p-2 hover:bg-gray-100 rounded">Dashboard</li>
            <li class="p-2 bg-blue-600 text-white rounded">Retrain Model</li>
            <li class="p-2 hover:bg-gray-100 rounded">Build Model</li>
            <li class="p-2 hover:bg-gray-100 rounded">Testing Model</li>
            <li class="p-2 hover:bg-gray-100 rounded">API Model Management</li>
            <li class="p-2 hover:bg-gray-100 rounded">Anomaly Detection</li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold">Project List</h1>
          <button class="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2">
            <span>+</span>
            <span>Add Project</span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-6 relative">
          <input
            type="text"
            placeholder="Search"
            v-model="searchQuery"
            class="w-64 pl-10 pr-4 py-2 border rounded-lg"
          />
          <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
        </div>

        <!-- Project Table -->
        <div class="bg-white rounded-lg shadow overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50 text-left">
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Project Name</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Model ID</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Algorithm</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Hyperparameter</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Performance</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Training Data</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Validation Data</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Model</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Creation Date</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(project, index) in projects" :key="index">
                <td class="px-6 py-4">{{ project.name }}</td>
                <td class="px-6 py-4">{{ project.modelId }}</td>
                <td class="px-6 py-4">{{ project.algorithm }}</td>
                <td class="px-6 py-4 whitespace-pre">{{ project.hyperparameter }}</td>
                <td class="px-6 py-4">
                  <template v-if="project.performance.buildProgress">
                    <div class="w-full bg-gray-200 rounded">
                      <div
                        class="bg-blue-600 text-xs text-blue-100 text-center p-0.5 leading-none rounded"
                        :style="{ width: project.performance.buildProgress + '%' }"
                      >
                        {{ project.performance.buildProgress }}%
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="space-y-1">
                      <div>Accuracy: {{ project.performance.accuracy }}%</div>
                      <div>Precision: {{ project.performance.precision }}%</div>
                      <div>Recall: {{ project.performance.recall }}%</div>
                    </div>
                  </template>
                </td>
                <td class="px-6 py-4">
                  <i class="fas fa-download text-blue-600 cursor-pointer"></i>
                </td>
                <td class="px-6 py-4">
                  <i class="fas fa-download text-blue-600 cursor-pointer"></i>
                </td>
                <td class="px-6 py-4">
                  <i class="fas fa-download text-blue-600 cursor-pointer"></i>
                </td>
                <td class="px-6 py-4">{{ project.creationDate }}</td>
                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <i class="fas fa-edit text-blue-600 cursor-pointer"></i>
                    <i class="fas fa-trash text-red-600 cursor-pointer"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectManagement',
  data() {
    return {
      searchQuery: '',
      projects: [
        {
          name: 'Project A',
          modelId: 'Model_1',
          algorithm: 'Random Forest',
          hyperparameter: 'max_depth: 10\nn_estimators: 90',
          performance: {
            accuracy: 92,
            precision: 90,
            recall: 87
          },
          creationDate: '04/10/2024'
        },
        {
          name: 'Project B',
          modelId: 'Model_2',
          algorithm: 'SVM',
          hyperparameter: 'kernel: rbf\ndegree: 3',
          performance: {
            buildProgress: 40
          },
          creationDate: '01/09/2024'
        }
      ]
    }
  }
}
</script>
