<script setup>

import { Minus, Plus, RefreshCw, Search } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import EmployeeTimesheetDetails from './EmployeeTimesheetDetails.vue';
import { getTimesheetData } from '../store/module/userModule';
import { useUserStore } from '../store/userStore';


const userStore = useUserStore();
const toggleFilter = ref(false);

const handleToggleFilter = () => {
    toggleFilter.value = !toggleFilter.value;
};

const searchQueryEmployee = ref("");
const sqe = ref("");

    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const defaultEndDate = currentDate.toISOString().split('T')[0];
    const defaultStartDate = sevenDaysAgo.toISOString().split('T')[0];

const fd = ref(defaultStartDate);
const td = ref(defaultEndDate);
const fromDate = ref('');
const toDate = ref('');

const reserDateFilter = () => {
    userStore.fetchTimesheet(null, defaultStartDate, defaultEndDate);
    fd.value = defaultStartDate;
    td.value = defaultEndDate;
    fromDate.value = "";
    toDate.value = "";
    sqe.value = null;
    selectedEmployees.value = []; // Clear selected employees
    searchInput.value = ''; // Clear search input
};

const dateSearch = async () => {


    fromDate.value = fd.value;
    toDate.value = td.value;
    
    if (!fromDate.value || !toDate.value) {
        alert('Please select both dates');
        return;
    }


    // Date validations
    const start = new Date(fromDate.value);
    const end = new Date(toDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    // Validate date range 
    // uncomment in production

    if (diffDays < 7 || diffDays > 30) {
        alert('Please select a date range between 7 and 30 days');
        return;
    }
    if (fromDate.value > toDate.value) {
        alert('From date cannot be after To date');
        reserDateFilter();
        return;
    }


    // Get array of selected employee IDs
    const employeeIds = selectedEmployees.value.map(emp => emp.userId);

    console.log("emp ids: ", employeeIds);
    
    if (employeeIds.length === 0) {
        // If no employees selected, use current user's data
        userStore.fetchTimesheet(null, fromDate.value, toDate.value);
    } else {
        // Send array of employee IDs to backend
        try {
            await userStore.fetchTimesheet(employeeIds, fromDate.value, toDate.value);
        } catch (error) {
            alert('Error fetching timesheet data: ' + error.message);
        }
    }
};


const filteredReportees = computed(() => {
    if (!sqe.value) return userStore.reportees;
    return userStore.reportees.filter(reportee =>
        reportee.defaultFullName.toLowerCase().includes(sqe.value.toLowerCase()) ||
        reportee?.UserId?.toString().includes(sqe.value)
    );
});

const selectedEmployees = ref([]);
const searchInput = ref('');

const showDropdown = ref(false);
const selectReportee = (reportee) => {
    if (!selectedEmployees.value.some(emp => emp.userId === reportee.userId)) {
        selectedEmployees.value.push(reportee);
    }
    searchInput.value = '';
    showDropdown.value = false;
};

const removeEmployee = (userId) => {
    selectedEmployees.value = selectedEmployees.value.filter(emp => emp.userId !== userId);
};


// searchEmployee function to use the selected reportee's data
const searchEmployee = () => {
    searchQueryEmployee.value = sqe.value;
    const selectedReportee = userStore.reportees.find(
        r => r.defaultFullName === sqe.value
    );

    if (selectedReportee) {
        userStore.fetchTimesheet(selectedReportee?.userId, fd.value, td.value);
    }
};

const manager = computed(() => userStore.getisManager);

</script>

<template>
    <div class="w-full   px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="text-lg font-semibold mb-2">View My Timesheet</div>

        <!-- search -->

        <!-- Replace the existing search input section -->
<div class="flex-1 min-w-0 my-4" v-if="manager">
    <label class="block mb-2 text-gray-700">Employee Name / ID *</label>
    <!-- Selected employees tags -->
    <div class="flex flex-wrap gap-2 mb-2">
        <div v-for="employee in selectedEmployees" 
            :key="employee.userId"
            class="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-md">
            <span class="text-sm">({{ employee.userId }}) {{ employee.defaultFullName }}</span>
            <button @click="removeEmployee(employee.userId)" 
                class="text-gray-500 hover:text-red-500">
                ×
            </button>
        </div>
    </div>

    <!-- Search input and dropdown -->
    <div class="flex flex-row items-center">
        <div class="relative w-[300px]">
            <input type="text" 
                placeholder="Search Employee Name / ID" 
                v-model="searchInput"
                @focus="showDropdown = true"
                @blur="setTimeout(() => showDropdown = false, 200)"
                class="w-full px-3 py-2 border-2 border-amber-600 rounded-md focus:outline-none">
            
            <div v-if="showDropdown && filteredReportees.length > 0"
                class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div v-for="reportee in filteredReportees" 
                    :key="reportee.UserId"
                    @click="selectReportee(reportee)"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <span>({{ reportee.userId }}) {{ reportee.defaultFullName }}</span>
                </div>
            </div>
        </div>

        <button @click="dateSearch"
            class="hover:cursor-pointer ml-3 flex items-center gap-2 bg-red-400 py-2 px-4 rounded-md text-white">
            <Search 
            @click="dateSearch"
            class="w-5 h-5" />
            <span>Search</span>
        </button>
        
        <button @click="reserDateFilter"
            class="hover:cursor-pointer ml-3 flex items-center gap-2 bg-red-400 py-2 px-4 rounded-md text-white">
            <RefreshCw class="w-5 h-5" />
            <span>Reset</span>
        </button>

    </div>
</div>

        <!-- date filter -->

        <div class="mt-6 flex flex-col gap-y-4 text-sm p-4 rounded-xl border border-gray-300 shadow-sm bg-white">
            
            <div class="flex justify-between items-center">
                <div class="font-medium">FILTER</div>
                <button @click="handleToggleFilter" class="hover:bg-gray-100 p-1 rounded-full transition-colors"
                    aria-label="Toggle filter">
                    <component :is="toggleFilter ? Minus : Plus" class="w-5 h-5" />
                </button>
            </div>

            <div v-show="toggleFilter" class="flex flex-col md:flex-row gap-4 font-semibold">
                <!-- from date -->
                <div class="flex-1 min-w-0">
                    <label class="block mb-2 text-gray-700">From Date</label>
                    <input type="date" v-model="fd"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                </div>

                <!-- to date -->
                <div class="flex-1 min-w-0">
                    <label class="block mb-2 text-gray-700">To Date</label>
                    <div class="flex items-center gap-x-2">
                        <input type="date" v-model="td"
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                        <button @click="dateSearch"
                            class="p-2 hover:bg-amber-600 bg-amber-500 text-white rounded-md transition-colors"
                            aria-label="Search">
                            <Search class="w-5 h-5" />
                        </button>
                        <button @click="reserDateFilter" class="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Reset">
                            <RefreshCw class="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <div class="mt-6  w-[100%] ">
            <EmployeeTimesheetDetails  />

        </div>
    </div>
</template>

<style>
/* Ensure date inputs maintain consistent appearance across browsers */
input[type="date"] {
    appearance: none;
    -webkit-appearance: none;
    min-height: 40px;
}
</style>