import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

/**
 * Pinia store для управления состоянием товаров и корзины покупок
 * Содержит всю логику работы с каталогом продуктов, фильтрами поиска и корзиной пользователя
 */
export const useProductsStore = defineStore('products', () => {
  // Основные состояния приложения
  const products = ref([]) // Массив всех товаров из каталога
  const product = ref(null) // Объект текущего просматриваемого товара
  const basket = ref([]) // Массив товаров в корзине пользователя
  const viewMode = ref('grid') // Режим отображения товаров (grid - сетка, list - список)

  // Параметры сортировки товаров в каталоге
  const sortOrder = ref('') // asc - по возрастанию цены, desc - по убыванию, '' - по умолчанию

  // Фильтры для поиска и фильтрации товаров в каталоге
  const filters = reactive({
    price: {
      current: null, // Максимальная цена для фильтрации товаров
    },
    brands: [], // Массив выбранных брендов для фильтрации
    sizes: [], // Массив выбранных размеров для фильтрации
    gender: null, // Пол (Men - мужские, Women - женские, Kids - детские)
    inStock: false, // Флаг показа только товаров в наличии
    searchQuery: '', // Текст для поиска по названию, бренду, цвету
  })

  // API функции для работы с каталогом товаров

  /**
   * Загрузка полного списка товаров из API сервера
   * Обновляет состояние products в store
   */
  const getProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/catalog')
      products.value = response.data
      console.log('Загружено товаров:', response.data.length)
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error)
    }
  }

  /**
   * Загрузка детальной информации о конкретном товаре
   * @param {number} id - Уникальный идентификатор товара
   */
  const showProduct = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/catalog/${id}`)
      product.value = response.data
      console.log('Загружен товар:', product.value)
    } catch (error) {
      console.error('Ошибка загрузки товара:', error)
    }
  }

  // Функции управления корзиной покупок

  /**
   * Добавление товара в корзину пользователя
   * Если товар уже есть в корзине с таким же размером, увеличивает количество
   * @param {Object} productData - Объект с данными товара
   * @param {number} size - Размер выбранного товара
   * @param {number} quantity - Количество добавляемых единиц (по умолчанию 1)
   */
  const addToBasket = async (productData, size, quantity = 1) => {
    // Поиск существующего товара в корзине с таким же ID и размером
    const existingItem = basket.value.find(
      (item) => item.product.id === productData.id && item.size === size,
    )

    if (existingItem) {
      // Увеличение количества существующего товара
      existingItem.quantity += quantity
      // Показать уведомление об обновлении количества
      window.showToast(`Количество товара "${productData.model}" обновлено`, 'info')
    } else {
      // Добавление нового товара в корзину
      basket.value.push({
        product: productData,
        size: size,
        quantity: quantity,
        addedAt: new Date().toISOString(), // Время добавления товара
      })
      // Показать уведомление о добавлении товара
      window.showToast(`"${productData.model}" добавлен в корзину`, 'success')
    }

    console.log('Корзина обновлена:', basket.value)
    // Сохранение корзины в localStorage для persistence
    localStorage.setItem('basket', JSON.stringify(basket.value))

    // Синхронизация с базой данных если пользователь авторизован
    await syncBasketToDatabase()
  }

  /**
   * Удаление товара из корзины по ID товара и размеру
   * @param {number} productId - Уникальный идентификатор товара
   * @param {number} size - Размер товара для удаления
   */
  const removeFromBasket = async (productId, size) => {
    // Найти товар для получения его названия перед удалением
    const itemToRemove = basket.value.find(
      (item) => item.product.id === productId && item.size === size,
    )

    if (itemToRemove) {
      // Фильтрация корзины, исключая товар с указанным ID и размером
      basket.value = basket.value.filter(
        (item) => !(item.product.id === productId && item.size === size),
      )
      localStorage.setItem('basket', JSON.stringify(basket.value))

      // Показать уведомление об удалении товара
      window.showToast(`"${itemToRemove.product.model}" удален из корзины`, 'warning')

      // Синхронизация с базой данных
      await syncBasketToDatabase()
    }
  }

  /**
   * Обновление количества конкретного товара в корзине
   * @param {number} productId - ID товара для обновления
   * @param {number} size - Размер товара
   * @param {number} newQuantity - Новое количество товара
   */
  const updateQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return // Не допускаем количество меньше 1

    // Поиск товара в корзине
    const item = basket.value.find((item) => item.product.id === productId && item.size === size)

    if (item) {
      item.quantity = newQuantity
      localStorage.setItem('basket', JSON.stringify(basket.value))

      // Синхронизация с базой данных
      await syncBasketToDatabase()
    }
  }

  /**
   * Полная очистка корзины покупок
   * Удаляет все товары и очищает localStorage
   */
  const clearBasket = async () => {
    basket.value = []
    localStorage.removeItem('basket')

    // Показать уведомление об очистке корзины
    window.showToast('Корзина очищена', 'info')

    // Синхронизация с базой данных
    await syncBasketToDatabase()
  }

  // Вычисляемые свойства для работы с корзиной

  /**
   * Вычисляемая общая стоимость всех товаров в корзине
   * Суммирует цену каждого товара умноженную на его количество
   */
  const basketTotal = computed(() => {
    return basket.value.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  })

  /**
   * Вычисляемое общее количество единиц товаров в корзине
   * Суммирует количества всех товаров
   */
  const basketItemsCount = computed(() => {
    return basket.value.reduce((count, item) => count + item.quantity, 0)
  })

  // Функции поиска и фильтрации товаров

  /**
   * Установка поискового запроса для фильтрации товаров
   * @param {string} query - Текст поискового запроса
   */
  const searchProducts = (query) => {
    filters.searchQuery = query.toLowerCase().trim()
  }

  /**
   * Очистка текущего поискового запроса
   * Сбрасывает фильтр поиска к пустому значению
   */
  const clearSearch = () => {
    filters.searchQuery = ''
  }
  /**
   * Вычисляемое свойство для комплексной фильтрации и сортировки товаров
   * Применяет все активные фильтры и параметры сортировки к списку товаров
   */
  const filterProducts = computed(() => {
    if (!products.value || !Array.isArray(products.value)) {
      return []
    }

    // Применение всех активных фильтров к товарам
    let result = products.value.filter((item) => {
      if (!item) return false

      // Текстовый поиск по нескольким полям товара
      if (filters.searchQuery) {
        const searchTerm = filters.searchQuery.toLowerCase()
        const inBrand = item.brand?.toLowerCase().includes(searchTerm)
        const inModel = item.model?.toLowerCase().includes(searchTerm)
        const inColor = item.color_name?.toLowerCase().includes(searchTerm)
        const inCategory = item.category?.toLowerCase().includes(searchTerm)

        // Товар должен соответствовать хотя бы одному полю поиска
        if (!inBrand && !inModel && !inColor && !inCategory) {
          return false
        }
      }

      // Фильтрация по выбранным брендам (если указаны)
      if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) {
        return false
      }

      // Фильтрация по максимальной цене
      if (filters.price.current && item.price > filters.price.current) {
        return false
      }

      // Фильтрация по выбранным размерам (если указаны)
      if (filters.sizes.length > 0 && !filters.sizes.includes(item.size)) {
        return false
      }

      // Фильтрация по полу (Men, Women, Kids)
      if (filters.gender && item.gender !== filters.gender) {
        return false
      }

      // Фильтрация по наличию на складе
      if (filters.inStock && !item.in_stock) {
        return false
      }

      return true
    })

    // Применение сортировки по цене если задана
    if (sortOrder.value === 'asc') {
      result.sort((a, b) => a.price - b.price) // По возрастанию цены
    } else if (sortOrder.value === 'desc') {
      result.sort((a, b) => b.price - a.price) // По убыванию цены
    }

    return result
  })

  /**
   * Загрузка содержимого корзины из localStorage при инициализации store
   * Восстанавливает корзину после перезагрузки страницы
   */
  const loadBasketFromStorage = () => {
    const savedBasket = localStorage.getItem('basket')
    if (savedBasket) {
      basket.value = JSON.parse(savedBasket)
    }
  }

  /**
   * Синхронизация корзины с базой данных
   * Отправляет текущую корзину на сервер если пользователь авторизован
   */
  const syncBasketToDatabase = async () => {
    // Импорт auth store для проверки авторизации
    const { useAuthStore } = await import('./auth')
    const auth = useAuthStore()

    if (!auth.isLoggedIn) return // Синхронизация только для авторизованных пользователей

    try {
      // Очистка старой корзины в БД
      await fetch('http://127.0.0.1:5000/basket', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })

      // Добавление всех товаров из текущей корзины
      for (const item of basket.value) {
        await fetch('http://127.0.0.1:5000/basket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            sneaker_id: item.product.id,
            size: item.size,
            quantity: item.quantity,
          }),
        })
      }
    } catch (error) {
      console.error('Ошибка синхронизации корзины:', error)
    }
  }

  // Инициализация store при первой загрузке
  loadBasketFromStorage()

  // Экспорт всех функций и состояний стора
  return {
    // Состояния
    products,
    product,
    basket,
    filters,
    sortOrder,
    viewMode,

    // API функции
    getProducts,
    showProduct,

    // Фильтрация и поиск
    filterProducts,
    searchProducts,
    clearSearch,

    // Управление корзиной
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,

    // Вычисляемые свойства корзины
    basketTotal,
    basketItemsCount,
  }
})
