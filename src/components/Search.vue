
<script setup>
import { ref, watch } from 'vue'
import { useProductsStore } from '@/stores/products'

const products = useProductsStore()
const isExpanded = ref(false)
const searchQuery = ref('')

const brands = ['Nike', 'Adidas', 'New Balance', 'Puma', 'Reebok']
const filters = products.filters

watch(searchQuery, (newVal) => {
  products.searchProducts(newVal)
})

const handlePriceChange = (event) => {
  filters.price.current = Number(event.target.value)
}

const resetFilters = () => {
  filters.price.current = null
  filters.brands = []
  filters.sizes = []
  filters.inStock = false
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 max">
    <!-- Поисковая строка -->
    <div class="relative mb-6">
      <i class="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по каталогу..."
        class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-300"
      />
    </div>

    <!-- Переключение фильтров -->
    <button
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors mb-4"
    >
      <span class="font-semibold text-gray-900">Фильтры и сортировка</span>
      <i
        class="bi transition-transform duration-300"
        :class="isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"
      ></i>
    </button>

    <!-- Раскрывающиеся фильтры -->
    <div v-if="isExpanded" class="space-y-6 animate-fade-in">
      <!-- Цена -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="bi bi-tag"></i>
          Цена
        </h3>
        <input
          type="range"
          min="0"
          max="50000"
          step="1000"
          :value="filters.price.current || 0"
          @input="handlePriceChange"
          class="w-full h-2 bg-gray-300 rounded-lg accent-indigo-600 mb-4"
        />
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">0 ₽</span>
          <div class="text-center">
            <div class="text-lg font-bold text-indigo-600">
              {{ (filters.price.current || 0).toLocaleString() }} ₽
            </div>
            <div class="text-xs text-gray-500">макс. 50 000 ₽</div>
          </div>
          <span class="text-sm text-gray-600">50 000 ₽</span>
        </div>
      </div>

      <!-- Бренды -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="bi bi-star"></i>
          Бренд
        </h3>
        <div class="space-y-3">
          <label
            v-for="brand in brands"
            :key="brand"
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div class="relative">
              <input
                v-model="filters.brands"
                type="checkbox"
                class="w-5 h-5 text-indigo-600 rounded-lg border-gray-300 focus:ring-indigo-500"
                :value="brand"
              />
            </div>
            <span class="text-gray-700 group-hover:text-gray-900 font-medium">{{ brand }}</span>
            <span class="text-gray-400 text-sm ml-auto"
              >({{ Math.floor(Math.random() * 50) + 10 }})</span
            >
          </label>
        </div>
      </div>

      <!-- Размеры -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="bi bi-rulers"></i>
          Размер
        </h3>
        <div class="grid grid-cols-4 gap-2">
          <label
            v-for="size in [40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45]"
            :key="size"
            class="flex items-center justify-center p-3 border-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            :class="
              filters.sizes.includes(size)
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg transform scale-105'
                : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50'
            "
          >
            <input type="checkbox" class="hidden" :value="size" v-model="filters.sizes" />
            <span>{{ size }}</span>
          </label>
        </div>
      </div>

      <!-- Пол -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="bi bi-person"></i>
          Пол
        </h3>
        <div class="space-y-3">
          <label
            v-for="gender in [
              { value: 'Men', label: 'Мужские' },
              { value: 'Women', label: 'Женские' },
              { value: 'Kids', label: 'Детские' },
            ]"
            :key="gender.value"
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <input
              type="radio"
              :value="gender.value"
              v-model="filters.gender"
              class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span class="font-medium text-gray-700">{{ gender.label }}</span>
          </label>
        </div>
      </div>

      <!-- Наличие -->
      <div class="border-t border-gray-200 pt-6">
        <label
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <input
            type="checkbox"
            class="w-5 h-5 text-indigo-600 rounded-lg border-gray-300 focus:ring-indigo-500"
            v-model="filters.inStock"
          />
          <span class="font-medium text-gray-700">Только в наличии</span>
          <i class="bi bi-check2-circle text-green-500 ml-auto"></i>
        </label>
      </div>

      <!-- Кнопки действий -->
      <div class="border-t border-gray-200 pt-6 flex gap-3">
        <button
          @click="$emit('apply-filters')"
          class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Применить
        </button>
        <button
          @click="resetFilters"
          class="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
        >
          Сбросить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
