<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto p-8">
      <h2 class="text-xl font-semibold mb-6">Add Project: 1. Create Project</h2>

      <!-- Project Form -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <!-- Left Column - Project Name -->
        <div>
          <label class="block mb-2">Project Name*</label>
          <input 
            type="text" 
            v-model="newProject.project_name"
            placeholder="Project Name" 
            class="w-full p-2 border rounded"
          />
          <button @click="validateAllForm" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded">
            Check Data
          </button>
    
          <WarningModal
            :isVisible="isWarningVisible"
            :message="warningMessage"
            @close="isWarningVisible = false"
          />
          
          <button 
          v-if="isChecked"
            @click="$router.push('/data-split')" 
            class="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 mt-8"
          >
            <span></span>
            <span>next >></span>
          </button>

        </div>

        <!-- Right Column - File Upload -->
        <div>
          <label class="block mb-2">Upload Training Data*</label>
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-blue-50"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @click="$refs.fileInput.click()"
          >
            <div class="flex flex-col items-center">
              <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
              <p>Drag and Drop or Select File (CSV)</p>
              <!-- Hidden file input -->
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept=".csv"
                @change="handleFileSelect"
              />
            </div>
          </div>

          <!-- Show selected file -->
          <div v-if="selectedFile" class="mt-4 text-sm text-gray-600">
            Selected file: {{ selectedFile.name }}
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <!-- <div class="w-full bg-gray-200 rounded h-2 mb-8">
        <div class="bg-blue-600 h-2 rounded" style="width: 33%"></div>
      </div> -->

      <!-- Data Analytics -->
      <h3 class="text-lg font-semibold mb-4">Data Analytics</h3>
      <div v-if="isChecked" class="grid grid-cols-5 gap-4 mb-8">
        <!-- Total Data -->
        <div class="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-4 text-white">
          <h4>Total Data</h4>
          <div class="text-3xl font-bold"> {{ fileMetadata.total_rows }}</div>
          <div class="text-sm">Row</div>
        </div>

        <!-- Missing Value -->
        <div class="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-4 text-white">
          <h4>Total Missing Value</h4>
          <div class="text-3xl font-bold">{{ fileMetadata.total_missing_values }}</div>
          <div class="text-sm">Row</div>
        </div>

        <!-- Duplicate Data -->
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-4 text-white">
          <h4>Total Duplicate Data</h4>
          <div class="text-3xl font-bold"> {{ fileMetadata.total_duplicates }}</div>
          <div class="text-sm">Row</div>
        </div>

        <!-- Inconsistent Data -->
        <!-- <div class="bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg p-4 text-white">
          <h4>Total Inconsistent Data</h4>
          <div class="text-3xl font-bold">12</div>
          <div class="text-sm">Row</div>
        </div> -->

        <!-- Incorrect Format -->
        <!-- <div class="bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg p-4 text-white">
          <h4>Total Incorrect Format</h4>
          <div class="text-3xl font-bold">30</div>
          <div class="text-sm">Row</div>
        </div> -->
      </div>

      <!-- Column Description -->
      <h3 class="text-lg font-semibold mb-4">Column Description</h3>
      <table class="w-full bg-white rounded-lg shadow">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Feature Name</th>
            <th class="px-6 py-3 text-left">Data Type</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(item, index) in fileMetadata.feature_data_types" :key="index">
            <td class="px-6 py-4">{{ item.Feature }}</td>
            <td class="px-6 py-4">{{ item['Data Type'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import WarningModal from '@/components/WarningModal.vue';

export default {
  name: 'UploadTrainingData',
  components: {
    WarningModal
  },
  data() {
    return {
      inputValue: '',
      isWarningVisible: false,
      warningMessage: '',

      isChecked: false,
      selectedFile: null,
      projectName: '',
      newProject: {
        name: '',
        algorithm: null,
        algorithm_id: null,
        config_id: null,
        hyperparameters: {},
        project_name: '',
      },
      fileMetadata: {}
    }
  },
  methods: {
    async checkFileExists(filename) {
      const response = await fetch(`http://localhost:8000/check-file/${filename}`);
      const data = await response.json();
      return data.exists;
    },

    async uploadFile() {
      if (!this.selectedFile) {
        this.message = 'Please select a file first.';
        return;
      }

      const filename = this.selectedFile.name;

      // Check if file exists
      const fileExists = await this.checkFileExists(filename);
      if (fileExists) {
        const confirmReplace = await new Promise((resolve) => {
        const userResponse = confirm(`A file named "${filename}" already exists. Do you want to replace it?`);
          resolve(userResponse);
        });
        if (!confirmReplace) {
          return; // Exit the function if the user does not confirm
        }
      }

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      this.uploading = true; // Start the upload
      this.uploadProgress = 0; // Reset progress
      this.message = ''; // Reset message

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8000/upload-csv/");

      // Update progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        }
      });

      // Handle response
      xhr.onload = () => {
        this.uploading = false; // End the upload
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText);
          this.message = `File ${result.filename} uploaded successfully!`;
          this.$emit("uploaded", result.filename); // Emit the filename on successful upload
        } else {
          this.message = `Error: ${xhr.responseText}`;
        }
      };

      // Handle errors
      xhr.onerror = () => {
        this.uploading = false;
        this.message = 'An error occurred while uploading the file.';
      };

      xhr.send(formData);
    },

    async checkData() {
      // Add your data checking logic here

      // const csvFormData = new FormData();
      // csvFormData.append('filename', this.selectedFile.name);
      try {
        const response = await axios.get(`http://localhost:8000/csv-metadata?filename=${this.selectedFile.name}`);
        this.fileMetadata = response.data
        this.isChecked = true
      } catch (error) {
        console.error('Error fetching csv metadata:', error);
      }
      console.log('Checking data...')
      console.log(this.isChecked)
    },

    async validateAllForm() {
      try {
        this.uploadFile()
        if (this.selectedFile) {
          this.checkData()
          this.isChecked = true
        } else {
          this.isChecked = false
        }

        if (this.newProject.project_name) {
          this.isWarningVisible = false
          this.warningMessage = ''
        } else {
          this.isWarningVisible = true
          this.warningMessage = 'Please fill the project name'
        }

        if (this.isChecked) {
          this.isWarningVisible = false
          this.warningMessage = ''
        } else {
          this.isWarningVisible = true
          this.warningMessage += '\n' + 'Please upload the training file'
        }
      } catch (error) {
        console.error('Error validating entire form', error);
      }

    },

    handleDrop(event) {
      const file = event.dataTransfer.files[0]
      if (file && file.type === 'text/csv') {
        this.selectedFile = file
        this.$emit('file-selected', file)
      }
    },

    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
        this.$emit('file-selected', file)
      }
    }
  }
}
</script>