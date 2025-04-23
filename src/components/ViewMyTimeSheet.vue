<script setup>
    
    import { Minus, Plus, RefreshCw, Search } from 'lucide-vue-next';
    import { ref } from 'vue';
    import EmployeeTimesheetDetails from './EmployeeTimesheetDetails.vue';

const toggleFilter = ref(false);
const handleToggleFilter = () => {
    toggleFilter.value = !toggleFilter.value;
};

const searchQueryEmployee = ref("");

const sqe = ref("");

const searchEmployee = () =>{
    searchQueryEmployee.value = sqe.value;
}

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
    console.log(fromDate, toDate); 
};


</script>

<template>
    <div class="w-full   px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="text-lg font-semibold mb-2">View My Timesheet</div>

        <!-- search -->
            <div class="flex-1 min-w-0 my-4">
                    <label class="block mb-2  text-gray-700">Employee Name / ID *</label>
                    <div class="flex flex-row items-center">
                        <input type="text" placeholder="Search Employee Name / ID" v-model="sqe"
                        class="w-[300px] px-3 py-2 border-2 border-amber-600 rounded-md focus:outline-none "
                        required
                        >
                        <div 
                        @click="searchEmployee"
                        class="ml-3 flex flex-row items-center text-xl bg-red-400 py-2 px-2 rounded-md" ><Search class="w-6 h-6" /> Search</div>
                        <div class="ml-3 flex flex-row items-center text-xl bg-red-400 py-2 px-2 rounded-md" ><RefreshCw class="w-6 h-6" /> </div>
                    </div>
                    
            </div>

        <!-- date filter -->
         
        <div class="mt-6 flex flex-col gap-y-4 text-sm p-4 rounded-xl border border-gray-300 shadow-sm bg-white">
            <div class="flex justify-between items-center">
                <div class="font-medium">FILTER</div>
                <button
                    @click="handleToggleFilter"
                    class="hover:bg-gray-100 p-1 rounded-full transition-colors"
                    aria-label="Toggle filter"
                >
                    <component :is="toggleFilter ? Minus : Plus" class="w-5 h-5"/>
                </button>
            </div>

            <div v-show="toggleFilter" class="flex flex-col md:flex-row gap-4 font-semibold">
                <!-- from date -->
                <div class="flex-1 min-w-0">
                    <label class="block mb-2 text-gray-700">From Date</label>
                    <input 
                        type="date" 
                        v-model="fd"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                </div>

                <!-- to date -->
                <div class="flex-1 min-w-0">
                    <label class="block mb-2 text-gray-700">To Date</label>
                    <div class="flex items-center gap-x-2">
                        <input 
                            type="date" 
                            v-model="td"
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                        <button 
                            @click="dateSearch"
                            class="p-2 hover:bg-amber-600 bg-amber-500 text-white rounded-md transition-colors"
                            aria-label="Search"
                        >
                            <Search class="w-5 h-5" />
                        </button>
                        <button
                            @click="reserDateFilter"
                            class="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Reset"
                        >
                            <RefreshCw class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6  w-[100%] ">
            <EmployeeTimesheetDetails
                :fromDate="fromDate"
                :toDate="toDate"
            />

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