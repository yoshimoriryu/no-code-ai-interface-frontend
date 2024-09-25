<template>
  <div>
    <h1>CSV Data: {{ filename }}</h1>
    <table v-if="csvRecords.length">
      <thead>
        <tr>
          <th v-for="(header, index) in Object.keys(csvRecords[0])" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in csvRecords" :key="index">
          <td v-for="(value, key) in record" :key="key">{{ value }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No data available.</p>

    <div v-if="csvRecords.length">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages">Next</button>
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

<style scoped>
/* Optional: Add some basic styling */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
