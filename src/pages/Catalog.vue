<script setup>
defineOptions({ name: 'CatalogPage' })
import { useProductsStore } from '@/stores/products'
import { onMounted, ref } from 'vue'
import Product from '../components/Product.vue'
import Search from '@/components/Search.vue'
import { Squares2X2Icon, Bars3Icon, ChevronDownIcon, FunnelIcon } from '@heroicons/vue/24/outline'

const products = useProductsStore()
const isSortOpen = ref(false)
const showFilters = ref(false)

onMounted(() => {
  products.getProducts()

  // Проверяем URL параметры для установки фильтров
  const urlParams = new URLSearchParams(window.location.search)
  const gender = urlParams.get('gender')
  if (gender) {
    products.filters.gender = gender
  }
})

const sortOptions = [
  { label: 'По умолчанию', value: '' },
  { label: 'По возрастанию цены', value: 'asc' },
  { label: 'По убыванию цены', value: 'desc' },
]

const selectSort = (option) => {
  products.sortOrder = option.value
  isSortOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Заголовок и описание -->
      <div class="text-center mb-8">
        <h1
          class="text-4xl font-bold bg-linear-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3"
        >
          Каталог обуви
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto text-lg">
          Откройте для себя коллекцию премиальной обуви от ведущих брендов
        </p>
      </div>

      <!-- Панель управления -->
      <div class="flex flex-col gap-6 mb-8">
        <!-- Верхняя часть: Поиск и кнопка фильтров для мобильных -->
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Поиск (показываем на всех экранах, но адаптируем) -->
          <div class="flex-1">
            <!-- <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4">
              <Search />
            </div> -->
          </div>

          <!-- Кнопка фильтров для мобильных -->
          <button
            v-if="!showFilters"
            @click="showFilters = !showFilters"
            class="lg:hidden flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <FunnelIcon class="w-5 h-5 text-gray-600" />
            <span class="font-medium text-gray-700">Фильтры</span>
            <div
              class="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center"
              v-if="
                products.filters.brands.length ||
                products.filters.sizes.length ||
                products.filters.price.current
              "
            >
              !
            </div>
          </button>
        </div>

        <!-- Нижняя часть: Сортировка и вид (только на больших экранах) -->
        <div class="hidden lg:flex items-center justify-between gap-4">
          <!-- Информация о товарах -->
          <div class="text-sm text-gray-500">
            Найдено {{ products.filterProducts.length }} товаров
          </div>

          <div class="flex items-center gap-3">
            <!-- Сортировка -->
            <div class="relative">
              <button
                @click="isSortOpen = !isSortOpen"
                class="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 min-w-40 justify-between"
              >
                <span class="text-gray-700 font-medium">
                  {{
                    sortOptions.find((o) => o.value === products.sortOrder)?.label || 'Сортировка'
                  }}
                </span>
                <ChevronDownIcon
                  class="w-4 h-4 text-gray-500 transition-transform duration-300"
                  :class="{ 'rotate-180': isSortOpen }"
                />
              </button>

              <!-- Выпадающий список сортировки -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div
                  v-if="isSortOpen"
                  class="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                >
                  <ul class="py-2">
                    <li
                      v-for="option in sortOptions"
                      :key="option.value"
                      @click="selectSort(option)"
                      class="px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 font-medium"
                      :class="{
                        'bg-blue-50 text-blue-600': products.sortOrder === option.value,
                      }"
                    >
                      {{ option.label }}
                    </li>
                  </ul>
                </div>
              </transition>
            </div>

            <!-- Переключение вида -->
            <div class="flex bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
              <button
                @click="products.viewMode = 'grid'"
                class="p-2 rounded-xl transition-all duration-300"
                :class="
                  products.viewMode === 'grid'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                "
              >
                <Squares2X2Icon class="w-5 h-5" />
              </button>

              <button
                @click="products.viewMode = 'list'"
                class="p-2 rounded-xl transition-all duration-300"
                :class="
                  products.viewMode === 'list'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                "
              >
                <Bars3Icon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Мобильная панель фильтров (коллапс) -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div v-if="showFilters" class="lg:hidden mb-6">
          <div class="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
            <Search />
          </div>
        </div>
      </transition>

      <!-- Основной контент -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Боковая панель фильтров (десктоп) -->
        <div class="hidden lg:block w-80 shrink-0">
          <Search />
        </div>

        <!-- Сетка товаров -->
        <div class="flex-1">
          <!-- Панель управления для мобильных -->
          <div class="lg:hidden flex flex-col gap-4 mb-6">
            <!-- Информация о товарах и сортировка -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">{{ products.filterProducts.length }} товаров</div>
              <div class="flex items-center gap-3">
                <!-- Сортировка -->
                <div class="relative">
                  <button
                    @click="isSortOpen = !isSortOpen"
                    class="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 min-w-32 justify-between"
                  >
                    <span class="text-gray-700 font-medium text-sm">
                      {{
                        sortOptions.find((o) => o.value === products.sortOrder)?.label ||
                        'Сортировка'
                      }}
                    </span>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-500 transition-transform duration-300"
                      :class="{ 'rotate-180': isSortOpen }"
                    />
                  </button>

                  <!-- Выпадающий список сортировки -->
                  <transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <div
                      v-if="isSortOpen"
                      class="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <ul class="py-2">
                        <li
                          v-for="option in sortOptions"
                          :key="option.value"
                          @click="selectSort(option)"
                          class="px-3 py-2 cursor-pointer transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 font-medium text-sm"
                          :class="{
                            'bg-blue-50 text-blue-600': products.sortOrder === option.value,
                          }"
                        >
                          {{ option.label }}
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>

                <!-- Переключение вида -->
                <div class="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                  <button
                    @click="products.viewMode = 'grid'"
                    class="p-1.5 rounded-lg transition-all duration-300"
                    :class="
                      products.viewMode === 'grid'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-400 hover:text-gray-600'
                    "
                  >
                    <Squares2X2Icon class="w-4 h-4" />
                  </button>

                  <button
                    @click="products.viewMode = 'list'"
                    class="p-1.5 rounded-lg transition-all duration-300"
                    :class="
                      products.viewMode === 'list'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-400 hover:text-gray-600'
                    "
                  >
                    <Bars3Icon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Состояние загрузки/пустой результат -->
          <div v-if="products.filterProducts.length === 0" class="text-center py-16">
            <div
              class="w-24 h-24 mx-auto mb-4 bg-linear-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center"
            >
              <span class="text-4xl">👟</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
            <p class="text-gray-600 max-w-md mx-auto">
              Попробуйте изменить параметры фильтрации или поисковый запрос
            </p>
          </div>

          <!-- Сетка товаров -->
          <div
            :class="[
              products.viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'
                : 'flex flex-col gap-4 lg:gap-6',
            ]"
          >
            <Product
              v-for="item in products.filterProducts"
              :key="item.id"
              :item="item"
              :viewMode="products.viewMode"
              @open-product="products.showProduct(item.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Кастомный скроллбар */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
