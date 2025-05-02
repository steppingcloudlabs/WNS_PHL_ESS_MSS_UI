import axios from 'axios'
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
    reportees: [],
    TimesheetData : [],
    shiftDropdownList: []

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
    getshiftDropDownList :(state)=>state.shiftDropdownList || []

  },

  actions: {
    setUser(data) {
      console.log("setting user full anme : ",data.defaultFullName)
      this.userId = data.UserId
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


        const response = await axios.get(`${constant.endpoint}/rest/catalog-service-rest/employeeTimeSheet`, {
          params: {
            USERID: USERIds,
            // USERID: userIdsArray,
            STARTDATE: startDate,
            ENDDATE: endDate
          }
        });
    
        if (response.status === 200) {
          this.setTimeSheet(response.data);
          return true;
        }
      } catch (error) {
        console.error("Failed to fetch timesheet:", error);
        return false;
      }
    },

    async  updateShift(loggedInUserId, startDate, workSchedule, tempTimeExternalCode) {
  
      console.log("updating shift:", loggedInUserId, startDate, workSchedule, tempTimeExternalCode);
    
      try {
        const response = await axios({
          method: 'PUT',
          url: `${constant.endpoint}/rest/catalog-service-rest/updateTemporaryTime`,
          params: {
    
            tempTimeExternalCode: tempTimeExternalCode,
            workSchedule:workSchedule,
            startDate:startDate,
            CREATEDBY:loggedInUserId,
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
