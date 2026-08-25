import { restaurantData } from '../data/restaurantData';
import { menuData } from '../data/menuData';
import { servicesData } from '../data/servicesData';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const getRestaurantDetails = async () => {
  const apiData = await apiClient(API_ENDPOINTS.GET_SETTINGS);
  
  return {
    ...restaurantData,
    ...apiData,
    address: {
      ...restaurantData.address,
      ...(apiData.address || {})
    }
  };
};

export const getCategories = async () => {
  return apiClient(API_ENDPOINTS.GET_CATEGORIES);
};

export const getMenuItems = async (category = null) => {
  const endpoint = category 
    ? `${API_ENDPOINTS.GET_MENU}?category=${encodeURIComponent(category)}` 
    : API_ENDPOINTS.GET_MENU;
  
  const items = await apiClient(endpoint);
  
  return items.map(item => {
    const staticItem = menuData.find(m => m.id === item.id);
    return { ...item, image: item.image_url || (staticItem ? staticItem.image : null) };
  });
};

export const getFeaturedMenuItems = async () => {
  const items = await apiClient(`${API_ENDPOINTS.GET_MENU}?isFeatured=true`);
  
  return items.map(item => {
    const staticItem = menuData.find(m => m.id === item.id);
    return { ...item, image: item.image_url || (staticItem ? staticItem.image : null) };
  });
};

export const getCateringServices = async () => {
  return await apiClient(API_ENDPOINTS.GET_SERVICES);
};

export const getSingleCateringService = async (id) => {
  return await apiClient(API_ENDPOINTS.GET_SERVICE_BY_ID(id));
};

export const getQuoteData = async () => {
  return apiClient(API_ENDPOINTS.GET_QUOTE_CONFIG);
};

export const submitQuoteRequest = async (payload) => {
  return apiClient(API_ENDPOINTS.SUBMIT_QUOTE, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const getTestimonials = async () => {
  return apiClient(API_ENDPOINTS.GET_APPROVED_TESTIMONIALS);
};

export const submitTestimonial = async (payload) => {
  return apiClient(API_ENDPOINTS.SUBMIT_TESTIMONIAL, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
