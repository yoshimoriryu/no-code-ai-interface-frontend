<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
      <div class="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 2a1 1 0 00-.894.553l-8 16A1 1 0 002 20h16a1 1 0 00.894-1.447l-8-16A1 1 0 0010 2zm0 3a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 00-.993.883L9 10v3a1 1 0 002 0v-3a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <h2 class="text-lg font-semibold">Warning</h2>
      </div>
      <p class="text-gray-700 mb-4" v-html="formattedMessage"></p>
      <button
        @click="closeModal"
        class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: 'This is a warning message.\nMake sure to follow the guidelines.'
    }
  },
  computed: {
    formattedMessage() {
      return this.message.replace(/\n/g, '<br>'); // Replace newline with <br>
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
/* Optional: Add custom styles if needed */
</style>
