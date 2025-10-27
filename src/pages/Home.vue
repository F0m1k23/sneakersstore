<script setup>
import { useProductsStore } from '@/stores/products'
import { onMounted, computed, ref } from 'vue'

const products = useProductsStore()
const animatedCounters = ref({
  customers: 0,
  brands: 0,
  support: 0,
})

onMounted(() => {
  products.getProducts()
  startCounterAnimation()
})

const startCounterAnimation = () => {
  const targetValues = { customers: 5000, brands: 200, support: 24 }
  const duration = 2000
  const steps = 60
  const stepDuration = duration / steps

  Object.keys(targetValues).forEach((key) => {
    let current = 0
    const increment = targetValues[key] / steps
    const timer = setInterval(() => {
      current += increment
      if (current >= targetValues[key]) {
        animatedCounters.value[key] = targetValues[key]
        clearInterval(timer)
      } else {
        animatedCounters.value[key] = Math.floor(current)
      }
    }, stepDuration)
  })
}

const popularProducts = computed(() => {
  return [...products.products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 4)
    .map((product) => ({
      ...product,
      rating: (Math.random() * 0.5 + 4.5).toFixed(1),
      reviews: Math.floor(Math.random() * 100) + 50,
    }))
})

const categories = [
  {
    name: 'Мужские',
    image:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Стильные модели для мужчин',
    count: '125+ моделей',
    gradient: 'from-blue-500 to-indigo-600',
    path: '/catalog?gender=Men',
  },
  {
    name: 'Женские',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Элегантные и удобные',
    count: '98+ моделей',
    gradient: 'from-pink-500 to-purple-600',
    path: '/catalog?gender=Women',
  },
  {
    name: 'Детские',
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Яркие и комфортные',
    count: '75+ моделей',
    gradient: 'from-green-500 to-teal-600',
    path: '/catalog?gender=Kids',
  },
]

const features = [
  {
    icon: '🚚',
    title: 'Бесплатная доставка',
    description: 'При заказе от 10 000₽',
    color: 'text-blue-400',
  },
  {
    icon: '🔄',
    title: 'Легкий возврат',
    description: '14 дней на возврат',
    color: 'text-green-400',
  },
  {
    icon: '🔒',
    title: 'Безопасная оплата',
    description: 'Разные способы оплаты',
    color: 'text-purple-400',
  },
  {
    icon: '⭐',
    title: 'Гарантия качества',
    description: 'Только оригинальная продукция',
    color: 'text-yellow-400',
  },
]

const quickAddToCart = async (product, event) => {
  event.preventDefault()
  event.stopPropagation()

  const button = event.target
  const originalContent = button.innerHTML
  button.innerHTML = '<i class="bi bi-check-lg"></i>'
  button.classList.add('bg-green-500', 'hover:bg-green-600')

  setTimeout(() => {
    button.innerHTML = originalContent
    button.classList.remove('bg-green-500', 'hover:bg-green-600')
  }, 2000)
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- HERO SECTION -->
    <section
      class="pt-20 pb-28 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden"
    >
      <!-- Анимированный фон -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 animate-pulse"
        ></div>
        <div
          class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-30 animate-pulse"
          style="animation-delay: 1s"
        ></div>
        <div
          class="absolute top-1/2 left-1/4 w-40 h-40 bg-pink-200 rounded-full opacity-20 animate-bounce"
          style="animation-delay: 0.5s"
        ></div>
      </div>

      <div
        class="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10"
      >
        <!-- Текстовая часть -->
        <div class="flex-1 text-center lg:text-left">
          <!-- Бейдж -->
          <div
            class="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-indigo-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg border border-indigo-100"
          >
            <div class="w-3 h-3 bg-indigo-600 rounded-full animate-ping"></div>
            <span>Новые коллекции 2024</span>
          </div>

          <!-- Заголовок -->
          <h1
            class="text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-tight mb-6"
          >
            Найди свой
            <span
              class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient"
            >
              уникальный
            </span>
            стиль
          </h1>

          <!-- Описание -->
          <p class="text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed font-light">
            Откройте мир премиальных кроссовок от ведущих брендов.
            <span class="font-semibold text-indigo-600">Бесплатная доставка</span> при заказе от 10
            000₽
          </p>

          <!-- Кнопки -->
          <div class="flex flex-col sm:flex-row gap-5 mb-12">
            <router-link
              to="/catalog"
              class="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden"
            >
              <span class="relative z-10">Начать покупки</span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </router-link>

            <button
              @click="scrollToSection('popular')"
              class="group border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-2xl text-lg font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 text-center flex items-center justify-center gap-3"
            >
              <span>Популярное</span>
              <i class="bi bi-arrow-down group-hover:translate-y-1 transition-transform"></i>
            </button>
          </div>

          <!-- Быстрые преимущества -->
          <div class="flex flex-wrap gap-6 mb-12">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="flex items-center gap-3 text-gray-600"
            >
              <span class="text-2xl">{{ feature.icon }}</span>
              <div>
                <div class="font-semibold text-gray-900">{{ feature.title }}</div>
                <div class="text-sm">{{ feature.description }}</div>
              </div>
            </div>
          </div>

          <!-- Статистика -->
          <div class="flex gap-12 justify-center lg:justify-start">
            <div
              v-for="stat in [
                { value: animatedCounters.customers, label: 'Довольных клиентов', suffix: '+' },
                { value: animatedCounters.brands, label: 'Брендов', suffix: '+' },
                { value: animatedCounters.support, label: 'Поддержка', suffix: '/7' },
              ]"
              :key="stat.label"
              class="text-center"
            >
              <div class="text-3xl font-bold text-gray-900 mb-1">
                {{ stat.value }}{{ stat.suffix }}
              </div>
              <div class="text-gray-600 text-sm font-medium">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Изображение героя -->
        <div class="flex-1 relative">
          <div class="relative">
            <!-- Основное изображение -->
            <div
              class="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700 group"
            >
              <img
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                class="w-full h-[600px] object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Кроссовки премиум класса"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <!-- Плавающие карточки -->
            <div
              class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs animate-float"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <span class="text-2xl">⭐</span>
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-lg">Лучшие бренды</div>
                  <div class="text-sm text-gray-600 mt-1">Nike, Adidas, New Balance</div>
                </div>
              </div>
            </div>

            <div
              class="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs animate-float"
              style="animation-delay: 2s"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <span class="text-2xl">🏆</span>
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-lg">Премиум качество</div>
                  <div class="text-sm text-gray-600 mt-1">100% оригинальная продукция</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BRANDS SECTION -->
    <section class="py-16 bg-gradient-to-r from-gray-50 to-indigo-50 border-y border-gray-200/50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center text-gray-500 text-sm font-semibold mb-8 tracking-wider">
          НАШИ ОСНОВНЫЕ БРЕНДЫ
        </div>
        <div
          class="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-70 hover:opacity-100 transition-opacity duration-300"
        >
          <div
            v-for="brand in ['NIKE', 'ADIDAS', 'NEW BALANCE', 'PUMA', 'REEBOK', 'JORDAN']"
            :key="brand"
            class="text-3xl font-black text-gray-800 hover:text-indigo-600 transition-colors duration-300 transform hover:scale-110 cursor-pointer"
          >
            {{ brand }}
          </div>
        </div>
      </div>
    </section>

    <!-- POPULAR PRODUCTS -->
    <section id="popular" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <!-- Бейдж секции -->
          <div
            class="inline-flex items-center gap-3 bg-indigo-100 text-indigo-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <div class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
            Самые популярные
          </div>

          <!-- Заголовок -->
          <h2 class="text-5xl font-black text-gray-900 mb-6">Бестселлеры сезона</h2>
          <p class="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Модели, которые выбирают наши клиенты чаще всего. Проверенное качество и стиль.
          </p>
        </div>

        <!-- Продукты -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <router-link
            v-for="item in popularProducts"
            :key="item.id"
            :to="{ name: 'Product', params: { id: item.id } }"
            class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200 relative"
          >
            <!-- Контейнер изображения -->
            <div
              class="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden"
            >
              <!-- Изображение -->
              <img
                v-if="item.image_url"
                :src="item.image_url"
                :alt="item.name"
                class="max-h-52 object-contain group-hover:scale-110 transition-transform duration-700"
              />
              <div v-else class="text-center text-gray-400">
                <i class="bi bi-image text-5xl block mb-3"></i>
                <span class="text-sm">Нет изображения</span>
              </div>

              <!-- Бейдж популярности -->
              <div class="absolute top-4 left-4">
                <span
                  class="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                >
                  ПОПУЛЯРНО
                </span>
              </div>

              <!-- Рейтинг -->
              <div
                class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg"
              >
                <div class="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  <i class="bi bi-star-fill text-yellow-400"></i>
                  <span>{{ item.rating }}</span>
                  <span class="text-gray-400">({{ item.reviews }})</span>
                </div>
              </div>

              <!-- Кнопка быстрого добавления -->
              <button
                @click="quickAddToCart(item, $event)"
                class="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <i class="bi bi-cart-plus text-lg"></i>
              </button>
            </div>

            <!-- Информация о товаре -->
            <div class="p-6">
              <!-- Бренд и статус -->
              <div class="flex justify-between items-start mb-3">
                <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  {{ item.brand }}
                </span>
                <span
                  v-if="item.in_stock"
                  class="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium"
                >
                  В наличии
                </span>
              </div>

              <!-- Название и описание -->
              <h3
                class="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight"
              >
                {{ item.model }}
              </h3>
              <p class="text-gray-500 text-sm mb-4 line-clamp-1">{{ item.color_name }}</p>

              <!-- Цена и действие -->
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-2xl font-black text-gray-900"
                    >{{ item.price?.toLocaleString() }} ₽</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500 line-through" v-if="item.price > 10000">
                    {{ (item.price * 1.2).toLocaleString() }} ₽
                  </span>
                </div>
              </div>
            </div>

            <!-- Ховер эффект -->
            <div
              class="absolute inset-0 border-2 border-transparent group-hover:border-indigo-200 rounded-3xl transition-all duration-300 pointer-events-none"
            ></div>
          </router-link>
        </div>

        <!-- Кнопка перехода -->
        <div class="text-center">
          <router-link
            to="/catalog"
            class="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <span>Смотреть всю коллекцию</span>
            <i
              class="bi bi-arrow-right group-hover:translate-x-2 transition-transform duration-300"
            ></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section id="categories" class="py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-5xl font-black text-gray-900 mb-6">Категории</h2>
          <p class="text-gray-600 text-xl">Выберите подходящую категорию для вашего стиля</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <router-link
            v-for="(category, index) in categories"
            :key="category.name"
            :to="category.path"
            class="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:-translate-y-2 hover:rotate-1"
            :style="`animation-delay: ${index * 200}ms;`"
          >
            <div class="relative h-96 overflow-hidden">
              <!-- Изображение -->
              <img
                :src="category.image"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <!-- Градиент -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
              ></div>

              <!-- Контент -->
              <div class="absolute bottom-8 left-8 text-white">
                <div class="mb-4">
                  <div class="text-3xl font-black mb-2">{{ category.name }}</div>
                  <p class="text-gray-200 text-lg mb-3">{{ category.description }}</p>
                  <div class="text-gray-300 font-medium">{{ category.count }}</div>
                </div>

                <!-- Кнопка -->
                <div
                  class="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300"
                >
                  <span>Смотреть</span>
                  <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              <!-- Акцентный уголок -->
              <div
                class="absolute top-6 right-6 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <i class="bi bi-arrow-up-right text-white text-xl"></i>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ADVANTAGES -->
    <section
      id="advantages"
      class="py-24 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden"
    >
      <!-- Фон -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="text-center mb-20">
          <h2 class="text-5xl font-black mb-6">Почему выбирают нас</h2>
          <p class="text-gray-300 text-xl">Мы заботимся о каждом клиенте и качестве обслуживания</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(feature, index) in [
              {
                icon: '🚚',
                title: 'Быстрая доставка',
                description: 'Доставляем по всей стране за 1-3 дня. Бесплатная доставка от 10 000₽',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: '🛡️',
                title: 'Гарантия подлинности',
                description: 'Только 100% оригинальная продукция с гарантией от производителя',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: '🔄',
                title: 'Легкий возврат',
                description: 'Возврат и обмен в течение 14 дней без лишних вопросов',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: '💎',
                title: 'Премиум сервис',
                description: 'Персональный подход к каждому клиенту и круглосуточная поддержка',
                color: 'from-orange-500 to-red-500',
              },
            ]"
            :key="feature.title"
            class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group transform hover:-translate-y-2"
            :style="`animation-delay: ${index * 100}ms;`"
          >
            <!-- Иконка -->
            <div class="relative mb-6">
              <div
                class="w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
                :class="feature.color"
              >
                <span class="text-2xl">{{ feature.icon }}</span>
              </div>
            </div>

            <!-- Контент -->
            <h3 class="text-xl font-bold mb-4 group-hover:text-white transition-colors">
              {{ feature.title }}
            </h3>
            <p class="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
              {{ feature.description }}
            </p>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-16">
          <router-link
            to="/catalog"
            class="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <span>Начать покупки</span>
            <i class="bi bi-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="py-24 bg-gradient-to-br from-white to-indigo-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <div
            class="inline-flex items-center gap-3 bg-indigo-100 text-indigo-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <div class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
            Отзывы клиентов
          </div>
          <h2 class="text-5xl font-black text-gray-900 mb-6">Что говорят о нас</h2>
          <p class="text-gray-600 text-xl max-w-2xl mx-auto">
            Реальные отзывы наших довольных клиентов
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(testimonial, index) in [
              {
                name: 'Анна К.',
                avatar:
                  'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
                rating: 5,
                text: 'Отличный магазин! Быстрая доставка, качественные кроссовки. Все как в описании. Рекомендую!',
                date: '2 недели назад',
              },
              {
                name: 'Михаил П.',
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
                rating: 5,
                text: 'Заказал Nike Air Max, пришел через 2 дня. Качество на высоте, менеджеры помогли с выбором размера.',
                date: '1 месяц назад',
              },
              {
                name: 'Елена С.',
                avatar:
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
                rating: 5,
                text: 'Удобный сайт, отличный выбор. Возврат прошел без проблем. Буду заказывать еще!',
                date: '3 недели назад',
              },
            ]"
            :key="testimonial.name"
            class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
            :style="`animation-delay: ${index * 200}ms;`"
          >
            <!-- Рейтинг -->
            <div class="flex items-center gap-1 mb-4">
              <div v-for="star in testimonial.rating" :key="star" class="text-yellow-400">
                <i class="bi bi-star-fill"></i>
              </div>
            </div>

            <!-- Текст отзыва -->
            <p class="text-gray-700 mb-6 leading-relaxed italic">"{{ testimonial.text }}"</p>

            <!-- Автор -->
            <div class="flex items-center gap-4">
              <img
                :src="testimonial.avatar"
                :alt="testimonial.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div class="font-bold text-gray-900">{{ testimonial.name }}</div>
                <div class="text-sm text-gray-500">{{ testimonial.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section
      class="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden"
    >
      <!-- Фон -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-72 h-72 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div class="mb-8">
          <div
            class="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-6"
          >
            <i class="bi bi-envelope"></i>
            Подпишись на новости
          </div>
          <h2 class="text-4xl lg:text-5xl font-black mb-6">Будь в курсе новинок</h2>
          <p class="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Подпишись на нашу рассылку и получай первыми информацию о новых коллекциях, эксклюзивных
            скидках и специальных предложениях
          </p>
        </div>

        <!-- Форма подписки -->
        <div class="max-w-md mx-auto">
          <div class="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Ваш email адрес"
              class="flex-1 px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
            <button
              class="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Подписаться
            </button>
          </div>
          <p class="text-sm text-indigo-200 mt-4">
            Подписываясь, вы соглашаетесь с политикой конфиденциальности
          </p>
        </div>
      </div>
    </section>
  </div>
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
