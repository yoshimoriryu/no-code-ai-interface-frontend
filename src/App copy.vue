<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-blue-700 text-white p-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8" /> <!-- Make sure to add your logo -->
        <div class="text-xl font-bold">Transaction Anomaly Detection System</div>
      </div>
      <div class="flex items-center space-x-2">
        <i class="fas fa-user"></i>
        <span>User</span>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg min-h-screen">
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <router-link 
                to="/" 
                class="p-2 flex items-center space-x-2 rounded hover:bg-gray-100"
                :class="{ 'bg-blue-600 text-white hover:bg-blue-700': $route.path === '/' }"
              >
                <i class="fas fa-th-large w-5"></i>
                <span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/retrain-model" 
                class="p-2 flex items-center space-x-2 rounded hover:bg-gray-100"
                :class="{ 'bg-blue-600 text-white hover:bg-blue-700': $route.path.includes('/retrain-model') }"
              >
                <i class="fas fa-sync-alt w-5"></i>
                <span>Retrain Model</span>
              </router-link>
            </li>
            <!-- <li>
              <router-link 
                to="/build-model" 
                class="p-2 flex items-center space-x-2 rounded hover:bg-gray-100"
                :class="{ 'bg-blue-600 text-white hover:bg-blue-700': $route.path.includes('/build-model') }"
              >
                <i class="fas fa-wrench w-5"></i>
                <span>Build Model</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/testing-model" 
                class="p-2 flex items-center space-x-2 rounded hover:bg-gray-100"
                :class="{ 'bg-blue-600 text-white hover:bg-blue-700': $route.path.includes('/testing-model') }"
              >
                <i class="fas fa-vial w-5"></i>
                <span>Testing Model</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/api-management" 
                class="p-2 flex items-center space-x-2 rounded hover:bg-gray-100"
                :class="{ 'bg-blue-600 text-white hover:bg-blue-700': $route.path.includes('/api-management') }"
              >
                <i class="fas fa-cogs w-5"></i>
                <span>API Model Management</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/anomaly-detection" 
                class="p-2 flex items-center space-x-2 rounded hover:bg-gray-100"
                :class="{ 'bg-blue-600 text-white hover:bg-blue-700': $route.path.includes('/anomaly-detection') }"
              >
                <i class="fas fa-chart-line w-5"></i>
                <span>Anomaly Detection</span>
              </router-link>
            </li> -->
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>