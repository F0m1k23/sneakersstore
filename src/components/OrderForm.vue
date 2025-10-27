<template>
  <form @submit.prevent="submitOrder" class="space-y-6">
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700">Адрес доставки</label>
      <textarea
        id="address"
        v-model="orderData.address"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      ></textarea>
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700">Номер телефона</label>
      <input
        type="tel"
        id="phone"
        v-model="orderData.phone"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      />
    </div>

    <div>
      <label for="paymentMethod" class="block text-sm font-medium text-gray-700"
        >Способ оплаты</label
      >
      <select
        id="paymentMethod"
        v-model="orderData.paymentMethod"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      >
        <option value="card">Банковской картой при получении</option>
        <option value="cash">Наличными при получении</option>
      </select>
    </div>

    <div>
      <label for="comment" class="block text-sm font-medium text-gray-700"
        >Комментарий к заказу</label
      >
      <textarea
        id="comment"
        v-model="orderData.comment"
        rows="2"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      ></textarea>
    </div>

    <div class="border-t pt-6">
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Оформляем заказ...' : 'Подтвердить заказ' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['orderSubmitted'])

const orderData = ref({
  address: '',
  phone: '',
  paymentMethod: 'card',
  comment: '',
})

const isSubmitting = ref(false)

const submitOrder = async () => {
  isSubmitting.value = true
  try {
    // Здесь можно добавить валидацию данных
    emit('orderSubmitted', orderData.value)
  } catch (error) {
    console.error('Error submitting order:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
