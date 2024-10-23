<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
        ML App
      </h1>
      
      <nav class="bg-white shadow-sm rounded-lg p-4 mb-8">
        <div class="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <router-link 
            to="/upload-csv"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors
                   hover:bg-blue-50 hover:text-blue-700
                   text-gray-700 text-center
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Upload File
          </router-link>
          
          <router-link 
            to="/data-sampler"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors
                   hover:bg-blue-50 hover:text-blue-700
                   text-gray-700 text-center
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Data Sampler
          </router-link>
          
          <router-link 
            to="/model-list"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors
                   hover:bg-blue-50 hover:text-blue-700
                   text-gray-700 text-center
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Model List
          </router-link>
        </div>
      </nav>

      <main class="bg-white shadow-sm rounded-lg p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
/* Add these styles if you want to customize the active route */
.router-link-active {
  @apply bg-blue-50 text-blue-700;
}
</style>