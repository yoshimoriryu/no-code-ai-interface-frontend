<template>
  <div class="container mx-auto my-10">
    <!-- Title and tabs -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Add Project: 3. Build Model</h2>
    </div>

    <!-- Form for selecting model and hyperparameters -->
    <div class="mb-8">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="model-id">Model ID</label>
          <input 
            id="model-id" 
            type="text" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Model ID" 
            disabled 
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="algorithm">Select Algorithm</label>
          <select 
            id="algorithm" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="random_forest">Random Forest</option>
            <!-- Add more options here -->
          </select>
        </div>

        <!-- Hyperparameters -->
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="n_estimators">n_estimators</label>
          <input 
            id="n_estimators" 
            type="number" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value="100" 
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="max_depth">max_depth</label>
          <input 
            id="max_depth" 
            type="number" 
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value="10" 
          />
        </div>
      </div>
    </div>

    <!-- Build button -->
    <div class="mb-8">
      <button 
        class="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700"
      >
        Build
      </button>
    </div>

    <!-- Result section -->
    <div class="my-8">
      <h3 class="text-xl font-semibold mb-4">RESULT</h3>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3 text-center">
        <div>
          <h4 class="text-4xl font-bold text-blue-600">91%</h4>
          <p class="text-gray-700">Accuracy</p>
        </div>
        <div>
          <h4 class="text-4xl font-bold text-blue-600">90%</h4>
          <p class="text-gray-700">Precision</p>
        </div>
        <div>
          <h4 class="text-4xl font-bold text-blue-600">87%</h4>
          <p class="text-gray-700">Recall</p>
        </div>
      </div>
    </div>

    <!-- Confusion matrix section -->
    <div class="my-8">
      <h3 class="text-xl font-semibold mb-4">CONFUSION MATRIX</h3>
      <div class="grid grid-cols-2 gap-2 text-center border border-gray-300 rounded-lg">
        <div class="bg-blue-600 text-white py-4">Predicted Anomaly</div>
        <div class="bg-red-600 text-white py-4">Predicted Normal</div>
        <div class="bg-gray-100 py-4">Actual Anomaly</div>
        <div class="bg-gray-100 py-4">Actual Normal</div>
        <div class="bg-blue-200 text-2xl font-bold py-4">870</div>
        <div class="bg-red-200 text-2xl font-bold py-4">130</div>
        <div class="bg-blue-200 text-2xl font-bold py-4">97</div>
        <div class="bg-red-200 text-2xl font-bold py-4">3680</div>
      </div>
    </div>

    <!-- Save Model button -->
    <div class="mb-8">
      <button 
        class="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700"
      >
        Save Model
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuildModel',
};
</script>
