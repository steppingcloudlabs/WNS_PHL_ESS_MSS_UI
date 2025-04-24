<script setup>

import { Minus, Plus, RefreshCw, Search } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import EmployeeTimesheetDetails from './EmployeeTimesheetDetails.vue';
import { getTimesheetData } from '../api/timeSheet';
import { useUserStore } from '../store/userStore';

const toggleFilter = ref(false);
const handleToggleFilter = () => {
    toggleFilter.value = !toggleFilter.value;
};

const searchQueryEmployee = ref("");

const sqe = ref("");

// const searchEmployee = () =>{
//     searchQueryEmployee.value = sqe.value;
// }

console.log(searchQueryEmployee.value);
console.log(sqe.value);


const fd = ref("");
const td = ref("");
const fromDate = ref('');
const toDate = ref('');
const reserDateFilter = () => {
    fromDate.value = ""
    toDate.value = ""
}
const dateSearch = () => {

    fromDate.value = fd.value;
    toDate.value = td.value;


    if (!fromDate.value || !toDate.value) {
        alert('Please select both dates');
        return;
    }
    if (fromDate.value > toDate.value) {
        alert('From date cannot be after To date');
        reserDateFilter();
        return;
    }

    console.log(fromDate.value, toDate.value)

    getTimesheetData(null, fromDate.value, toDate.value);
};
const userStore = useUserStore();

console.log("reporties: ", userStore.reportees)

// Add computed property for filtered reportees
const filteredReportees = computed(() => {
    if (!sqe.value) return userStore.reportees;
    return userStore.reportees.filter(reportee =>
        reportee.defaultFullName.toLowerCase().includes(sqe.value.toLowerCase()) ||
        reportee?.UserId?.toString().includes(sqe.value)
    );
});

const showDropdown = ref(false);

const selectReportee = (reportee) => {
    sqe.value = reportee.defaultFullName;
    console.log("Selected reportee:", reportee);
    showDropdown.value = false;
    // Pass the reportee's UserId to getTimesheetData
    // getTimesheetData(reportee.userId, fromDate.value, toDate.value);
};

// Also update the searchEmployee function to use the selected reportee's data
const searchEmployee = () => {
    searchQueryEmployee.value = sqe.value;

    console.log("sqe id : ", sqe.value);
    const selectedReportee = userStore.reportees.find(
        r => r.defaultFullName === sqe.value
    );
    if (selectedReportee) {
        getTimesheetData(selectedReportee?.userId, fromDate.value, toDate.value);
    }
};

</script>

<template>
    <div class="w-full   px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="text-lg font-semibold mb-2">View My Timesheet</div>

        <!-- search -->

        <div class="flex-1 min-w-0 my-4" v-if="useUserStore.isManager">
            <label class="block mb-2  text-gray-700">Employee Name / ID *</label>
            <div class="flex flex-row items-center">
                <div class="relative w-[300px]">
                    <input type="text" placeholder="Search Employee Name / ID" v-model="sqe"
                        @focus="showDropdown = true"
                        class="w-full px-3 py-2 border-2 border-amber-600 rounded-md focus:outline-none" required>
                    <!-- Dropdown list -->
                    
                    <div v-if="showDropdown && filteredReportees.length > 0"
                        class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div v-for="reportee in filteredReportees" :key="reportee.UserId"
                            @click="selectReportee(reportee)"
                            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                            <span> ({{ reportee.userId }}) {{ reportee.defaultFullName }}</span>
                            <span class="text-sm text-gray-500">{{ reportee.UserId }}</span>
                        </div>
                    </div>
                
                </div>
                <div @click="searchEmployee"
                    class="hover:cursor-pointer ml-3 flex flex-row items-center text-xl bg-red-400 py-2 px-2 rounded-md">
                    <Search class="w-6 h-6" /> Search
                </div>
                <div
                    @click=""
                    class="hover:cursor-pointer ml-3 flex flex-row items-center text-xl bg-red-400 py-2 px-2 rounded-md">
                    <RefreshCw class="w-6 h-6" />
                </div>
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
            <EmployeeTimesheetDetails :fromDate="fromDate" :toDate="toDate" />

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