<template>
  <div id="app">
    <UploadCsv @csv-uploaded="handleUpload" />
    <ListCsv @file-selected="handleFileSelected" />
    <DisplayCsv v-if="selectedFile" :filename="selectedFile" />
  </div>
</template>

<script>
import UploadCsv from './components/UploadCsv.vue';
import ListCsv from './components/ListCsv.vue';
import DisplayCsv from './components/DisplayCsv.vue';

export default {
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
      this.$refs.listCsv.fetchCsvFiles();  // Refresh the list after upload
    },
    handleFileSelected(file) {
      this.selectedFile = file;  // Set the selected file to display
    },
  },
};
</script>
