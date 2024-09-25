<template>
  <div>
    <h2>Uploaded CSV Files</h2>
    <ul>
      <li v-for="(file, index) in csvFiles" :key="index">
        <button @click="selectFile(file)">{{ file }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      csvFiles: [],
    };
  },
  created() {
    this.fetchCsvFiles();
  },
  methods: {
    async fetchCsvFiles() {
      try {
        const response = await fetch("http://localhost:8000/list-csv/");
        const data = await response.json();
        this.csvFiles = data.uploaded_files;  // Use 'uploaded_files' from your API response
      } catch (error) {
        console.error("Error fetching CSV files:", error);
      }
    },
    selectFile(file) {
      this.$emit("file-selected", file);  // Emit the selected filename
    },
  },
};
</script>
