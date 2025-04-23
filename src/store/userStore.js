import { defineStore } from 'pinia'

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
    userInfo: (state) => ({
      userId: state.userId,
      name: state.fullName,
      email: state.email,
      department: state.department,
      isManager: state.isManager
    }),
    reporteeNames: (state) => state.reportees.map(r => r.defaultFullName).filter(name => !!name)
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

    

    clearUser() {
      this.$reset()
    }
  },

  persist: true 
})
