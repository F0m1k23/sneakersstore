<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const auth = useAuthStore()
const products = useProductsStore()

const form = ref({
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  phone: '',
})
const isLoading = ref(false)
const message = ref('')

async function submit() {
  // Валидация формы
  if (!form.value.email || !form.value.password) {
    message.value = 'Email и пароль обязательны'
    return
  }

  if (form.value.password.length < 6) {
    message.value = 'Пароль должен содержать минимум 6 символов'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    const result = await auth.register(form.value)

    if (result.success) {
      // Синхронизация корзины из localStorage с базой данных
      await syncBasketToDatabase()
      window.showToast('Регистрация прошла успешно!', 'success')
      router.push('/')
    } else {
      window.showToast(result.message, 'error')
    }
  } catch {
    window.showToast('Ошибка при регистрации. Попробуйте еще раз.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Синхронизация корзины из localStorage с базой данных после регистрации
async function syncBasketToDatabase() {
  if (products.basket.length > 0) {
    try {
      // Отправка каждого товара из корзины на сервер
      for (const item of products.basket) {
        await fetch('http://127.0.0.1:5000/basket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            sneaker_id: item.product.id,
            size: item.size,
            quantity: item.quantity,
          }),
        })
      }
      // Очистка localStorage после синхронизации
      localStorage.removeItem('basket')
    } catch (error) {
      console.error('Ошибка синхронизации корзины:', error)
    }
  }
}
</script>

<template>
  <div class="min-h-screen pt-20 pb-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Хлебные крошки -->
      <div class="mb-8">
        <nav class="text-sm text-gray-500">
          <router-link to="/" class="hover:text-gray-700">Главная</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-900">Регистрация</span>
        </nav>
      </div>

      <div class="max-w-md mx-auto">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Создать аккаунт</h1>
          <p class="text-gray-600">Заполните данные для регистрации</p>
        </div>

        <!-- Форма -->
        <form
          @submit.prevent="submit"
          class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6"
        >
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="your@email.com"
            />
          </div>

          <!-- Имя -->
          <div>
            <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              id="first_name"
              v-model="form.first_name"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Ваше имя"
            />
          </div>

          <!-- Фамилия -->
          <div>
            <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">
              Фамилия
            </label>
            <input
              id="last_name"
              v-model="form.last_name"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Ваша фамилия"
            />
          </div>

          <!-- Телефон -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <!-- Пароль -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Пароль *
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Минимум 6 символов"
            />
          </div>

          <!-- Кнопка регистрации -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Регистрация...</span>
            <span v-else>Зарегистрироваться</span>
          </button>

          <!-- Сообщение об ошибке -->
          <p v-if="message" class="text-center text-red-500 mt-2">{{ message }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
