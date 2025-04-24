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
    TimesheetData : []
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
    timesheetData: (state) => state.TimesheetData || []

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


      async fetchTimesheet(USERId = null, startDate = null, endDate = null) {
        try {
          const response = await axios.get(`${constant.endpoint}/rest/catalog-service-rest/employeeTimeSheet`, {
            params: {
              USERID: c2.isLocal ? "395234" : USERId || this.userId,
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
      
      setTimeSheet(data) {
        // Handle both direct array and { result: array } responses
        const timesheetData = Array.isArray(data) ? data : 
                            (Array.isArray(data?.result) ? data.result : []);
        
        // Maintain reactivity by replacing the array
        this.TimesheetData = [...timesheetData];
        
        console.log("Timesheet data updated:", this.TimesheetData);
      },

    clearUser() {
      this.$reset()
    }
  },

  persist: true 
})
