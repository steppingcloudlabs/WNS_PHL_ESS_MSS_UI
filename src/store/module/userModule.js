// src/api/user.js
import axios from 'axios'
import { useUserStore } from '../userStore';
import constant from "../constanrSys";
import c2 from '../../constant'

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

export const getTimesheetData = async (USERId = null, startDate = null, endDate = null) => {
  const userStore = useUserStore();   
  let userid = userStore.userId;


  console.log("user id from timesheet dropdown: ", USERId);
  console.log("user user id from store :: ", userid);

  console.log("startdate and enddate by user: ",startDate, endDate);

  try {
      const response = await axios({
          method: 'GET',
          url: `${constant.endpoint}/rest/catalog-service-rest/employeeTimeSheet`,
          params: {
              USERID: USERId?USERId:userid,
              STARTDATE: startDate,
              ENDDATE: endDate
          },
          
          headers: {
              'Content-Type': 'application/json'
          }
      });

      console.log("response data from api : ",response.data)

        if(response.status===200){
          console.log("next step sending data to store");
          userStore.setTimeSheet(response.data);
        }
        
      

      return {
          success: true,
          data: response.data,
          message: 'Timesheet data fetched successfully'
      };
  } catch (error) {
      
      return {
          success: false,
          data: null,
          message: error.response?.data?.message || 'Failed to fetch timesheet data',
          error: error.response?.data || error.message
      };
  
  }
};


