<template>
  <div>
    <h1>Train Model</h1>

    <div>
      <h2>Select Data Split Config</h2>
      <select v-model="selectedConfig" @change="updateConfigMetadata">
        <option v-for="config in dataSplitConfigs" 
                :key="`${config.filename}-${config.train_size}-${config.random_seed}-${config.target}`" 
                :value="config.id">
          {{ config.filename }}, Train Size: {{ config.train_size }}, Random Seed: {{ config.random_seed }}, Target: {{ config.target }}
        </option>
      </select>
    </div>

    <div>
      <h2>Select Model</h2>
      <select v-model="selectedModel" @change="updateModelMetadata">
        <option v-for="model in filteredModels" :key="model.id" :value="model.id">
          {{ model.name }} - {{ model.algorithm }}
        </option>
      </select>
    </div>

    <!-- Show selected config metadata -->
    <div v-if="selectedConfigMetadata">
      <h3>Data Split Config Metadata</h3>
      <p><strong>Filename:</strong> {{ selectedConfigMetadata.filename }}</p>
      <p><strong>Train Size:</strong> {{ selectedConfigMetadata.train_size }}</p>
      <p><strong>Random Seed:</strong> {{ selectedConfigMetadata.random_seed }}</p>
      <p><strong>Target:</strong> {{ selectedConfigMetadata.target }}</p>
      <p><strong>Features:</strong> {{ selectedConfigMetadata.features.join(', ') }}</p>
      <p><strong>Missing Data Strategy:</strong> {{ selectedConfigMetadata.missing_data_strategy || 'None' }}</p>
      <p><strong>Created At:</strong> {{ selectedConfigMetadata.created_at }}</p>
    </div>

    <!-- Show selected model metadata -->
    <div v-if="selectedModelMetadata">
      <h3>Model Metadata</h3>
      <p><strong>Name:</strong> {{ selectedModelMetadata.name }}</p>
      <p><strong>Algorithm:</strong> {{ selectedModelMetadata.algorithm }}</p>
      <p><strong>Hyperparameters:</strong> {{ selectedModelMetadata.hyperparameters }}</p>
      <p><strong>Created At:</strong> {{ selectedModelMetadata.created_at }}</p>
    </div>

    <button @click="trainModel">Train Model</button>

    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataSplitConfigs: [],
      models: [],
      selectedConfig: null,
      selectedModel: null,
      selectedConfigMetadata: null,
      selectedModelMetadata: null,
      message: '',
    };
  },
  async created() {
    // Fetch data split configs
    const configResponse = await fetch('http://localhost:8000/data-split-configs/');
    this.dataSplitConfigs = await configResponse.json();

    // Fetch models
    const modelResponse = await fetch('http://localhost:8000/all-models/');
    this.models = await modelResponse.json();
  },
  computed: {
    filteredModels() {
      // Filter out default models
      return this.models.filter(model => !model.is_default);
    }
  },
  methods: {
    updateConfigMetadata() {
      const selected = this.dataSplitConfigs.find(config => config.id === this.selectedConfig);
      this.selectedConfigMetadata = selected || null;
      this.selectedModelMetadata = null; // Reset model metadata when config changes
    },
    updateModelMetadata() {
      const selected = this.models.find(model => model.id === this.selectedModel);
      this.selectedModelMetadata = selected || null;
    },
    async trainModel() {
      if (this.selectedConfig && this.selectedModel) {
        const modelId = this.selectedModel;  // Ensure this is set correctly
        const configId = this.selectedConfig; // Ensure this is set correctly

        const response = await fetch(`http://localhost:8000/train-model/?model_id=${modelId}&config_id=${configId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
          this.message = 'Model training started successfully!';
        } else {
          this.message = 'Error starting model training.';
        }
      } else {
        this.message = 'Please select a model and a data split config.';
      }
    },
  },
};
</script>
