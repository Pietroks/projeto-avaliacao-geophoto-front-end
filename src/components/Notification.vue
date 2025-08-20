<template>
  <transition name="toast-slide">
    <div v-if="visible" :class="['notification', notificationTypeClass]">
      <div class="notification-icon">
        <font-awesome-icon :icon="icon" />
      </div>
      <div class="notification-content">
        <p class="notification-message">{{ message }}</p>
        <div class="notification-progress" />
      </div>
      <button class="notification-close" @click="$emit('close')">&times;</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AppNotification",
  props: {
    visible: { type: Boolean, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "info" },
  },
  emits: ["close"],
  computed: {
    notificationTypeClass() {
      return `notification--${this.type}`;
    },
    icon() {
      const iconMap = {
        success: "check-circle",
        error: "circle-xmark",
        warning: "triangle-exclamation",
        info: "circle-info",
      };
      return iconMap[this.type] || "circle-info";
    },
  },
};
</script>

<style scoped>
/* Container base */
.notification {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  min-width: 300px;
  max-width: 380px;
  z-index: 9999;
  backdrop-filter: blur(10px);
  background: rgba(33, 37, 41, 0.85);
  color: #fff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

/* Ícone destacado */
.notification-icon {
  flex-shrink: 0;
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Conteúdo */
.notification-content {
  flex-grow: 1;
}
.notification-message {
  margin: 0;
  font-weight: 500;
  line-height: 1.3;
}

/* Barra de progresso animada */
.notification-progress {
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.6);
  animation: shrink 4s linear forwards;
  margin-top: 0.5rem;
}
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

/* Botão de fechar */
.notification-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.25rem;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.notification-close:hover {
  opacity: 1;
}

/* Estilos por tipo */
.notification--info .notification-icon {
  background: rgba(13, 110, 253, 0.2);
  color: #0d6efd;
}
.notification--success .notification-icon {
  background: rgba(25, 135, 84, 0.2);
  color: #198754;
}
.notification--error .notification-icon {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}
.notification--warning .notification-icon {
  background: rgba(255, 193, 7, 0.25);
  color: #ffca2c;
}

/* Animação do toast */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-enter-from {
  transform: translateX(120%) scale(0.95);
  opacity: 0;
}
.toast-slide-leave-to {
  transform: translateX(120%) scale(0.95);
  opacity: 0;
}
</style>
