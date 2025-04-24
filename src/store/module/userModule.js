// src/api/user.js
import axios from 'axios'
import { useUserStore } from '../userStore';

import constant from "../constanrSys"

// export const getTimesheetData = async (params = {}) => {

//   const userStore = useUserStore();
//   const userid = userStore.userId;
  
//   console.log("user id :: ", userid);

//   try {
//       const response = await axios({
//           method: 'GET',
//           url: `${constant.endpoint}/rest/catalog-service-rest/employeeTimeSheet`,
//           params: {
//               USERID:userid,
//               STARTDATE:"2025-02-09",
//               ENDDATE:"2025-02-16"
//           },
//           headers: {
//               'Content-Type': 'application/json'
//           }
//       });
      
//       return {
//           success: true,
//           data: response.data,
//           message: 'Timesheet data fetched successfully'
//       };
//   } catch (error) {
      
//       return {
//           success: false,
//           data: null,
//           message: error.response?.data?.message || 'Failed to fetch timesheet data',
//           error: error.response?.data || error.message
//       };
  
//   }
// };

export const getUserRole = async () => {
  const userStore = useUserStore()

  console.log("sending user data")
  userStore.setUser("hello data demo");

  try {
    const response = await axios.get(`${constant.endpoint}/rest/catalog-service-rest/getUserRole`, {
      headers: {
        // Add auth token if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
   

    if (response.status === 200 && response.data.status === "200") {
        // useUserStore.setUser(response.data.result);
        
        userStore.setUser(response.data.result);
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

export const updateShift = async (id, shiftid) => {
  console.log("updating shift:", id, shiftid);

  try {
    const response = await axios({
      method: 'PUT',
      url: `${constant.endpoint}/rest/catalog-service-rest/updateShift`,
      data: {
        ID: id,
        ShiftId: shiftid
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: 'Shift updated successfully'
      };
    } else {
      return {
        success: false,
        error: 'Failed to update shift',
        message: response.data?.message || 'Unknown error occurred'
      };
    }

  } catch (error) {
    console.error('Error updating shift:', error);
    return {
      success: false,
      error: error.response?.data || error.message,
      message: error.response?.data?.message || 'Failed to update shift'
    };
  }
};
