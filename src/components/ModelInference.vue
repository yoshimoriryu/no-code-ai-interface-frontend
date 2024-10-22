<template>
  <div>
    <h1>Upload Model File</h1>
    <button class="btn btn-primary" @click="openModal">Upload Model</button>

    <!-- Modal -->
    <div class="modal fade" ref="uploadModelModal" tabindex="-1" aria-labelledby="uploadModelModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="uploadModelModalLabel">Upload Model File</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="modelFile" class="form-label">Select Model File</label>
                <input type="file" id="modelFile" class="form-control" @change="handleFileUpload" required />
              </div>
              <div class="mb-3">
                <label for="modelName" class="form-label">Model Name</label>
                <input type="text" class="form-control" id="modelName" v-model="formData.model_name" required />
              </div>
              <div class="mb-3">
                <label for="algorithm" class="form-label">Algorithm</label>
                <input type="text" id="algorithm" class="form-control" v-model="formData.algorithm" readonly />
              </div>
              <div class="mb-3">
                <label for="hyperparameters" class="form-label">Hyperparameters (JSON)</label>
                <textarea id="hyperparameters" class="form-control" v-model="formData.hyperparameters" readonly></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Upload</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Failure Message -->
    <div v-if="message" class="alert" :class="{'alert-success': isSuccess, 'alert-danger': !isSuccess}" role="alert">
      {{ message }}
    </div>

    <!-- Table of Uploaded Models -->
    <table class="table">
      <thead>
        <tr>
          <th>Model Name</th>
          <th>Algorithm</th>
          <th>Hyperparameters</th>
          <th>Uploaded At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="model in uploadedModels" :key="model.id">
          <td>{{ model.model_name }}</td>
          <td>{{ model.algorithm }}</td>
          <td>{{ model.hyperparameters }}</td>
          <td>{{ new Date(model.uploaded_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const formData = ref({
      model_name: '',
      algorithm: '',
      hyperparameters: '',
      model_file: null,
    });

    const message = ref('');
    const isSuccess = ref(false);
    const uploadedModels = ref([]);
    const uploadModelModal = ref(null);
    let modalInstance = null;

    const openModal = () => {
      modalInstance = new window.bootstrap.Modal(uploadModelModal.value);
      modalInstance.show();
    };

    const closeModal = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      formData.value.model_file = file;

      // Automatically extract algorithm and hyperparameters by calling the backend
      extractModelDetails(file);
    };

    const extractModelDetails = async (file) => {
      const formDataToSend = new FormData();
      formDataToSend.append('model_file', file);

      try {
        const response = await axios.post('http://localhost:8000/extract-model-details/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const { algorithm, hyperparameters } = response.data;
        formData.value.algorithm = algorithm;
        formData.value.hyperparameters = JSON.stringify(hyperparameters, null, 2);
      } catch (error) {
        console.error('Failed to extract model details:', error);
      }
    };

    const submitForm = async () => {
      const formDataToSend = new FormData();
      formDataToSend.append('model_name', formData.value.model_name);
      formDataToSend.append('algorithm', formData.value.algorithm);
      formDataToSend.append('hyperparameters', formData.value.hyperparameters);
      formDataToSend.append('model_file', formData.value.model_file);

      try {
        await axios.post('http://localhost:8000/upload-model/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        isSuccess.value = true;
        message.value = 'Model uploaded successfully!';
        closeModal();
        fetchData(); // Refresh the table data
      } catch (error) {
        isSuccess.value = false;
        message.value = 'Failed to upload model.';
        console.error(error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/uploaded-models/');
        uploadedModels.value = response.data;
      } catch (error) {
        console.error('Failed to fetch uploaded models:', error);
      }
    };

    // Fetch existing uploaded models on component mount
    onMounted(() => {
      fetchData();
    });

    return {
      formData,
      message,
      isSuccess,
      uploadedModels,
      openModal,
      closeModal,
      submitForm,
      uploadModelModal,
      handleFileUpload,
    };
  },
};
</script>
