<script setup>
import { useProductsStore } from '@/stores/products'
import { ref } from 'vue'

const products = useProductsStore()
const showOrderModal = ref(false)
const isSubmitting = ref(false)

const orderForm = ref({
  name: '',
  email: '',
  phone: '',
  delivery: 'pickup',
  address: '',
  payment: 'card',
  comment: '',
})

const submitOrder = async () => {
  if (!orderForm.value.name || !orderForm.value.email || !orderForm.value.phone) {
    window.showToast('Пожалуйста, заполните все обязательные поля', 'warning')
    return
  }

  if (orderForm.value.delivery !== 'pickup' && !orderForm.value.address) {
    window.showToast('Пожалуйста, укажите адрес доставки', 'warning')
    return
  }

  isSubmitting.value = true

  // Имитация отправки заказа
  setTimeout(() => {
    window.showToast('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.', 'success')
    isSubmitting.value = false
    showOrderModal.value = false
    products.clearBasket()
    // Очистка формы
    orderForm.value = {
      name: '',
      email: '',
      phone: '',
      delivery: 'pickup',
      address: '',
      payment: 'card',
      comment: '',
    }
  }, 3000)
}

// Удаляем локальные функции и используем store
// const removeFromBasket = (productId, size) => {
//   products.removeFromBasket(productId, size)
// }

// const updateQuantity = (productId, size, newQuantity) => {
//   if (newQuantity < 1) return
//   const item = products.basket.find((item) => item.product.id === productId && item.size === size)
//   if (item) {
//     item.quantity = newQuantity
//   }
// }
</script>

<template>
  <div class="pt-28 pb-20 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

      <!-- Пустая корзина -->
      <div v-if="products.basket.length === 0" class="text-center py-12">
        <i class="bi bi-cart-x text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Корзина пуста</h2>
        <p class="text-gray-500 mb-6">Добавьте товары из каталога</p>
        <router-link
          to="/catalog"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Перейти в каталог
        </router-link>
      </div>

      <!-- Товары в корзине -->
      <div v-else class="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
        <div class="space-y-4 lg:space-y-6">
          <div
            v-for="item in products.basket"
            :key="`${item.product.id}-${item.size}`"
            class="group bg-gray-50/50 hover:bg-gray-50 rounded-xl p-4 lg:p-6 transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:shadow-md"
          >
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <!-- Изображение товара -->
              <div
                class="w-full sm:w-24 h-48 sm:h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-200"
              >
                <img
                  v-if="item.product.image_url"
                  :src="item.product.image_url"
                  :alt="item.product.model"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <i class="bi bi-image text-2xl"></i>
                </div>
              </div>

              <!-- Информация о товаре -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                  <div>
                    <h3
                      class="font-bold text-lg lg:text-xl text-gray-900 group-hover:text-indigo-600 transition-colors"
                    >
                      {{ item.product.model }}
                    </h3>
                    <p class="text-gray-600 font-medium">{{ item.product.brand }}</p>
                    <div class="flex items-center gap-4 mt-2">
                      <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
                        >Размер: {{ item.size }}</span
                      >
                      <span
                        class="text-sm text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full"
                      >
                        {{ item.product.price.toLocaleString() }} ₽
                      </span>
                    </div>
                  </div>

                  <!-- Управление количеством -->
                  <div class="flex items-center gap-3 self-start lg:self-auto mt-4 lg:mt-0">
                    <button
                      @click="
                        products.updateQuantity(item.product.id, item.size, item.quantity - 1)
                      "
                      class="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                      :disabled="item.quantity <= 1"
                    >
                      <i class="bi bi-dash text-sm"></i>
                    </button>
                    <span class="w-12 text-center font-bold text-lg">{{ item.quantity }}</span>
                    <button
                      @click="
                        products.updateQuantity(item.product.id, item.size, item.quantity + 1)
                      "
                      class="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all duration-200"
                    >
                      <i class="bi bi-plus text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Сумма и удаление -->
              <div class="flex flex-col lg:flex-row lg:items-center gap-3 self-end lg:self-auto">
                <div class="text-right">
                  <p class="font-bold text-xl text-gray-900">
                    {{ (item.product.price * item.quantity).toLocaleString() }} ₽
                  </p>
                  <p class="text-sm text-gray-500">за {{ item.quantity }} шт.</p>
                </div>
                <button
                  @click="products.removeFromBasket(item.product.id, item.size)"
                  class="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 group/delete"
                >
                  <i
                    class="bi bi-trash text-sm group-hover/delete:scale-110 transition-transform"
                  ></i>
                  <span class="text-sm font-medium">Удалить</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Итоговая сумма -->
        <div
          class="border-t border-gray-200 mt-6 pt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6"
        >
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="text-center">
                <div class="text-sm text-gray-600">Товаров</div>
                <div class="text-2xl font-bold text-gray-900">{{ basketItemsCount }}</div>
              </div>
              <div class="w-px h-12 bg-gray-300"></div>
              <div class="text-center">
                <div class="text-sm text-gray-600">Итого</div>
                <div class="text-3xl font-black text-indigo-600">
                  {{ products.basketTotal.toLocaleString() }} ₽
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <router-link
                to="/catalog"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 text-center"
              >
                Продолжить покупки
              </router-link>
              <button
                @click="showOrderModal = true"
                class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Оформить заказ
              </button>
            </div>
          </div>

          <!-- Дополнительная информация -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex flex-wrap gap-6 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <i class="bi bi-truck text-indigo-600"></i>
                <span>Бесплатная доставка от 10 000₽</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="bi bi-shield-check text-green-600"></i>
                <span>Безопасная оплата</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="bi bi-arrow-clockwise text-blue-600"></i>
                <span>Возврат в течение 14 дней</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Modal -->
      <div
        v-if="showOrderModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showOrderModal = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <button
              @click="showOrderModal = false"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-bold">Оформление заказа</h2>
            </div>
            <p class="text-indigo-100 text-sm">
              {{ products.basket.length }} товаров на сумму
              {{ products.basketTotal.toLocaleString() }} ₽
            </p>
          </div>

          <!-- Order Form -->
          <div class="p-6 overflow-y-auto max-h-96">
            <form @submit.prevent="submitOrder" class="space-y-6">
              <!-- Personal Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Личные данные</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Имя *</label>
                    <input
                      v-model="orderForm.name"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
                    <input
                      v-model="orderForm.phone"
                      type="tel"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    v-model="orderForm.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="ваш@email.com"
                  />
                </div>
              </div>

              <!-- Delivery -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Доставка</h3>

                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      v-model="orderForm.delivery"
                      type="radio"
                      value="pickup"
                      class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span class="ml-3 text-gray-700">Самовывоз из магазина</span>
                  </label>

                  <label class="flex items-center">
                    <input
                      v-model="orderForm.delivery"
                      type="radio"
                      value="courier"
                      class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span class="ml-3 text-gray-700">Курьерская доставка (300 ₽)</span>
                  </label>

                  <label class="flex items-center">
                    <input
                      v-model="orderForm.delivery"
                      type="radio"
                      value="post"
                      class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span class="ml-3 text-gray-700">Почта России (от 200 ₽)</span>
                  </label>
                </div>

                <div v-if="orderForm.delivery !== 'pickup'">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Адрес доставки *</label
                  >
                  <textarea
                    v-model="orderForm.address"
                    :required="orderForm.delivery !== 'pickup'"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Город, улица, дом, квартира"
                  ></textarea>
                </div>
              </div>

              <!-- Payment -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Оплата</h3>

                <div class="space-y-3">
                  <label
                    class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors"
                  >
                    <input
                      v-model="orderForm.payment"
                      type="radio"
                      value="card"
                      class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <div class="ml-3 flex items-center gap-3">
                      <div
                        class="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center"
                      >
                        <span class="text-white text-xs font-bold">💳</span>
                      </div>
                      <span class="text-gray-700 font-medium">Банковская карта</span>
                    </div>
                  </label>

                  <label
                    class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors"
                  >
                    <input
                      v-model="orderForm.payment"
                      type="radio"
                      value="cash"
                      class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <div class="ml-3 flex items-center gap-3">
                      <div
                        class="w-8 h-6 bg-gradient-to-r from-green-600 to-green-800 rounded flex items-center justify-center"
                      >
                        <span class="text-white text-xs font-bold">💵</span>
                      </div>
                      <span class="text-gray-700 font-medium">Наличными при получении</span>
                    </div>
                  </label>

                  <label
                    class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors"
                  >
                    <input
                      v-model="orderForm.payment"
                      type="radio"
                      value="transfer"
                      class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <div class="ml-3 flex items-center gap-3">
                      <div
                        class="w-8 h-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded flex items-center justify-center"
                      >
                        <span class="text-white text-xs font-bold">🏦</span>
                      </div>
                      <span class="text-gray-700 font-medium">Банковский перевод</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Comments -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Комментарий к заказу</label
                >
                <textarea
                  v-model="orderForm.comment"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Особые пожелания или комментарии..."
                ></textarea>
              </div>

              <!-- Order Summary -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 mb-3">Итого по заказу</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Товары ({{ products.basket.length }} шт.)</span>
                    <span>{{ products.basketTotal.toLocaleString() }} ₽</span>
                  </div>
                  <div v-if="orderForm.delivery === 'courier'" class="flex justify-between">
                    <span>Доставка</span>
                    <span>300 ₽</span>
                  </div>
                  <div v-if="orderForm.delivery === 'post'" class="flex justify-between">
                    <span>Доставка</span>
                    <span>от 200 ₽</span>
                  </div>
                  <div
                    class="border-t border-gray-300 pt-2 flex justify-between font-semibold text-gray-900"
                  >
                    <span>Итого</span>
                    <span
                      >{{
                        (
                          products.basketTotal +
                          (orderForm.delivery === 'courier'
                            ? 300
                            : orderForm.delivery === 'post'
                            ? 200
                            : 0)
                        ).toLocaleString()
                      }}
                      ₽</span
                    >
                  </div>
                </div>
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
                  Оформляем заказ...
                </span>
                <span v-else>Подтвердить заказ</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
