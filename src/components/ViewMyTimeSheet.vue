<script setup>
import moment from 'moment';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import 'vue-cal/dist/vuecal.css';
import { Minus, Plus, RefreshCw, Search } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import EmployeeTimesheetDetails from './EmployeeTimesheetDetails.vue';
import { useUserStore } from '../store/userStore';

const userStore = useUserStore();
const toggleFilter = ref(false);
const loading = ref(false);

const handleToggleFilter = () => {
    toggleFilter.value = !toggleFilter.value;
};

const searchQueryEmployee = ref("");
const sqe = ref("");

const currentDate = new Date();
const sevenDaysAgo = new Date(currentDate);
sevenDaysAgo.setDate(currentDate.getDate() - 7);


    const startOfPrevMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfPrevMonth = moment().format('YYYY-MM-DD');

const fd = ref(startOfPrevMonth);
const td = ref(endOfPrevMonth);

    
const fromDate = ref('');
const toDate = ref('');

console.log("fd, td: ", fd.value, td.value)

const reserDateFilter = async () => {
    const startOfPrevMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfPrevMonth = moment().format('YYYY-MM-DD');
    //  const startDay = moment(fromDate.value, 'YYYY-MM-DD').day();
    // const endDay = moment(toDate.value, 'YYYY-MM-DD').day();
        fd.value = startOfPrevMonth
        td.value = endOfPrevMonth
        loading.value = true;
   
    try {
        await userStore.fetchTimesheet(null, startOfPrevMonth, endOfPrevMonth);
        
        fromDate.value = "";
        toDate.value = "";
        sqe.value = null;
        selectedEmployees.value = [];
        searchInput.value = '';
    } finally {
        loading.value = false;
    }
};

const dateSearch = async () => {

    fromDate.value = fd.value;
    toDate.value = td.value;

    if (!fromDate.value || !toDate.value) {
        alert('Please select both dates');
        return;
    }

    const diffDays = toDate.value - fromDate.value;

if (diffDays < 7 || diffDays > 31) {
        alert('Please select a date range between 7 and 30 days');
        return;
    }
    if (fromDate.value > toDate.value) {
        alert('From date cannot be after To date');
        await reserDateFilter();
        return;
    }

    const employeeIds = selectedEmployees.value.map(emp => emp.userId);
    loading.value = true;

    try {
        if (employeeIds.length === 0) {
            await userStore.fetchTimesheet(null, fromDate.value, toDate.value);
        } else {
            await userStore.fetchTimesheet(employeeIds, fromDate.value, toDate.value);
        }
    } catch (error) {
        alert('Error fetching timesheet data: ' + error.message);
    } finally {
        loading.value = false;
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

const manager = computed(() => userStore.getisManager);
</script>

<template>
    <div class="relative">
        <!-- Full-screen loader -->
        <div v-if="loading" class="fixed inset-0 z-50 bg-white/70 flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-500 border-solid"></div>
        </div>

        <div class="w-full px-4 sm:px-6 lg:px-8 mx-auto">
            <div class="text-lg font-semibold mb-2">View My Timesheet</div>

            <div class="flex-1 min-w-0 my-4" v-if="manager">
                <label class="block mb-2 text-gray-700">Employee Name / ID *</label>
                <div class="flex flex-wrap gap-2 mb-2">
                    <div v-for="employee in selectedEmployees" :key="employee.userId"
                        class="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-md">
                        <span class="text-sm">({{ employee.userId }}) {{ employee.defaultFullName }}</span>
                        <button @click="removeEmployee(employee.userId)"
                            class="text-gray-500 hover:text-red-500">×</button>
                    </div>
                </div>

                <div class="flex flex-row items-center">
                    <div class="relative w-[300px]">
                        <input type="text" placeholder="Search Employee Name / ID" v-model="searchInput"
                            @focus="showDropdown = true" @blur="setTimeout(() => showDropdown = false, 200)"
                            class="w-full px-3 py-2 border-2 border-amber-600 rounded-md focus:outline-none">

                        <div v-if="showDropdown && filteredReportees.length > 0"
                            class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <div v-for="reportee in filteredReportees" :key="reportee.UserId"
                                @click="selectReportee(reportee)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <span>({{ reportee.userId }}) {{ reportee.defaultFullName }}</span>
                            </div>
                        </div>
                    </div>

                    <button @click="dateSearch"
                        class="ml-3 flex items-center gap-2 bg-red-400 py-2 px-4 rounded-md text-white">
                        <Search class="w-5 h-5" />
                        <span>Search</span>
                    </button>

                    <button @click="reserDateFilter"
                        class="ml-3 flex items-center gap-2 bg-red-400 py-2 px-4 rounded-md text-white">
                        <RefreshCw class="w-5 h-5" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            <!-- FILTER SECTION -->
            <div class="mt-6 flex flex-col gap-y-4 text-sm p-4 rounded-xl border border-gray-300 shadow-sm bg-white">

                <div class="flex justify-between items-center">
                    <div class="font-medium">FILTER</div>
                    <button @click="handleToggleFilter" class="hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <component :is="toggleFilter ? Minus : Plus" class="w-5 h-5" />
                    </button>
                </div>

                <div v-show="toggleFilter" class="flex flex-col md:flex-row gap-4 font-semibold">

                    <div class="flex-1 min-w-0 ">
                        <label class="block mb-2 text-gray-700">from Date</label>

                        <flat-pickr v-model="fd"  placeholder="from date"
                            class="input border border-gray-300 rounded-md p-1" />

                    </div>

                    <div class="flex-1 min-w-0">
                        <label class="block mb-2 text-gray-700">to Date</label>
                        <div class="flex items-center gap-x-2">

                            <flat-pickr v-model="td"  placeholder="to date"
                                class="input border border-gray-300 rounded-md p-1"/>

                            <button @click="dateSearch"
                                class="p-2 hover:bg-amber-600 bg-amber-500 text-white rounded-md transition-colors">
                                <Search class="w-5 h-5"/>
                            </button>

                            <button @click="reserDateFilter" class="p-2 hover:bg-gray-100 rounded-md transition-colors">
                                <RefreshCw class="w-5 h-5"/>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div class="mt-6 w-full">
                <EmployeeTimesheetDetails />
            </div>
        </div>
    </div>
</template>

<style>
input[type="date"] {
    appearance: none;
    -webkit-appearance: none;
    min-height: 40px;
}
</style>
