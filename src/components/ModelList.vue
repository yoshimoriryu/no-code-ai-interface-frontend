<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6">Saved Models</h2>
    
    <!-- Create New Model Button -->
    <div class="flex justify-end space-x-4 mb-6">
      <button @click="showModal = true" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create New Model
      </button>
      <button @click="showUploadModal = true" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Upload Model
      </button>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithm</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hyperparameters</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model File</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F1 Score</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="model in models" :key="model.id">
            <td class="px-6 py-4">{{ model.name }}</td>
            <td class="px-6 py-4">{{ model.config.filename }}</td>
            <td class="px-6 py-4">{{ model.algorithm.name }}</td>
            <td class="px-6 py-4" v-html="formatHyperparameters(model.hyperparameters)"></td>
            <td class="px-6 py-4">{{ model.model_file }}</td>
            <td class="px-6 py-4">{{ model.accuracy }}</td>
            <td class="px-6 py-4">{{ model.f1_score }}</td>
            <td class="px-6 py-4">{{ model.status }}</td>
            <td class="px-6 py-4 text-sm font-medium">
              <button @click="deleteModel(model.id)" class="text-red-600 hover:text-red-900 mr-2">Delete</button>
              <button @click="downloadModel(model.id)" class="text-blue-600 hover:text-blue-900 mr-2">Download</button>
              <button @click="trainModel(model.id)" class="text-green-600 hover:text-green-900 mr-2">Train</button>
              <button @click="showUpdateModal(model)" class="text-indigo-600 hover:text-indigo-900">Update</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create New Model Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold mb-4">Create New Model</h3>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Model Name:</label>
          <input type="text" v-model="newModel.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-4">
          <label for="algorithm-select" class="block text-sm font-medium text-gray-700 mb-1">
            Algorithm:
          </label>
          <div class="relative">
            <select
              id="algorithm-select"
              v-model="selectedAlgorithm"
              @change="updateAlgorithm"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option v-for="algorithm in algorithms" :key="algorithm.id" :value="algorithm">
                {{ algorithm.name }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Select Data Split Config:</label>
          <div class="relative">
            <select v-model="newModel.config_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option v-for="config in dataSplitConfigs" :key="config.id" :value="config.id">
                {{ config.filename }} (Train Size: {{ config.train_size }}; Seed: {{ config.random_seed }}; Missing: {{ config.missing_data_strategy }}) 
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Select Hyperparameters:</label>
          <select v-model="selectedHyperparameter" @change="addHyperparameterField" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option v-for="param in hyperparametersOptions" :key="param" :value="param">
              {{ param }}
            </option>
          </select>
        </div>

        <!-- Generated Form for Hyperparameters -->
        <div v-for="(value, param) in hyperparameterValues" :key="param" class="mb-4">
          <label :for="param" class="block text-gray-700 text-sm font-bold mb-2">{{ param }}:</label>
          <div class="flex">
            <input type="text" :id="param" v-model="hyperparameterValues[param]" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <button @click="removeHyperparameterField(param)" class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">×</button>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="createModel" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
          <button @click="createAndTrainModel" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save & Train</button>
          <button @click="showModal = false" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Upload Model Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold mb-4">Upload Model</h3>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Model Name:</label>
          <input type="text" v-model="uploadedModel.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Model File:</label>
          <input type="file" @change="handleFileUpload" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="uploadModel" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Upload</button>
          <button @click="showUploadModal = false" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Update Model Modal -->
    <div v-if="showUpdateModalFlag" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold mb-4">Update Model</h3>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Model Name:</label>
          <input type="text" v-model="updateModel.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Algorithm:</label>
          <p class="mb-2">{{ updateModel.algorithm.name }}</p>
          <select v-model="updateModel.algorithm_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option v-for="algorithm in algorithms" :key="algorithm.id" :value="algorithm.id">
              {{ algorithm.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Select Data Split Config:</label>
          <p class="mb-2">{{ updateModel.config.filename }} (Train Size: {{ updateModel.config.train_size }}; Seed: {{ updateModel.config.random_seed }}; Missing: {{ updateModel.config.missing_data_strategy }})</p>
          <select v-model="updateModel.config_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option v-for="config in dataSplitConfigs" :key="config.id" :value="config.id">
              {{ config.filename }} (Train Size: {{ config.train_size }}; Seed: {{ config.random_seed }}; Missing: {{ config.missing_data_strategy }})
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Hyperparameters:</label>
          <div v-for="(value, param) in updateModel.hyperparameters" :key="param" class="mb-2">
            <label :for="param" class="block text-gray-700 text-sm font-bold mb-2">{{ param }}:</label>
            <input type="text" :id="param" v-model="updateModel.hyperparameters[param]" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Accuracy:</label>
          <input type="number" v-model="updateModel.accuracy" step="0.01" min="0" max="1" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">F1 Score:</label>
          <input type="number" v-model="updateModel.f1_score" step="0.01" min="0" max="1" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Status:</label>
          <input type="text" v-model="updateModel.status" readonly class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Model File:</label>
          <input type="text" v-model="updateModel.model_file" readonly class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100" />
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="updateModelAction" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update</button>
          <button @click="showUpdateModalFlag = false" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      models: [],
      algorithms: [],
      dataSplitConfigs: [],
      showModal: false,
      showUploadModal: false, // Show/hide upload modal
      newModel: {
        name: '',
        algorithm: null,
        algorithm_id: null,
        config_id: null,
        hyperparameters: {},
      },
      uploadedModel: {
        name: '', // Holds the name of the uploaded model
        file: null, // Holds the uploaded model file
      },
      selectedHyperparameter: '',
      hyperparametersOptions: [],
      hyperparameterValues: {},
      showUpdateModalFlag: false,
      updateModel: {
        id: null,
        name: '',
        algorithm_id: null,
        config_id: null,
        hyperparameters: {},
        accuracy: null,
        f1_score: null,
        model_file: null,
        status: null,
      },
      selectedAlgorithm: null,
    };
  },
  created() {
    this.fetchAlgorithms();
    this.fetchDataSplitConfigs();
    this.fetchModels();
  },
  methods: {
    updateAlgorithm() {
      const selectedAlgorithm = this.selectedAlgorithm;
      if (selectedAlgorithm) {
        this.newModel.algorithm = selectedAlgorithm;
        this.newModel.algorithm_id = selectedAlgorithm.id;
      } else {
        this.newModel.algorithm = {};
        this.newModel.algorithm_id = null;
      }
      this.fetchHyperparameters();
    },
    async fetchModels() {
      try {
        const response = await fetch('http://localhost:8000/all-models/');
        if (!response.ok) throw new Error('Failed to fetch models');
        this.models = await response.json();
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    },
    async fetchAlgorithms() {
      try {
        const response = await fetch('http://localhost:8000/all-algorithms/');
        if (!response.ok) throw new Error('Failed to fetch algorithms');
        const algorithms = await response.json();
        this.algorithms = algorithms;
      } catch (error) {
        console.error('Error fetching algorithms:', error);
      }
    },
    async fetchDataSplitConfigs() {
      try {
        const configResponse = await fetch('http://localhost:8000/data-split-configs/');
        this.dataSplitConfigs = await configResponse.json();
      } catch (error) {
        console.error('Error fetching data split configs:', error);
      }
    },
    fetchHyperparameters() {
      if (this.newModel.algorithm) {
        const selectedAlgorithm = this.newModel.algorithm;
        this.hyperparametersOptions = Object.keys(JSON.parse(selectedAlgorithm.hyperparameters));
        this.hyperparameterValues = {};
      }
    },
    formatHyperparameters(hyperparams) {
      if (typeof hyperparams === 'string') {
        try {
          hyperparams = JSON.parse(hyperparams);
        } catch (e) {
          return 'Invalid JSON';
        }
      }
      if (!hyperparams || typeof hyperparams !== 'object') return 'N/A';
      return Object.entries(hyperparams)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>');
    },
    addHyperparameterField() {
      if (this.selectedHyperparameter && !this.hyperparameterValues[this.selectedHyperparameter]) {
        this.hyperparameterValues[this.selectedHyperparameter] = '';
      }
    },
    removeHyperparameterField(param) {
      delete this.hyperparameterValues[param];
    },
    async createModel() {
      this.newModel.hyperparameters = { ...this.hyperparameterValues };
      this.newModel.algorithm.id = parseInt(this.newModel.algorithm_id);
      console.log(this.newModel)
      try {
        const response = await fetch('http://localhost:8000/create-model/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newModel),
        });
        console.log(JSON.stringify(this.newModel))
        if (!response.ok) throw new Error('Failed to create model');

        this.newModel = { name: '', algorithm: null, config_id: null, hyperparameters: {} };
        this.hyperparameterValues = {};
        this.showModal = false;
        this.fetchModels();
      } catch (error) {
        console.error('Error creating model:', error);
      }
    },
    async uploadModel() {
      const formData = new FormData();
      formData.append('name', this.uploadedModel.name);
      formData.append('model_file', this.uploadedModel.file);

      try {
        const response = await fetch('http://localhost:8000/upload-model/', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload model');
        this.uploadedModel = { name: '', file: null };
        this.showUploadModal = false;
        this.fetchModels();
      } catch (error) {
        console.error('Error uploading model:', error);
      }
    },
    handleFileUpload(event) {
      this.uploadedModel.file = event.target.files[0];
    },
    async trainModel(modelId, configId) {
      console.log(modelId)
      console.log(configId)
      if (!configId) {
        const response = await fetch(`http://localhost:8000/models/${modelId}`, {
          method: 'GET',
        });
        const tobeTrainedModel = await response.json()
        console.log(tobeTrainedModel)
        const fetchedModelId = tobeTrainedModel.id
        const fetchedConfigId = tobeTrainedModel.config_id
        console.log(fetchedModelId)
        console.log(fetchedConfigId)
        await fetch(`http://localhost:8000/train-model/?model_id=${fetchedModelId}&config_id=${fetchedConfigId}`, {
            method: 'POST',
          });
      } else {
        await fetch(`http://localhost:8000/train-model/?model_id=${modelId}&config_id=${configId}`, {
            method: 'POST',
          });
      }
    },
    async createAndTrainModel() {
      // Combine newModel hyperparameters with filled-in hyperparameter values
      this.newModel.hyperparameters = { ...this.hyperparameterValues };
      this.newModel.algorithm.id = parseInt(this.newModel.algorithm_id)
      console.log(JSON.stringify(this.newModel))

      try {
        const response = await fetch('http://localhost:8000/create-model/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newModel),
        });
        if (!response.ok) throw new Error('Failed to create model');

        const data = await response.json();
        const newModelId = data.id;
        await this.trainModel(newModelId, this.newModel.config_id)

        // Reset
        this.newModel = { name: '', algorithm: null, config_id: null, hyperparameters: {} };
        this.hyperparameterValues = {};

        this.showModal = false;
        this.fetchModels();
      } catch (error) {
        console.error('Error creating or training model:', error);
      }
    },
    async deleteModel(modelId) {
      const confirmed = confirm("Are you sure you want to delete this model?");
      if (confirmed) {
        try {
          const response = await fetch(`http://localhost:8000/delete-model/${modelId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            this.models = this.models.filter(model => model.id !== modelId);
            alert("Model deleted successfully.");
            this.fetchModels();
          } else {
            alert("Failed to delete model.");
          }
        } catch (error) {
          console.error('Error deleting model:', error);
        }
      }
    },
    async downloadModel(modelId) {
      try {
        const model_info = await fetch(`http://localhost:8000/models/${modelId}`, {
          method: 'GET',
        });
        const tobeDownloadedModel = await model_info.json()

        const response = await fetch(`http://localhost:8000/download-model/${modelId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to download model');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Set filename for download
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = tobeDownloadedModel.model_file;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch.length === 2) {
            filename = filenameMatch[1];
          }
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading model:', error);
      }
    },
    // showUpdateModal(model) {
    //   this.updateModel = { ...model };
    //   console.log(this.updateModel)
    //   this.updateModel.hyperparameters = JSON.parse(model.hyperparameters)
    //   this.showUpdateModalFlag = true;
    // },
    showUpdateModal(model) {
      this.updateModel = JSON.parse(JSON.stringify(model));
      if (typeof this.updateModel.hyperparameters === 'string') {
        try {
          this.updateModel.hyperparameters = JSON.parse(this.updateModel.hyperparameters);
        } catch (error) {
          console.error('Error parsing hyperparameters:', error);
          this.updateModel.hyperparameters = {};
        }
      }
      console.log(this.updateModel);
      this.showUpdateModalFlag = true;
    },
    async updateModelAction() {
      const sendUpdateModel = JSON.parse(JSON.stringify(this.updateModel))
      delete sendUpdateModel.algorithm
      delete sendUpdateModel.config
      try {
        const response = await fetch(`http://localhost:8000/update-model/${this.updateModel.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sendUpdateModel),
        });

        if (!response.ok) throw new Error('Failed to update model');

        this.showUpdateModalFlag = false;
        this.fetchModels();
        alert('Model updated successfully');
      } catch (error) {
        console.error('Error updating model:', error);
        alert('Failed to update model');
      }
    },
  },
  // computed: {
  //   selectedConfig () {
  //     const selectedConf = this.dataSplitConfigs.find(config => config.id === this.updateModel.config_id);
  //     return selectedConf
  //   }
  // }
};
</script>
<!-- 
<style scoped>

/* General Body Styles */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f9f9f9;
}

/* Modal Styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensures the modal is above other content */
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px; /* Maximum width for the modal */
}

/* Table Styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff; /* White background for table */
}

th, td {
  border: 1px solid #ddd;
  padding: 12px; /* Increased padding for better spacing */
  text-align: left;
}

th {
  background-color: #4CAF50; /* Green header background */
  color: white; /* White text color for header */
}

/* Button Container */
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px; /* Space below button container */
}

/* Button Styling */
button {
  background-color: #4CAF50; /* Green background */
  color: white; /* White text color */
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s; /* Smooth transition for hover effect */
}

button:hover {
  background-color: #45a049; /* Darker green on hover */
}

/* Hyperparameter Field Styling */
.hyperparameter-field {
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* Space below each hyperparameter field */
}

.hyperparameter-field input {
  flex-grow: 1; /* Allow input field to grow */
  padding: 8px; /* Padding inside input */
  margin-right: 10px; /* Space between input and button */
  border: 1px solid #ccc;
  border-radius: 4px; /* Rounded corners for input */
}

/* Remove Button */
.remove-btn {
  background: red;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 5px 10px; /* Padding for remove button */
}

/* Responsive Styles */
@media (max-width: 600px) {
  .modal-content {
    width: 95%; /* Responsive modal width */
  }

  button {
    width: 100%; /* Full width for buttons on smaller screens */
  }
}

</style> -->
