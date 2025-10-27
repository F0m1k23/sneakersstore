<script setup>
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const products = useProductsStore()
const auth = useAuthStore()
const router = useRouter()

// Состояния
const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

// Вычисляемые свойства
const basketItemsCount = computed(() => {
  return products.basket?.reduce((total, item) => total + item.quantity, 0) || 0
})

// Функции
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeAllModals = () => {
  isMobileMenuOpen.value = false
  isProfileMenuOpen.value = false
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const handleLogout = async () => {
  auth.logout()
  closeAllModals()
  window.showToast('Вы успешно вышли из системы', 'success')
  router.push('/')
}

const goToBasket = () => {
  router.push('/basket')
  closeAllModals()
}

// Очистка поиска при переходе на другие страницы
const clearSearchAndNavigate = (path) => {
  products.clearSearch()
  router.push(path)
  closeAllModals()
}

// Навигационные ссылки
const navLinks = [
  { name: 'Главная', path: '/' },
  { name: 'Каталог', path: '/catalog' },
  { name: 'FAQ', path: '/faq' },
]
</script>

<template>
  <header class="bg-white/90 backdrop-blur-lg border-b border-gray-200 fixed top-0 w-full z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Логотип -->
        <router-link
          to="/"
          class="flex items-center gap-3 group flex-shrink-0"
          @click="clearSearchAndNavigate('/')"
        >
          <div
            class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md"
          >
            <i class="bi bi-lightning-fill text-white text-sm"></i>
          </div>
          <span class="font-bold text-lg text-gray-900 hidden sm:block">SneakerStore</span>
        </router-link>

        <!-- Навигация для десктопа -->
        <nav class="hidden md:flex items-center gap-8">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            @click="clearSearchAndNavigate(link.path)"
            class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300 py-2 relative group"
          >
            {{ link.name }}
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"
            ></span>
          </router-link>
        </nav>

        <!-- Правая часть с иконками -->
        <div class="flex items-center gap-3">
          <!-- Корзина -->
          <button
            @click="goToBasket"
            class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-300 text-gray-600 hover:text-indigo-600"
          >
            <i class="bi bi-bag text-lg"></i>
            <span
              v-if="basketItemsCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
            >
              {{ basketItemsCount > 99 ? '99+' : basketItemsCount }}
            </span>
          </button>

          <!-- Аккаунт -->
          <div class="relative" v-if="auth.isLoggedIn">
            <button
              @click="toggleProfileMenu"
              class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-300 text-gray-600 hover:text-indigo-600"
            >
              <i class="bi bi-person text-lg"></i>
            </button>

            <!-- Выпадающее меню профиля -->
            <div
              v-if="isProfileMenuOpen"
              class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
            >
              <div class="px-4 py-2 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900">{{ auth.fullName }}</p>
                <p class="text-xs text-gray-500">{{ auth.user.email }}</p>
              </div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <i class="bi bi-box-arrow-right mr-2"></i>
                Выйти
              </button>
            </div>
          </div>

          <!-- Вход для неавторизованных -->
          <router-link
            v-else
            to="/login"
            class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-300 text-gray-600 hover:text-indigo-600"
            @click="closeAllModals"
          >
            <i class="bi bi-person text-lg"></i>
          </router-link>

          <!-- Кнопка мобильного меню -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-300 text-gray-600"
          >
            <i class="bi bi-list text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Мобильное меню -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden fixed inset-0 top-16 bg-black/50 backdrop-blur-sm z-40"
      @click="closeAllModals"
    >
      <div
        class="bg-white/95 backdrop-blur-xl border-t border-gray-200 animate-slide-down"
        @click.stop
      >
        <div class="max-w-7xl mx-auto px-4 py-4">
          <!-- Навигация -->
          <nav class="space-y-1">
            <router-link
              v-for="link in navLinks"
              :key="link.name"
              :to="link.path"
              @click="clearSearchAndNavigate(link.path)"
              class="block text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors py-3 px-4 rounded-lg"
            >
              {{ link.name }}
            </router-link>
            <button
              @click="goToBasket"
              class="w-full text-left block text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors py-3 px-4 rounded-lg"
            >
              Корзина
              <span
                v-if="basketItemsCount > 0"
                class="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {{ basketItemsCount }}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
