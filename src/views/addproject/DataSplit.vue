<template>
  <div class="container mx-auto my-10">
    <!-- Progress bar and title -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Add Project: 2. Data Split</h2>
      <p class="text-gray-600">Please split the data into two parts: training data and validation data.</p>
    </div>

    <DataSampler v-show="showDataSampler" />

    <!-- Data Split section -->
    <div class="mb-8">
      <label class="block text-gray-700 font-semibold mb-2" for="data-split">Data Split *</label>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full" style="width: 80%;"></div>
      </div>
      <div class="flex justify-between text-sm text-gray-500 mt-1">
        <span>Training Data: 80%</span>
        <span>Validation Data: 20%</span>
      </div>
    </div>

          <!-- <label class="block mb-2">Upload Training Data*</label>
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-blue-50"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @click="$refs.fileInput.click()"
          >
            <div class="flex flex-col items-center">
              <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
              <p>Drag and Drop or Select File (CSV)</p>
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept=".csv"
                @change="handleFileSelect"
              />
            </div>
          </div> -->
    <!-- Preview Data section -->
    <div class="mb-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>

          <label class="block text-gray-700 font-semibold mb-2">Training Data</label>
          <div class="flex items-center space-x-2">
            <span class="text-gray-700">{{ trainingDataFileName }}</span>
            <button class="text-blue-600" @click="openTrainingDataFilePicker">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input type="file" ref="trainingDataFileInput" @change="handleTrainingDataFileChange" accept=".csv" class="hidden" />
          </div>

        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Validation Data</label>
          <div class="flex items-center space-x-2">
            <span class="text-gray-700">{{ validationDataFilename }}</span>
            <button class="text-blue-600" @click="openValidationDataFilePicker">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input type="file" ref="validationDataFileInput" @change="handleValidationDataFileChange" accept=".csv" class="hidden" />
          </div>
        </div>
      </div>
    </div>

    <!-- Save and Next Buttons -->
    <div class="flex justify-between">
      <button class="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700" @click="uploadAllData">Save</button>
      <button class="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700">Next</button>
      <!-- <button
        class="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700"
        @click="$router.push('/build-model')" 
      >
        next >>
      </button> -->
    </div>
  </div>
</template>

<script>
import DataSampler from '@/components/DataSampler.vue';

export default {
  name: 'DataSplit',
  components: {
    DataSampler,
  },
  computed: {
    validationDataFilename() {
      return this.validationDataFile ? this.validationDataFile.name : 'No validation file selected';
    },
    trainingDataFileName() {
      return this.trainingDataFile ? this.trainingDataFile.name : 'No training file selected';
    },
  },
  data() {
    return {
      showDataSampler: false,
      trainingDataFile: null,
      validationDataFile: null,
    }
  },
  methods: {
    openTrainingDataFilePicker() {
      this.$refs.trainingDataFileInput.click();
    },
    openValidationDataFilePicker() {
      this.$refs.validationDataFileInput.click();
    },
    handleTrainingDataFileChange(event) {
      this.trainingDataFile = event.target.files[0];
      this.message = '';
    },
    handleValidationDataFileChange(event) {
      this.validationDataFile = event.target.files[0];
      this.message = '';
    },
  }
};
</script>
