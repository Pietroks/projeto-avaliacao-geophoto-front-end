<template>
  <div v-if="visible" class="image-modal-overlay" @click.self="close">
    <div class="image-modal-content">
      <button v-show="!isLoading" class="image-modal-close-btn" @click="close">&times;</button>

      <div v-if="images.length === 1">
        <img :src="images[0].image_url" class="modal-image" alt="Imagem em tamanho real" @load="handleImageLoad" />
      </div>

      <div v-if="images.length > 1" class="carousel-container">
        <img
          :src="images[currentIndex].image_url"
          class="modal-image"
          :key="images[currentIndex].image_id"
          alt="Imagem do carrossel"
          @load="handleImageLoad"
        />

        <button v-show="!isLoading" class="carousel-nav prev" @click="prevImage">&#10094;</button>
        <button v-show="!isLoading" class="carousel-nav next" @click="nextImage">&#10095;</button>
        <div v-show="!isLoading" class="carousel-counter">{{ currentIndex + 1 }} / {{ images.length }}</div>
      </div>

      <div v-if="isLoading" class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    startIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentIndex: 0,
      isLoading: true,
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.isLoading = true;
        this.currentIndex = this.startIndex;
      }
    },
  },
  methods: {
    handleImageLoad() {
      this.isLoading = false;
    },
    close() {
      this.$emit("close");
    },
    nextImage() {
      this.isLoading = true;
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevImage() {
      this.isLoading = true;
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
  },
};
</script>

<style scoped>
.image-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060;
}
.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}
.image-modal-close-btn {
  position: absolute;
  top: -15px;
  right: -10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 5;
}
.carousel-nav:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.carousel-nav.prev {
  left: -60px;
}
.carousel-nav.next {
  right: -60px;
}
.carousel-counter {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -20px;
  margin-left: -20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
