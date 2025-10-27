<template>
  <div class="pt-28 pb-20 bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Оформление заказа</h1>

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Ваш заказ</h2>
        <div class="space-y-4">
          <div
            v-for="item in products.basket"
            :key="`${item.product.id}-${item.size}`"
            class="flex items-center gap-4"
          >
            <img
              :src="item.product.image_url"
              :alt="item.product.model"
              class="w-16 h-16 object-cover rounded"
            />
            <div class="flex-1">
              <h3 class="font-medium">{{ item.product.brand }} {{ item.product.model }}</h3>
              <p class="text-sm text-gray-500">
                Размер: {{ item.size }} | Количество: {{ item.quantity }}
              </p>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ item.product.price * item.quantity }} ₽</p>
            </div>
          </div>
        </div>

        <div class="border-t mt-6 pt-4">
          <div class="flex justify-between items-center text-lg">
            <span class="font-medium">Итого:</span>
            <span class="font-bold text-xl text-indigo-600">{{ products.basketTotal }} ₽</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Данные для доставки</h2>
        <OrderForm @order-submitted="handleOrderSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '@/stores/products'
import { useRouter } from 'vue-router'
import OrderForm from '@/components/OrderForm.vue'
import axios from 'axios'

const router = useRouter()
const products = useProductsStore()

// Проверяем, есть ли товары в корзине
if (products.basket.length === 0) {
  router.push('/basket')
}

const handleOrderSubmit = async (formData) => {
  try {
    const orderData = {
      total_price: products.basketTotal,
      items: products.basket.map((item) => ({
        product_id: item.product.id,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      })),
      delivery_address: formData.address,
      phone: formData.phone,
      payment_method: formData.paymentMethod,
      comment: formData.comment,
    }

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login?redirect=checkout')
      return
    }

    const response = await axios.post('http://127.0.0.1:5000/orders', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 201) {
      products.clearBasket()
      router.push({
        path: '/orders',
        query: { success: true, orderId: response.data.order_id },
      })
    }
  } catch (error) {
    console.error('Error creating order:', error)
    // Здесь можно добавить обработку ошибок
  }
}
</script>
