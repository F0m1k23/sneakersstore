<script setup>
import { ref } from 'vue'
import { useProductsStore } from '@/stores/products'

const products = useProductsStore()
const emit = defineEmits(['open-product'])
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  viewMode: {
    type: String,
    default: 'grid',
  },
})

const isHovered = ref(false)
const quickAddLoading = ref(false)

// Открыть страницу продукта
const handleClick = () => {
  emit('open-product', props.item.id)
}

// Быстрое добавление в корзину
const quickAddToCart = async (event) => {
  event.preventDefault()
  event.stopPropagation()
  quickAddLoading.value = true

  setTimeout(() => {
    products.addToBasket(props.item, props.item.size || 42, 1) // размер по умолчанию
    quickAddLoading.value = false
  }, 800)
}

// Цвет рейтинга
const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'from-green-500 to-emerald-600'
  if (rating >= 4.0) return 'from-yellow-500 to-amber-600'
  return 'from-orange-500 to-red-600'
}
</script>

<template>
  <router-link
    @click="handleClick"
    :to="{ name: 'Product', params: { id: props.item.id } }"
    class="group bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-200 hover:border-indigo-200 relative"
    :class="viewMode === 'list' ? 'flex items-center gap-6 p-6' : ''"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="relative">
      <!-- Изображение -->
      <div class="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          class="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
          :src="props.item.image_url"
          :alt="props.item.brand"
        />

        <!-- Бейджи -->
        <div class="absolute top-4 left-4 flex flex-col gap-2">
          <span
            v-if="props.item.is_new"
            class="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
            >NEW</span
          >

          <span
            v-if="props.item.rating > 4.7"
            class="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
            >HOT</span
          >
        </div>

        <!-- Рейтинг -->
        <div
          v-if="props.item.rating"
          class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg"
        >
          <div class="flex items-center gap-1 text-sm font-bold">
            <i class="bi bi-star-fill text-yellow-400"></i>
            <span>{{ props.item.rating }}</span>
          </div>
        </div>

        <!-- Кнопка быстрого добавления -->
        <button
          @click="quickAddToCart"
          :disabled="quickAddLoading"
          :class="[
            'absolute bottom-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 transform',
            quickAddLoading
              ? 'bg-green-500 text-white translate-y-0 opacity-100'
              : isHovered
              ? 'bg-indigo-600 text-white translate-y-0 opacity-100'
              : 'bg-white/90 text-gray-700 translate-y-4 opacity-0',
          ]"
        >
          <i v-if="quickAddLoading" class="bi bi-check-lg"></i>
          <i v-else class="bi bi-cart-plus"></i>
        </button>

        <!-- Наличие -->
        <div class="absolute bottom-4 left-4">
          <span
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-bold shadow-lg',
              props.item.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
            ]"
          >
            {{ props.item.in_stock ? 'В наличии' : 'Нет в наличии' }}
          </span>
        </div>
      </div>

      <!-- Информация -->
      <div class="p-6">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{{
            props.item.brand
          }}</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{
            props.item.category
          }}</span>
        </div>

        <h3
          class="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight"
        >
          {{ props.item.model }}
        </h3>

        <p class="text-gray-500 text-sm mb-4 line-clamp-1">{{ props.item.color_name }}</p>

        <div class="flex justify-between items-center">
          <div>
            <span class="text-2xl font-black text-gray-900"
              >{{ props.item.price?.toLocaleString() }} ₽</span
            >
            <span v-if="props.item.old_price" class="text-sm text-gray-500 line-through ml-2"
              >{{ props.item.old_price?.toLocaleString() }} ₽</span
            >
          </div>

          <button
            @click.prevent="handleClick"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
      <div
        class="relative w-full lg:w-48 h-48 lg:h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex-shrink-0"
      >
        <img
          class="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
          :src="props.item.image_url"
          :alt="props.item.brand"
        />
      </div>

      <div class="flex-1 min-w-0 w-full">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3 gap-3">
          <div class="flex-1">
            <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{{
              props.item.brand
            }}</span>
            <h3
              class="font-bold text-gray-900 text-lg lg:text-xl mb-2 group-hover:text-indigo-600 transition-colors"
            >
              {{ props.item.model }}
            </h3>
            <p class="text-gray-500 text-sm">{{ props.item.color_name }}</p>
          </div>

          <div
            v-if="props.item.rating"
            class="bg-gradient-to-br rounded-2xl px-3 lg:px-4 py-2 lg:py-3 text-white shadow-lg self-start"
            :class="getRatingColor(props.item.rating)"
          >
            <div class="flex items-center gap-1 text-sm font-bold">
              <i class="bi bi-star-fill"></i>
              <span>{{ props.item.rating }}</span>
            </div>
          </div>
        </div>

        <p class="text-gray-600 mb-4 line-clamp-2 text-sm">{{ props.item.description }}</p>

        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <span class="text-2xl lg:text-3xl font-black text-gray-900"
              >{{ props.item.price?.toLocaleString() }} ₽</span
            >
            <span
              v-if="props.item.in_stock"
              class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium self-start"
              >В наличии</span
            >
          </div>

          <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <button
              @click.prevent="quickAddToCart"
              :disabled="quickAddLoading"
              :class="[
                'px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                quickAddLoading
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700',
              ]"
            >
              <i v-if="quickAddLoading" class="bi bi-check-lg"></i>
              <i v-else class="bi bi-cart-plus"></i>
              <span>{{ quickAddLoading ? 'Добавлено' : 'В корзину' }}</span>
            </button>

            <button
              @click.prevent="handleClick"
              class="px-4 lg:px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
