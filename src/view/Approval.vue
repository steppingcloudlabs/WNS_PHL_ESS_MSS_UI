<script setup>
import EmployeeTimesheetDetails from '../components/EmployeeTimesheetDetails.vue';

</script>

<template>
    <div class="w-full   px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="text-lg font-semibold mb-2">View My Timesheet Approval</div>
        
        <div class="">
            <div class="flex flex-wrap justify-between items-center w-full mx-auto gap-2">
                
                <div class="bg-yellow-400  w-[300px] text-center font-semibold py-1 flex justify-center items-center"> PENDING APPROVAL 
                    <span class="ml-4 font-normal bg-yellow-200 px-2 text-sm rounded-lg">7</span>
                </div>
                
                <div class="bg-rose-400 w-[300px] text-center font-semibold py-1 flex justify-center items-center">REJECTED
                    <span class="ml-2 font-normal bg-yellow-200 px-2 text-sm rounded-lg">3</span>
                </div>
                
                <div class="bg-green-500 w-[300px] text-center font-semibold py-1 flex justify-center items-center">APPROVED
                    <span class="ml-2 font-normal bg-yellow-200 px-2 text-sm rounded-lg">5</span>
                </div>
            </div>
        </div>
        
        <!-- search -->

        <div class="border-t-rose-500 border-t-[3px] mt-6 flex flex-col gap-y-4 text-sm  rounded-xl border border-gray-300 shadow-sm bg-white">
            <div class="p-4 flex justify-between items-center">
                <div class="font-medium">Search Criteria</div>

            </div>

            <div class="p-4 flex flex-col md:flex-row gap-4 font-semibold">
                <!-- search -->
                <div class="flex-1 min-w-0">
                    <label class="block mb-2  text-gray-700">Employee Name / ID *</label>
                    <input type="text" placeholder="Search Employee Name / ID" v-model="searchQuery"
                        class="w-full px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required>
                </div>

                <!-- from date -->
                <div class="flex-1 min-w-0">
                    <label class="block mb-2 text-gray-700">From Date</label>
                    <input type="date" v-model="fromDate"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                </div>

                <!-- to date -->
                <div class="flex-1 min-w-0">
                    <label class="block mb-2 text-gray-700">To Date</label>
                    <div class="flex items-center gap-x-2">
                        <input type="date" v-model="toDate"
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    </div>
                </div>
                <!-- search button -->

            </div>

            <!-- handle search -->
        <div class="mt-4 p-3 flex justify-end gap-x-3 bg-neutral-200">
            
            <button @click="handleSearch"
                class="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ">
                <Search class="w-5 h-5 mr-2" /> Search
            </button>
            <button @click="handleSearch"
                class="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ">
                <Search class="w-5 h-5 mr-2" /> Reset
            </button>

        </div>

        </div>
        

        <div class="mt-6  w-[100%] ">
            <EmployeeTimesheetDetails 
                :is-approval="true"
                @edit="handleEdit"
                @save="handleSave"
            />
        </div>
    </div>
</template>