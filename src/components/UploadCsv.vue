<template>
  <div>
    <input type="file" @change="onFileChange" />
    <button @click="uploadFile">Upload</button>
    
    <!-- Progress Bar -->
    <div v-if="uploading">
      <progress :value="uploadProgress" max="100"></progress>
      <span>{{ uploadProgress }}%</span>
    </div>

    <!-- Success/Error Message -->
    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: null,
      uploading: false,
      uploadProgress: 0,
      message: '', // For success or error messages
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
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
        const confirmReplace = confirm(`A file named "${filename}" already exists. Do you want to replace it?`);
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
  },
};
</script>


<style scoped>
progress {
  width: 100%;
  height: 20px;
}

div {
  margin-top: 10px;
}

span {
  margin-left: 10px;
}

.message {
  color: green;
}
</style>
