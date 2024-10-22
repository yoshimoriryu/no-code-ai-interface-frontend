<template>
  <div class="p-6 bg-gray-100">
    <h1 class="text-3xl font-bold mb-6">Data Sampler</h1>
    <button
      class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
      @click="openModal"
    >
      Create Data Split Config
    </button>

    <!-- Modal -->
    <div class="modal fade" ref="dataSplitModal" tabindex="-1" aria-labelledby="dataSplitModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="dataSplitModalLabel">Create Data Split Config</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="selectData" class="form-label">Select Data</label>
                <select id="selectData" class="form-select" v-model="formData.filename" @change="fetchCsvColumns" required>
                  <option v-for="file in csvFiles" :key="file" :value="file">{{ file }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="trainSize" class="form-label">Train Size</label>
                <input type="number" step="0.01" class="form-control" id="trainSize" v-model="formData.train_size" required />
              </div>
              <div class="mb-3">
                <label for="randomSeed" class="form-label">Random Seed (optional)</label>
                <input type="number" class="form-control" id="randomSeed" v-model="formData.random_seed" />
              </div>
              <div class="mb-3">
                <label for="features" class="form-label">Features</label>
                <div>
                  <input type="checkbox" id="checkAll" @change="toggleAllFeatures" />
                  <label for="checkAll">Check All</label>
                </div>
                <div v-for="column in csvColumns" :key="column">
                  <input type="checkbox" :id="column" :value="column" v-model="formData.features" />
                  <label :for="column">{{ column }}</label>
                </div>
              </div>
              <div class="mb-3">
                <label for="target" class="form-label">Target</label>
                <select id="target" class="form-select" v-model="formData.target" required>
                  <option v-for="column in csvColumns" :key="column" :value="column">{{ column }}</option>
                </select>
              </div>

              <!-- Missing Data Strategy Selection -->
              <div class="mb-3">
                <label for="missingDataStrategy" class="form-label">Missing Data Strategy</label>
                <select id="missingDataStrategy" class="form-select" v-model="formData.missing_data_strategy" required>
                  <option value="">Select strategy</option>
                  <option value="do_nothing">--- Do Nothing ---</option>
                  <option value="fill_mean">Fill with Mean</option>
                  <option value="fill_median">Fill with Median</option>
                  <option value="fill_most_frequent">Fill with Most Frequent</option>
                  <option value="replace_constant">Fill with Constant</option>
                  <option value="remove_rows">Remove Rows</option>
                </select>
              </div>

              <!-- Constant Value Input (conditionally shown) -->
              <div class="mb-3" v-if="formData.missing_data_strategy === 'constant'">
                <label for="constantValue" class="form-label">Constant Value</label>
                <input type="number" class="form-control" id="constantValue" v-model="formData.constant_value" required />
              </div>

              <button type="submit" class="btn btn-primary">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Failure Message -->
    <div v-if="message" class="alert" :class="{'alert-success': isSuccess, 'alert-danger': !isSuccess}" role="alert">
      {{ message }}
    </div>

    <!-- Table of Data Split Configs -->
    <table class="w-full bg-white shadow-md rounded">
      <thead>
        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th class="py-3 px-6 text-left">Filename</th>
          <th class="py-3 px-6 text-left">Train Size</th>
          <th class="py-3 px-6 text-left">Random Seed</th>
          <th class="py-3 px-6 text-left">Features</th>
          <th class="py-3 px-6 text-left">Target</th>
          <th class="py-3 px-6 text-left">Missing Data Strategy</th> <!-- New column for missing data strategy -->
          <th class="py-3 px-6 text-left">Constant Value</th> <!-- New column for constant value -->
          <th class="py-3 px-6 text-left">Created At</th>
          <th class="py-3 px-6 text-left">Actions</th>
        </tr>
      </thead>
      <tbody class="text-gray-600 text-sm font-light">
        <tr v-for="config in dataConfigs" :key="config.id" class="border-b border-gray-200 hover:bg-gray-100">
          <td class="py-3 px-6 text-left whitespace-nowrap">{{ config.filename }}</td>
          <td>{{ config.train_size }}</td>
          <td>{{ config.random_seed }}</td>
          <td>
            <ul>
              <li v-for="feature in config.features" :key="feature">{{ feature }}</li>
            </ul>
          </td>
          <td>{{ config.target }}</td>
          <td>{{ config.missing_data_strategy }}</td> <!-- Display missing data strategy -->
          <td>{{ config.constant_value }}</td> <!-- Display constant value -->
          <td>{{ new Date(config.created_at).toLocaleString() }}</td>
          <td class="py-3 px-6 text-center">
            <button
              @click="deleteConfig(config.id)"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </td>
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
      filename: '',
      train_size: 0,
      random_seed: null,
      features: [],
      target: '',
      missing_data_strategy: null,
      constant_value: null,
    });

    const message = ref('');
    const isSuccess = ref(false);
    const dataConfigs = ref([]);
    const csvFiles = ref([]);
    const csvColumns = ref([]);
    const dataSplitModal = ref(null);
    let modalInstance = null;

    const openModal = () => {
      modalInstance = new window.bootstrap.Modal(dataSplitModal.value);
      modalInstance.show();
    };

    const closeModal = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };

    const toggleAllFeatures = () => {
      const checkAll = document.getElementById('checkAll');
      if (checkAll.checked) {
        formData.value.features = csvColumns.value.slice();
      } else {
        formData.value.features = [];
      }
    };

    const fetchCsvColumns = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get-csv-columns?filename=${formData.value.filename}`);
        csvColumns.value = response.data.columns;
        formData.value.features = [];
        formData.value.target = '';
      } catch (error) {
        console.error('Failed to fetch CSV columns:', error);
      }
    };

    const submitForm = async () => {
      try {
        console.log(formData.value)
        await axios.post('http://localhost:8000/data-split-configs/', formData.value);
        isSuccess.value = true;
        message.value = 'Data split config created successfully!';
        closeModal();
        fetchData(); // Refresh the table data
      } catch (error) {
        isSuccess.value = false;
        message.value = 'Failed to create data split config.';
        console.error(error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/data-split-configs/');
        dataConfigs.value = response.data;
      } catch (error) {
        console.error('Failed to fetch data split configs:', error);
      }
    };

    const fetchCsvFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/list-csv/');
        csvFiles.value = response.data.uploaded_files;
      } catch (error) {
        console.error('Failed to fetch CSV files:', error);
      }
    };

    const deleteConfig = async (configId) => {
      if (confirm(`Are you sure you want to delete the config for ${configId}?`)) {
        try {
          await axios.delete(`http://localhost:8000/delete-config/${configId}`);
          message.value = `Config deleted successfully!`;
          isSuccess.value = true;
          fetchData(); // Refresh the table data
        } catch (error) {
          console.error('Failed to delete config:', error);
          message.value = `Failed to delete config.`;
          isSuccess.value = false;
        }
      }
    };

    // Fetch existing data configs and CSV files on component mount
    onMounted(() => {
      fetchData();
      fetchCsvFiles(); // Fetch CSV files
    });

    return {
      formData,
      message,
      isSuccess,
      dataConfigs,
      openModal,
      closeModal,
      submitForm,
      fetchData,
      dataSplitModal,
      csvFiles,
      csvColumns,
      fetchCsvColumns,
      toggleAllFeatures,
      deleteConfig,
    };
  },
};
</script>
