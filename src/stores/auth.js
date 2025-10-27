import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

/**
 * Pinia store для управления аутентификацией пользователей
 * Обрабатывает вход, выход, регистрацию и управление профилем пользователя
 */
export const useAuthStore = defineStore('auth', () => {
  // Основные состояния аутентификации пользователя
  const user = ref(null) // Объект с данными текущего авторизованного пользователя
  const token = ref(localStorage.getItem('token') || null) // JWT токен для API запросов
  const isAuthenticated = ref(!!token.value) // Булево значение статуса аутентификации
  const isLoading = ref(false) // Флаг отображения индикатора загрузки

  // Вычисляемые свойства для удобного доступа к данным пользователя
  const isLoggedIn = computed(() => !!user.value) // Проверка авторизации пользователя
  const isAdmin = computed(() => user.value?.is_admin || false) // Проверка прав администратора
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim()
  }) // Полное имя пользователя

  // Настройка axios для автоматического добавления JWT токена к запросам
  axios.interceptors.request.use(
    (config) => {
      if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}` // Добавление токена в заголовок Authorization
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Перехват ответов для обработки ошибок аутентификации
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout() // Автоматический выход при истечении токена
      }
      return Promise.reject(error)
    },
  )

  /**
   * Аутентификация пользователя в системе
   * @param {string} email - Email адрес пользователя
   * @param {string} password - Пароль пользователя
   * @returns {Promise<{success: boolean, message: string}>} Результат входа
   */
  const login = async (email, password) => {
    isLoading.value = true
    try {
      // Отправка запроса на сервер для аутентификации
      const response = await axios.post('https://flaskserver-98pw.onrender.com/auth/login', {
        email,
        password,
      })

      // Сохранение полученных данных аутентификации в store
      token.value = response.data.access_token
      user.value = response.data.user
      isAuthenticated.value = true

      // Сохранение токена в localStorage для persistence между сессиями
      localStorage.setItem('token', token.value)

      return { success: true, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Ошибка входа в систему',
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Регистрация нового пользователя в системе
   * @param {Object} userData - Объект с данными нового пользователя (email, password, first_name, etc.)
   * @returns {Promise<{success: boolean, message: string}>} Результат регистрации
   */
  const register = async (userData) => {
    isLoading.value = true
    try {
      // Отправка данных для создания нового аккаунта
      const response = await axios.post(
        'https://flaskserver-98pw.onrender.com/auth/register',
        userData,
      )

      // Автоматический вход пользователя после успешной регистрации
      token.value = response.data.access_token
      user.value = response.data.user
      isAuthenticated.value = true

      localStorage.setItem('token', token.value)

      return { success: true, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Ошибка регистрации',
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Выход пользователя из системы с очисткой всех данных аутентификации
   */
  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token') // Удаление токена из хранилища браузера
  }

  /**
   * Проверка валидности сохраненного токена при загрузке приложения
   * Выполняет автоматический вход если токен действителен
   */
  const checkAuth = async () => {
    if (token.value) {
      try {
        // Запрос данных профиля для проверки токена
        const response = await axios.get('https://flaskserver-98pw.onrender.com/auth/profile')
        user.value = response.data
        isAuthenticated.value = true
      } catch {
        // Токен недействителен или истек, выполняем выход
        logout()
      }
    }
  }

  /**
   * Обновление данных профиля текущего пользователя
   * @param {Object} profileData - Объект с новыми данными профиля (first_name, last_name, phone)
   * @returns {Promise<{success: boolean, message: string}>} Результат обновления
   */
  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      // Отправка обновленных данных профиля на сервер
      const response = await axios.put(
        'https://flaskserver-98pw.onrender.com/auth/profile',
        profileData,
      )
      user.value = response.data.user // Обновление данных пользователя в store
      return { success: true, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Ошибка обновления профиля',
      }
    } finally {
      isLoading.value = false
    }
  }

  // Инициализация store: проверка аутентификации при первой загрузке
  checkAuth()

  // Экспорт всех функций и состояний
  return {
    // Состояния
    user,
    token,
    isAuthenticated,
    isLoading,

    // Вычисляемые свойства
    isLoggedIn,
    isAdmin,
    fullName,

    // Действия
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  }
})
