<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { onMounted, ref, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const products = useProductsStore()
const selectedSize = ref(null)
const quantity = ref(1)
const selectedImageIndex = ref(0)
const isLoading = ref(true)

const product = computed(() => products.product || {})
const productImages = ref([])

onMounted(async () => {
  try {
    await products.showProduct(route.params.id)
    if (product.value.image_url) {
      productImages.value = [
        product.value.image_url,
        product.value.image_url,
        product.value.image_url,
        product.value.image_url,
      ]
    }
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    isLoading.value = false
  }
})

const selectSize = (size) => {
  selectedSize.value = size
}

const selectImage = (index) => {
  selectedImageIndex.value = index
}

const nextImage = () => {
  if (productImages.value.length > 0) {
    selectedImageIndex.value = (selectedImageIndex.value + 1) % productImages.value.length
  }
}

const prevImage = () => {
  if (productImages.value.length > 0) {
    selectedImageIndex.value =
      selectedImageIndex.value === 0 ? productImages.value.length - 1 : selectedImageIndex.value - 1
  }
}

const addToCart = async () => {
  if (!selectedSize.value) {
    alert('Пожалуйста, выберите размер')
    return
  }

  // Добавляем в корзину
  products.addToBasket(product.value, selectedSize.value, quantity.value)

  // Ждем следующего тика DOM для гарантии обновления состояния
  await new Promise((resolve) => setTimeout(resolve, 0))

  // Показываем уведомление и предлагаем переход
  if (confirm(`Товар "${product.value.model}" добавлен в корзину!\n\nПерейти в корзину?`)) {
    // Используем replace вместо push чтобы избежать накопления истории
  }
}

// Проверка наличия продукта
const hasProduct = computed(() => {
  return product.value && Object.keys(product.value).length > 0
})
</script>
<template>
  <div class="pt-28 pb-20 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Загрузка -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Загрузка товара...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="!hasProduct" class="text-center py-20">
        <i class="bi bi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Товар не найден</h2>
        <p class="text-gray-600 mb-6">Извините, запрашиваемый товар не существует.</p>
        <router-link
          to="/catalog"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Вернуться в каталог
        </router-link>
      </div>

      <!-- Контент товара -->
      <div v-else>
        <!-- Хлебные крошки -->
        <nav class="mb-8">
          <router-link to="/catalog" class="text-indigo-600 hover:text-indigo-800 transition">
            Каталог
          </router-link>
          <span class="mx-2 text-gray-400">/</span>
          <span class="text-gray-600">{{ product.brand || 'Бренд' }}</span>
          <span class="mx-2 text-gray-400">/</span>
          <span class="text-gray-900">{{ product.model || 'Модель' }}</span>
        </nav>

        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <!-- Изображение товара -->
          <div class="w-full lg:flex-1">
            <div
              class="bg-white rounded-2xl shadow-lg p-4 lg:p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <!-- Основное изображение -->
              <div class="relative">
                <div
                  class="bg-gray-100 rounded-xl h-80 lg:h-96 flex items-center justify-center overflow-hidden relative"
                >
                  <!-- Основное изображение -->
                  <img
                    v-if="productImages[selectedImageIndex]"
                    :src="productImages[selectedImageIndex]"
                    :alt="product.model || 'Товар'"
                    class="h-full w-full object-cover transition-opacity duration-300"
                  />
                  <div v-else class="text-center text-gray-400">
                    <i class="bi bi-image text-4xl lg:text-6xl block mb-4"></i>
                    <p class="text-base lg:text-lg">Изображение отсутствует</p>
                  </div>

                  <!-- Кнопки навигации (только если больше 1 изображения) -->
                  <template v-if="productImages.length > 1">
                    <button
                      @click="prevImage"
                      class="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      <i class="bi bi-chevron-left text-gray-700"></i>
                    </button>
                    <button
                      @click="nextImage"
                      class="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      <i class="bi bi-chevron-right text-gray-700"></i>
                    </button>
                  </template>

                  <!-- Индикатор текущего изображения -->
                  <div
                    v-if="productImages.length > 1"
                    class="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
                  >
                    <div
                      v-for="(image, index) in productImages"
                      :key="index"
                      @click="selectImage(index)"
                      :class="[
                        'w-2 h-2 lg:w-3 lg:h-3 rounded-full cursor-pointer transition-all',
                        index === selectedImageIndex
                          ? 'bg-indigo-600 scale-110'
                          : 'bg-white/80 hover:bg-white',
                      ]"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Миниатюры изображений -->
              <div class="flex gap-2 lg:gap-4 mt-4 lg:mt-6 justify-center overflow-x-auto">
                <div
                  v-for="(image, index) in productImages"
                  :key="index"
                  @click="selectImage(index)"
                  :class="[
                    'w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 rounded-lg cursor-pointer border-2 transition-all duration-200 overflow-hidden flex-shrink-0',
                    selectedImageIndex === index
                      ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105'
                      : 'border-transparent hover:border-indigo-400 hover:scale-105',
                  ]"
                >
                  <img
                    :src="image"
                    :alt="`${product.model || 'Товар'} - фото ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Заглушки для дополнительных изображений (если их меньше 4) -->
                <div
                  v-for="n in 4 - productImages.length"
                  :key="'placeholder-' + n"
                  class="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0"
                >
                  <i class="bi bi-image text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Информация о товаре -->
          <div class="w-full lg:flex-1">
            <div
              class="bg-white rounded-2xl shadow-lg p-4 lg:p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <!-- Бренд и модель -->
              <div class="mb-6">
                <span class="text-sm font-medium text-indigo-600 uppercase tracking-wide">
                  {{ product.brand || 'Бренд' }}
                </span>
                <h1 class="text-3xl font-bold text-gray-900 mt-2">
                  {{ product.model || 'Модель' }}
                </h1>
                <p class="text-gray-500 mt-1">{{ product.color_name || 'Цвет не указан' }}</p>
              </div>

              <!-- Цена -->
              <div class="mb-6">
                <p class="text-3xl font-semibold text-indigo-600">
                  {{ (product.price || 0).toLocaleString() }} ₽
                </p>
                <p v-if="product.in_stock" class="text-green-600 mt-2 flex items-center">
                  <i class="bi bi-check-circle-fill mr-2"></i>
                  В наличии
                </p>
                <p v-else class="text-red-600 mt-2 flex items-center">
                  <i class="bi bi-x-circle-fill mr-2"></i>
                  Нет в наличии
                </p>
              </div>

              <!-- Размеры -->
              <div class="mb-4 lg:mb-6">
                <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                  Выберите размер:
                </h3>
                <div class="flex flex-wrap gap-2 lg:gap-3">
                  <button
                    v-for="size in [40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45]"
                    :key="size"
                    @click="selectSize(size)"
                    :class="[
                      'w-12 h-10 lg:w-16 lg:h-12 rounded-lg border-2 transition-all duration-200 font-medium text-sm lg:text-base transform hover:scale-105',
                      selectedSize === size
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                        : 'border-gray-300 hover:border-indigo-400 text-gray-700 hover:shadow-md',
                    ]"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Количество и кнопка -->
              <div class="mb-4 lg:mb-6">
                <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-6">
                  <div class="flex items-center border border-gray-300 rounded-lg self-start">
                    <button
                      @click="quantity > 1 ? quantity-- : null"
                      :class="[
                        'px-3 lg:px-4 py-2 lg:py-3 text-base lg:text-lg font-medium transition',
                        quantity > 1
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-400 cursor-not-allowed',
                      ]"
                    >
                      -
                    </button>
                    <span class="px-3 lg:px-4 py-2 lg:py-3 text-base lg:text-lg font-medium">{{
                      quantity
                    }}</span>
                    <button
                      @click="quantity++"
                      class="px-3 lg:px-4 py-2 lg:py-3 text-base lg:text-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    @click="addToCart"
                    :disabled="!product.in_stock || !selectedSize"
                    :class="[
                      'flex-1 bg-indigo-600 text-white py-3 rounded-xl text-base lg:text-lg font-medium transition',
                      !product.in_stock || !selectedSize
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-indigo-700',
                    ]"
                  >
                    {{ product.in_stock ? 'Добавить в корзину' : 'Нет в наличии' }}
                  </button>
                </div>
              </div>

              <!-- Детали товара -->
              <div class="border-t border-gray-200 pt-4 lg:pt-6">
                <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                  О товаре
                </h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">Категория:</span>
                    <p class="text-gray-900 font-medium">{{ product.category || 'Не указана' }}</p>
                  </div>
                  <div>
                    <span class="text-gray-500">Состояние:</span>
                    <p class="text-gray-900 font-medium">{{ product.condition || 'Не указано' }}</p>
                  </div>
                  <div>
                    <span class="text-gray-500">Год выпуска:</span>
                    <p class="text-gray-900 font-medium">
                      {{ product.release_year || 'Не указан' }}
                    </p>
                  </div>
                  <div>
                    <span class="text-gray-500">Цвет:</span>
                    <p class="text-gray-900 font-medium">{{ product.color_name || 'Не указан' }}</p>
                  </div>
                </div>

                <!-- Описание -->
                <div class="mt-4 lg:mt-6">
                  <span class="text-gray-500 text-sm">Описание:</span>
                  <p class="text-gray-900 mt-2 leading-relaxed text-sm lg:text-base">
                    {{ product.description || 'Описание отсутствует' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
