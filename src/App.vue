<script setup>
import HeaderLayout from './layout/HeaderLayout.vue'
import FooterLayout from './layout/FooterLayout.vue'
import Toast from './components/Toast.vue'
import { ref } from 'vue'

// Глобальный компонент для уведомлений
const toast = ref(null)

// Функция для показа уведомлений (доступна глобально)
const showToast = (message, type = 'success', duration = 3000) => {
  if (toast.value) {
    toast.value.addToast(message, type, duration)
  }
}

// Экспортируем функцию для использования в компонентах
window.showToast = showToast
</script>

<template>
  <div>
    <HeaderLayout />
    <router-view></router-view>
    <FooterLayout />

    <!-- Глобальный компонент уведомлений -->
    <Toast ref="toast" />
  </div>
</template>

<style scoped>
</style>
