<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" :class="`modal-${type}`">
        <button @click="closeModal" class="close-button">&times;</button>

        <div class="modal-icon">
          <CheckCircleIcon v-if="type === 'success'" />
          <XCircleIcon v-if="type === 'errpr'" />
          <InformationCircleIcon v-if="type === 'info'" />
        </div>

        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-message">{{ message }}</p>

        <button v-if="buttonText" @click="handleConfirm" class="modal-button">{{ buttonText }}</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from "@heroicons/vue/24/solid";

export default {
  name: "AppModal",
  components: { CheckCircleIcon, XCircleIcon, InformationCircleIcon },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Aviso",
    },
    message: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: "OK",
    },
    type: {
      type: String,
      default: "Info",
      validator: (value) => ["success", "error", "info"].includes(value),
    },
  },
  emits: ["update:modelValue", false],
  methods: {
    closeModal() {
      this.$emit("update:modelValue", false);
    },
    handleConfirm() {
      this.$emit("confirm");
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 450px;
  width: 90%;
  position: relative;
  border-top: 5px solid;
}

.modal-success {
  border-color: #28a745;
}
.modal-error {
  border-color: #dc3545;
}
.modal-info {
  border-color: #17a2b8;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #aaa;
  cursor: pointer;
}

.modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
}
.modal-success .modal-icon {
  color: #28a745;
}
.modal-error .modal-icon {
  color: #dc3545;
}
.modal-info .modal-icon {
  color: #17a2b8;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.modal-message {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-success .modal-button {
  background-color: #28a745;
}
.modal-error .modal-button {
  background-color: #dc3545;
}
.modal-info .modal-button {
  background-color: #17a2b8;
}

.modal-button:hover {
  opacity: 0.9;
}
</style>
