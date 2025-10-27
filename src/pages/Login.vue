<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const auth = useAuthStore()
const products = useProductsStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const message = ref('')

const handleLogin = async () => {
  // Валидация формы
  if (!email.value || !password.value) {
    message.value = 'Пожалуйста, заполните все поля'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    const result = await auth.login(email.value, password.value)

    if (result.success) {
      // Синхронизация корзины из базы данных с локальным состоянием
      await syncBasketFromDatabase()
      window.showToast('Вход выполнен успешно!', 'success')
      router.push('/')
    } else {
      window.showToast(result.message, 'error')
    }
  } catch {
    window.showToast('Ошибка при входе. Попробуйте еще раз.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Синхронизация корзины из базы данных с локальным состоянием
async function syncBasketFromDatabase() {
  try {
    const response = await fetch('https://flaskserver-98pw.onrender.com/basket', {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    if (response.ok) {
      const basketData = await response.json()
      // Преобразование данных из базы в формат локальной корзины
      const localBasket = basketData.map((item) => ({
        product: item.product,
        size: item.size,
        quantity: item.quantity,
        addedAt: item.added_at,
      }))

      // Обновление локальной корзины
      products.basket = localBasket
      localStorage.setItem('basket', JSON.stringify(localBasket))
    }
  } catch (error) {
    console.error('Ошибка синхронизации корзины:', error)
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
          <span class="text-gray-900">Вход</span>
        </nav>
      </div>

      <div class="max-w-md mx-auto">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Вход в аккаунт</h1>
          <p class="text-gray-600">Введите свои данные для входа</p>
        </div>

        <!-- Форма -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="your@email.com"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Введите пароль"
              />
            </div>

            <!-- Сообщение об ошибке -->
            <div v-if="message" class="text-red-500 text-sm text-center">
              {{ message }}
            </div>

            <!-- Кнопка входа -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">Вход...</span>
              <span v-else>Войти</span>
            </button>

            <!-- Разделитель -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Или</span>
              </div>
            </div>

            <!-- Регистрация -->
            <div class="text-center">
              <p class="text-gray-600">
                Нет аккаунта?
                <router-link
                  to="/register"
                  class="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Зарегистрироваться
                </router-link>
              </p>
            </div>
          </form>
        </div>

        <!-- Дополнительная информация -->
        <div class="mt-8 text-center text-sm text-gray-500">
          <p>Войдите, чтобы получить доступ к персональным скидкам и отслеживанию заказов</p>
        </div>
      </div>
    </div>
  </div>
</template>
