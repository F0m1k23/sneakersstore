<template>
  <div class="pt-28 pb-20 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Мои заказы</h1>

      <!-- Загрузка заказов -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Загружаем ваши заказы...</p>
      </div>

      <!-- Нет заказов -->
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <i class="bi bi-inbox text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">У вас пока нет заказов</h2>
        <p class="text-gray-500 mb-6">Самое время сделать первый заказ</p>
        <router-link
          to="/catalog"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Перейти в каталог
        </router-link>
      </div>

      <!-- Список заказов -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div class="p-6 border-b">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Заказ #{{ order.id }}</h2>
                <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-indigo-600">{{ order.total_price }} ₽</p>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                    'bg-green-100 text-green-800': order.status === 'completed',
                    'bg-blue-100 text-blue-800': order.status === 'processing',
                  }"
                >
                  {{ formatStatus(order.status) }}
                </span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Адрес доставки:</p>
                  <p class="font-medium">{{ order.delivery_address }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Телефон:</p>
                  <p class="font-medium">{{ order.phone }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Способ оплаты:</p>
                  <p class="font-medium">{{ formatPaymentMethod(order.payment_method) }}</p>
                </div>
                <div v-if="order.comment">
                  <p class="text-gray-500">Комментарий:</p>
                  <p class="font-medium">{{ order.comment }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-gray-50">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Товары в заказе</h3>
            <div class="space-y-3">
              <div
                v-for="item in order.items"
                :key="`${order.id}-${item.product.id}-${item.size}`"
                class="flex items-center gap-4"
              >
                <img
                  :src="item.product.image_url"
                  :alt="item.product.model"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ item.product.brand }} {{ item.product.model }}
                  </h4>
                  <p class="text-sm text-gray-500">
                    Размер: {{ item.size }} | Количество: {{ item.quantity }}
                  </p>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ item.price * item.quantity }} ₽
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const orders = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatStatus = (status) => {
  const statusMap = {
    pending: 'Ожидает обработки',
    processing: 'В обработке',
    completed: 'Выполнен',
  }
  return statusMap[status] || status
}

const formatPaymentMethod = (method) => {
  const methodMap = {
    card: 'Банковской картой при получении',
    cash: 'Наличными при получении',
  }
  return methodMap[method] || method
}

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login?redirect=orders')
      return
    }

    const response = await axios.get('https://flaskserver-98pw.onrender.com/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>
