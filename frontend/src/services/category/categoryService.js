import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

//! Add
export const addCategoryAPI = async ({ name, type }) => {
  try {
    const token = getUserFromStorage();
    const response = await axios.post(
      `${BASE_URL}/categories/create`,
      {
        name,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Return a promise
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error.response?.data || error.message);
    throw error;
  }
};

//! Update
export const updateCategoryAPI = async ({ name, type, id }) => {
  try {
    const token = getUserFromStorage();
    const response = await axios.put(
      `${BASE_URL}/categories/update/${id}`,
      {
        name,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Return a promise
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error.response?.data || error.message);
    throw error;
  }
};

//! Delete
export const deleteCategoryAPI = async (id) => {
  try {
    const token = getUserFromStorage();
    const response = await axios.delete(`${BASE_URL}/categories/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Return a promise
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error.response?.data || error.message);
    throw error;
  }
};

//! Lists
export const listCategoriesAPI = async () => {
  try {
    const token = getUserFromStorage();
    const response = await axios.get(`${BASE_URL}/categories/lists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Return a promise
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    throw error;
  }
}; 
