<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Uploaded CSV Files</h2>
    <ul class="space-y-2">
      <li v-for="(file, index) in csvFiles" :key="index" class="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow">
        <button 
          @click="selectFile(file)" 
          class="text-blue-600 hover:underline focus:outline-none"
        >
          {{ file }}
        </button>
        <button 
          @click="deleteFile(file)" 
          class="ml-4 text-red-600 hover:underline focus:outline-none"
        >
          Delete
        </button> <!-- Delete Button -->
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
        this.csvFiles = data.uploaded_files; // Use 'uploaded_files' from your API response
      } catch (error) {
        console.error("Error fetching CSV files:", error);
      }
    },
    selectFile(file) {
      this.$emit("file-selected", file); // Emit the selected filename
    },
    async deleteFile(file) {
      if (confirm(`Are you sure you want to delete ${file}?`)) {
        try {
          const response = await fetch(`http://localhost:8000/delete-file/?filename=${file}`, {
            method: 'DELETE',
          });
          const result = await response.json();

          if (response.ok) {
            alert(result.message); // Show success message
            this.fetchCsvFiles(); // Refresh the list of files after deletion
          } else {
            alert(`Error: ${result.detail}`); // Show error message
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          alert("An error occurred while trying to delete the file.");
        }
      }
    },
  },
};
</script>
