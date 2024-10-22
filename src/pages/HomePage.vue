<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-4">CSV File Management</h2>

    <!-- Upload CSV Component -->
    <div class="mb-6">
      <UploadCsv @csv-uploaded="handleUpload" />
    </div>

    <!-- List of CSV Files -->
    <div class="mb-6">
      <ListCsv @file-selected="handleFileSelected" />
    </div>

    <!-- Display Selected CSV File -->
    <div v-if="selectedFile" class="mt-6">
      <DisplayCsv :filename="selectedFile" />
    </div>
  </div>
</template>


<script>
import UploadCsv from '../components/UploadCsv.vue';
import ListCsv from '../components/ListCsv.vue';
import DisplayCsv from '../components/DisplayCsv.vue';

export default {
  name: 'HomePage',
  components: {
    UploadCsv,
    ListCsv,
    DisplayCsv,
  },
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    handleUpload() {
      this.$refs.listCsv.fetchCsvFiles();
    },
    handleFileSelected(file) {
      this.selectedFile = file;
    },
  },
};
</script>
