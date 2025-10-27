<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])
const isVisible = ref(false)

const show = () => {
  isVisible.value = true
}

const hide = () => {
  isVisible.value = false
  emit('close')
}

const formData = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)

const submitForm = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  isSubmitting.value = true

  // Имитация отправки формы
  setTimeout(() => {
    alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.')
    isSubmitting.value = false
    hide()
    formData.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    }
  }, 2000)
}

// Экспортируем функции для использования в родительском компоненте
defineExpose({
  show,
  hide,
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="hide"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isVisible"
            class="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            <!-- Header -->
            <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <button
                @click="hide"
                class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 class="text-xl font-bold">Связаться с нами</h2>
              </div>
              <p class="text-indigo-100 text-sm">Мы ответим в течение 24 часов</p>
            </div>

            <!-- Form -->
            <div class="p-6 overflow-y-auto max-h-96">
              <form @submit.prevent="submitForm" class="space-y-4">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Имя <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Ваше имя"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="ваш@email.com"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"> Телефон </label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <!-- Subject -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"> Тема </label>
                  <select
                    v-model="formData.subject"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Выберите тему</option>
                    <option value="order">Вопрос по заказу</option>
                    <option value="return">Возврат и обмен</option>
                    <option value="size">Помощь с размером</option>
                    <option value="delivery">Доставка</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <!-- Message -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="formData.message"
                    required
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Опишите ваш вопрос..."
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Отправка...
                  </span>
                  <span v-else>Отправить сообщение</span>
                </button>
              </form>

              <!-- Contact Info -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex items-center gap-3 text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>8 (800) 123-45-67</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-gray-600 mt-2">
                  <svg
                    class="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>support@sneakershop.ru</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Custom scrollbar for textarea and modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
