import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Authentication
export const adminLogin = async (email, password) => {
  return apiClient(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

// General Settings
export const updateSettings = async (data) => {
  return apiClient(API_ENDPOINTS.UPDATE_SETTINGS, {
    method: 'PUT',
    body: JSON.stringify(data)
  }, true);
};

// Categories
export const createCategory = async (data) => apiClient(API_ENDPOINTS.CREATE_CATEGORY, { method: 'POST', body: JSON.stringify(data) }, true);
export const updateCategory = async (id, data) => apiClient(API_ENDPOINTS.UPDATE_CATEGORY(id), { method: 'PUT', body: JSON.stringify(data) }, true);
export const deleteCategory = async (id) => apiClient(API_ENDPOINTS.DELETE_CATEGORY(id), { method: 'DELETE' }, true);

// Menu Items
export const createMenuItem = async (data) => apiClient(API_ENDPOINTS.CREATE_MENU_ITEM, { method: 'POST', body: JSON.stringify(data) }, true);
export const updateMenuItem = async (id, data) => apiClient(API_ENDPOINTS.UPDATE_MENU_ITEM(id), { method: 'PUT', body: JSON.stringify(data) }, true);
export const deleteMenuItem = async (id) => apiClient(API_ENDPOINTS.DELETE_MENU_ITEM(id), { method: 'DELETE' }, true);

// Catering Services
export const createService = async (data) => apiClient(API_ENDPOINTS.CREATE_SERVICE, { method: 'POST', body: JSON.stringify(data) }, true);
export const updateService = async (id, data) => apiClient(API_ENDPOINTS.UPDATE_SERVICE(id), { method: 'PUT', body: JSON.stringify(data) }, true);
export const updateServiceBasicInfo = async (id, data) => apiClient(API_ENDPOINTS.UPDATE_SERVICE_BASIC(id), { method: 'PATCH', body: JSON.stringify(data) }, true);
export const updateServiceBenefits = async (id, benefits) => apiClient(API_ENDPOINTS.UPDATE_SERVICE_BENEFITS(id), { method: 'PATCH', body: JSON.stringify({ benefits }) }, true);
export const updateServiceMenuOptions = async (id, menuOptions) => apiClient(API_ENDPOINTS.UPDATE_SERVICE_MENU(id), { method: 'PATCH', body: JSON.stringify({ menu_options: menuOptions }) }, true);
export const deleteService = async (id) => apiClient(API_ENDPOINTS.DELETE_SERVICE(id), { method: 'DELETE' }, true);

// Testimonials
export const getAllTestimonialsAdmin = async () => apiClient(API_ENDPOINTS.GET_ALL_TESTIMONIALS, {}, true);
export const approveTestimonial = async (id) => apiClient(API_ENDPOINTS.APPROVE_TESTIMONIAL(id), { method: 'PUT' }, true);
export const deleteTestimonial = async (id) => apiClient(API_ENDPOINTS.DELETE_TESTIMONIAL(id), { method: 'DELETE' }, true);

// Quotes & Leads
export const getAllQuotes = async () => apiClient(API_ENDPOINTS.GET_ALL_QUOTES, {}, true);
export const updateQuoteStatus = async (id, status) => apiClient(API_ENDPOINTS.UPDATE_QUOTE_STATUS(id), { method: 'PUT', body: JSON.stringify({ status }) }, true);

// Quote Configs (Master Data)
export const createEventType = async (data) => apiClient(API_ENDPOINTS.CREATE_EVENT_TYPE, { method: 'POST', body: JSON.stringify(data) }, true);
export const deleteEventType = async (id) => apiClient(API_ENDPOINTS.DELETE_EVENT_TYPE(id), { method: 'DELETE' }, true);

export const createGuestCount = async (data) => apiClient(API_ENDPOINTS.CREATE_GUEST_COUNT, { method: 'POST', body: JSON.stringify(data) }, true);
export const deleteGuestCount = async (id) => apiClient(API_ENDPOINTS.DELETE_GUEST_COUNT(id), { method: 'DELETE' }, true);

export const createFoodPreference = async (data) => apiClient(API_ENDPOINTS.CREATE_FOOD_PREF, { method: 'POST', body: JSON.stringify(data) }, true);
export const deleteFoodPreference = async (id) => apiClient(API_ENDPOINTS.DELETE_FOOD_PREF(id), { method: 'DELETE' }, true);
