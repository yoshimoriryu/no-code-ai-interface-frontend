<template>
  <div id="app" class="flex flex-col min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-center">No-Code Data Science Tool</h1>
      </div>
    </header>

    <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <ul class="flex space-x-4">
          <li>
            <router-link to="/" class="text-white hover:text-gray-300">Home</router-link>
          </li>
          <li>
            <router-link to="/data-sampler" class="text-white hover:text-gray-300">Data Sampler</router-link>
          </li>
          <li>
            <router-link to="/model-list" class="text-white hover:text-gray-300">Model List</router-link>
          </li>
          <li>
            <router-link to="/model-inference" class="text-white hover:text-gray-300">Model Inference</router-link>
          </li>
          <!-- Uncomment the line below if needed -->
          <!-- <li>
            <router-link to="/train-model" class="text-white hover:text-gray-300">Train Model</router-link>
          </li> -->
        </ul>
      </div>
    </nav>

    <main class="flex-grow">
      <router-view /> <!-- This will render your routed components -->
    </main>
  </div>
</template>


<script>
export default {
  components: {},
  data() {
    return {
      selectedFile: null,
    };
  },
};
</script>

<style>
nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 15px;
}
</style>
