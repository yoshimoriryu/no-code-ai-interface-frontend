<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">CSV Data: {{ filename }}</h1>
    
    <!-- Delete Button -->
    <button @click="deleteCsvFile" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
      Delete CSV File
    </button>

    <div v-if="csvRecords.length" class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th v-for="(header, index) in Object.keys(csvRecords[0])" :key="index" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(record, index) in csvRecords" :key="index">
            <td v-for="(value, key) in record" :key="key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500 text-lg">No data available.</p>

    <div v-if="csvRecords.length" class="mt-4 flex items-center justify-between">
      <button @click="prevPage" :disabled="page === 1" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
        Previous
      </button>
      <span class="text-gray-700">Page {{ page }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filename: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      csvRecords: [], // Current records for the page
      page: 1, // Current page number
      totalPages: 1, // Total number of pages from the backend
      pageSize: 10, // Number of records per page
    };
  },
  watch: {
    filename: {
      immediate: true,
      handler(newFilename) {
        this.fetchCsvData(newFilename, this.page); // Fetch data whenever a new file is selected
      },
    },
  },
  methods: {
    async fetchCsvData(filename, page) {
      try {
        const response = await fetch(`http://localhost:8000/show-csv/${filename}?page=${page}&page_size=${this.pageSize}`);
        const csvData = await response.json();
        if (response.ok) {
          this.csvRecords = csvData.data; // Assuming 'data' contains the CSV records
          this.totalPages = csvData.total_pages; // Update total pages from backend
        } else {
          console.error("Error fetching CSV data:", csvData.error);
        }
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    },
    async deleteCsvFile() {
      if (confirm(`Are you sure you want to delete ${this.filename}?`)) {
        try {
          const response = await fetch(`http://localhost:8000/delete-file/?filename=${this.filename}`, {
            method: 'DELETE',
          });
          const result = await response.json();

          if (response.ok) {
            alert(result.message); // Show success message
            this.$emit('fileDeleted'); // Emit an event to the parent component
          } else {
            alert(`Error: ${result.detail}`); // Show error message
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          alert("An error occurred while trying to delete the file.");
        }
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchCsvData(this.filename, this.page); // Fetch next page of data
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchCsvData(this.filename, this.page); // Fetch previous page of data
      }
    },
  },
};
</script>

