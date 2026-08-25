export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',

  // Settings
  GET_SETTINGS: '/settings',
  UPDATE_SETTINGS: '/settings',

  // Categories
  GET_CATEGORIES: '/categories',
  CREATE_CATEGORY: '/categories',
  UPDATE_CATEGORY: (id) => `/categories/${id}`,
  DELETE_CATEGORY: (id) => `/categories/${id}`,

  // Menu
  GET_MENU: '/menu',
  CREATE_MENU_ITEM: '/menu',
  UPDATE_MENU_ITEM: (id) => `/menu/${id}`,
  DELETE_MENU_ITEM: (id) => `/menu/${id}`,

  // Services
  GET_SERVICES: '/services',
  GET_SERVICE_BY_ID: (id) => `/services/${id}`,
  CREATE_SERVICE: '/services',
  UPDATE_SERVICE: (id) => `/services/${id}`,
  UPDATE_SERVICE_BASIC: (id) => `/services/${id}/basic-info`,
  UPDATE_SERVICE_BENEFITS: (id) => `/services/${id}/benefits`,
  UPDATE_SERVICE_MENU: (id) => `/services/${id}/menu-options`,
  DELETE_SERVICE: (id) => `/services/${id}`,

  // Testimonials
  GET_APPROVED_TESTIMONIALS: '/testimonials',
  SUBMIT_TESTIMONIAL: '/testimonials',
  GET_ALL_TESTIMONIALS: '/testimonials/all',
  APPROVE_TESTIMONIAL: (id) => `/testimonials/${id}/approve`,
  DELETE_TESTIMONIAL: (id) => `/testimonials/${id}`,

  // Quotes
  GET_QUOTE_CONFIG: '/quotes/config',
  SUBMIT_QUOTE: '/quotes',
  GET_ALL_QUOTES: '/quotes',
  UPDATE_QUOTE_STATUS: (id) => `/quotes/${id}/status`,

  // Quote Master Data
  CREATE_EVENT_TYPE: '/quotes/config/event-types',
  DELETE_EVENT_TYPE: (id) => `/quotes/config/event-types/${id}`,
  CREATE_GUEST_COUNT: '/quotes/config/guest-counts',
  DELETE_GUEST_COUNT: (id) => `/quotes/config/guest-counts/${id}`,
  CREATE_FOOD_PREF: '/quotes/config/food-preferences',
  DELETE_FOOD_PREF: (id) => `/quotes/config/food-preferences/${id}`
};
