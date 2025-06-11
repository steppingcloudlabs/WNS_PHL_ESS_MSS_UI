import axios from 'axios'
import moment from 'moment';
import { defineStore } from 'pinia'
import constant from '../store/constanrSys'
import c2 from "../../src/constant"

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    fullName: '',
    email: '',
    country: '',
    countryCode: '',
    department: '',
    departmentId: '',
    managerUserId: null,
    managerName: '',
    managerEmail: '',
    isManager: false,
    workscheduleCode:"",
    showMealAndTransport:false,
    reportees: [],
    TimesheetData : [],

  }),

  getters: {
    userInfo : (state) => ({
      userId: state.userId,
      name: state.fullName,
      email: state.email,
      department: state.department,
      isManager: state.isManager
    }),
    getisManager:(state)=>state.isManager,
    reporteeNames : (state) => state.reportees.map(r => r.defaultFullName).filter(name => !!name),
    timesheetData: (state) => state.TimesheetData || [],
    getManagerWorkSchedule: (state)=>state.workscheduleCode

  },

  actions: {
    setUser(data) {
      console.log("setting user full anme : ",data.defaultFullName)
      this.userId = data.UserId
      this.workscheduleCode = data.workscheduleCode;
      this.fullName = data.defaultFullName
      this.email = data.email
      this.country = data.country
      this.countryCode = data.countryCode
      this.department = data.department
      this.departmentId = data.departmentId
      this.managerUserId = data.managerUserId
      this.managerName = data.managerdefaultFullName
      this.managerEmail = data.manageremail
      this.isManager = data.isManager
      this.reportees = data.Reportees || []
      
    },

  // getTimeSheet Data
async fetchTimesheet(USERIds = null, startDate = null, endDate = null) {
  console.log("user id array: ", USERIds);

  try {
    const userStore = useUserStore();   
    let defaultUserId = userStore.userId;

    // Fallback to current user if no USERIds passed
    if (!USERIds || USERIds.length === 0) {
      USERIds = [defaultUserId];
    }

    // Get the full week boundaries (Sunday to Saturday)
    const weekStart = moment(startDate).startOf('week');
    const weekEnd = moment(endDate).endOf('week');
    const from = weekStart.format('YYYY-MM-DD');
    const to = weekEnd.format('YYYY-MM-DD');

    const response = await axios.get(`${constant.endpoint}/rest/catalog-service-rest/employeeTimeSheet`, {
      params: {
        USERID: USERIds,
        STARTDATE: from,
        ENDDATE: to
      }
    });

    console.log("error mess: ", response.data.status);

    if (response.data.status == 200) {
      
      
      const filteredData = response.data.result.filter(entry => {
        if (!entry.startDate) return false;
        
        const entryDate = moment(entry.startDate, 'YYYY-MM-DD');
        return entryDate.isBetween(startDate, endDate, null, '[]');
      });
        
      this.setTimeSheet(filteredData);
      return true;
    }
    else{
      return {
      success:false,
      message: response.data?.result?.[0]?.message || 'Unknown error occurred'
    };
    }
  } catch (error) {
    let message = 'Unknown error occurred';
    if (error.response && error.response.data) {
      message = error.response.data?.result?.[0]?.message || error.response.data.message || message;
    } else if (error.message) {
      message = error.message;
    }

    return {
      success: false,
      message :message
    };
  
  }
},

    async  updateShift(loggedInUserId, startDate, workSchedule,  tempTimeExternalCode) {
  
      console.log("updating shift:", loggedInUserId, startDate, tempTimeExternalCode, workSchedule);
    
      
        const response = await axios({
          method: 'POST',
          url: `${constant.endpoint}/rest/catalog-service-rest/updateTemporaryTime`,
          data: {
            externalCode: tempTimeExternalCode,
            workSchedule:workSchedule,
            startDate:startDate,
            userId:loggedInUserId,
            
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("response data status: ", response.data.result[0].status);
    
        if (response.data.status == 200 && response.data?.result[0].status === 'OK') {
          console.log("Shift updated userstore:", response.data);
          return {
            success: true,
            // data: response.data,
            message: 'Shift updated successfully'
          };
        } else {
          return {
                success: false,
                error: response.data?.result?.[0]?.message || 'Failed to update shift',
                message: response.data?.result?.[0]?.message || 'Unknown error occurred',
          };
        }
    
     
    
    },

    async fetchShiftList(userId, startDate) {
      try {
          const response = await axios.get(`${constant.endpoint}/rest/catalog-service-rest/shiftListForUser`, {
              params: {
                  USERID: userId,
                  STARTDATE: startDate
              }
          });
  
          if (response.status === 200) {
            console.log(
              'respnse data: ', response.data);
              // Store the shift list in state
              this.shiftDropdownList = [...response.data.result];
              
              return {
                  success: true,
                  data: response.data.result
              };
          }
          
          return {
              success: false,
              error: 'Failed to fetch shift list',
              data: []
          };
  
      } catch (error) {
          console.error('Error fetching shift list:', error);
          return {
              success: false,
              error: error.response?.data || error.message,
              data: []
          };
      }
  },

  
      
      setTimeSheet(data) {
        // Handle both direct array and { result: array } responses
        const timesheetData = Array.isArray(data) ? data : 
                            (Array.isArray(data?.result) ? data.result : []);
        
        // Maintain reactivity by replacing the array
        this.TimesheetData = [...timesheetData];
      },


    clearUser() {
      this.$reset()
    }
  },

  persist: true 
})