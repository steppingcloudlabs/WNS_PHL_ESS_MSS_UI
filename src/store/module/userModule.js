// src/api/user.js
import axios from 'axios'
import { useUserStore } from '../userStore';

import constant from "../constanrSys"

export const getUserRole = async () => {
  const userStore = useUserStore()

  console.log("sending user data")
  userStore.setUser("hello data demo");

  try {
    const response = await axios.get(`${constant.endpoint}rest/catalog-service-rest/getUserRole`, {
      headers: {
        // Add auth token if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
   

    if (response.status === 200 && response.data.status === "200") {
        // useUserStore.setUser(response.data.result);
        
        useUserStore.setUser("hello data");
        console.log("user data : ", response.data);
      return { success: true, data: response.data.result }
    } else {
      return { success: false, error: 'Invalid status code or response format' }
    }
  } catch (error) {
    console.error('Error in getUserRole:', error)
    let message = 'An error occurred while fetching user role.'
    
    if (error.response) {
      message += ` Server responded with status ${error.response.status}`
    } else if (error.request) {
      message += ' No response received from server.'
    } else {
      message += ` ${error.message}`
    }

    return { success: false, error: message }
  }
}
