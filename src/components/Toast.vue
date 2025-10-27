<script setup>
import { ref } from 'vue'

const toasts = ref([])

const addToast = (message, type = 'success', duration = 3000) => {
  const id = Date.now()
  toasts.value.push({
    id,
    message,
    type,
    duration,
  })

  // Автоматическое удаление через duration
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return 'bi-check-circle-fill'
    case 'error':
      return 'bi-exclamation-circle-fill'
    case 'warning':
      return 'bi-exclamation-triangle-fill'
    case 'info':
      return 'bi-info-circle-fill'
    default:
      return 'bi-info-circle-fill'
  }
}

const getToastColor = (type) => {
  switch (type) {
    case 'success':
      return 'from-green-500 to-emerald-600'
    case 'error':
      return 'from-red-500 to-red-600'
    case 'warning':
      return 'from-yellow-500 to-orange-600'
    case 'info':
      return 'from-blue-500 to-indigo-600'
    default:
      return 'from-gray-500 to-gray-600'
  }
}

// Экспортируем функцию для использования в других компонентах
defineExpose({
  addToast,
})
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-x-full"
      enter-to-class="opacity-100 transform translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-x-0"
      leave-to-class="opacity-0 transform translate-x-full"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-80 max-w-md"
      >
        <!-- Иконка -->
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-white',
            `bg-gradient-to-r ${getToastColor(toast.type)}`,
          ]"
        >
          <i :class="getToastIcon(toast.type)"></i>
        </div>

        <!-- Сообщение -->
        <div class="flex-1 text-sm font-medium text-gray-900">
          {{ toast.message }}
        </div>

        <!-- Кнопка закрытия -->
        <button
          @click="removeToast(toast.id)"
          class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <i class="bi bi-x text-sm"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Анимации для группы */
</style>
