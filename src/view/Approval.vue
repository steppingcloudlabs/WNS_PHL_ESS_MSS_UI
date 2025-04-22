<script setup>
    import { computed, ref } from 'vue';
import EmployeeTimesheetDetails from '../components/EmployeeTimesheetDetails.vue';
import { RefreshCw, Search } from 'lucide-vue-next';

    const timesheetData = ref(
[
    {
        srNo: 1,
        shiftDate: '05/03/25',
        shift: '09:00-06:00',
        inDateTime: '05/03/24 08:45',
        outDateTime: '05/03/24 17:30',
        attendenceStatus: 'Approved',
        tardiness: '00:15',
        undertime: '00:00',
        otHours: '02:00',
        otStatus: 'Applied',
        nd1: '7',
        nd2: '4',
        meal: 'Applied',
        transport: 'Approved'
    },
    {
        srNo: 2,
        shiftDate: '12/03/25',
        shift: '09:00-05:00',
        inDateTime: '12/03/24 22:00',
        outDateTime: '13/03/24 06:00',
        attendenceStatus: 'Pending',
        tardiness: '00:30',
        undertime: '00:00',
        otHours: '01:30',
        otStatus: 'Approved',
        nd1: '3',
        nd2: '4',
        meal: 'Applied',
        transport: 'Applied'
    },
    {
        srNo: 3,
        shiftDate: '18/03/25',
        shift: '09:00-06:00',
        inDateTime: '18/03/24 13:00',
        outDateTime: '18/03/24 21:00',
        attendenceStatus: 'Rejected',
        tardiness: '00:10',
        undertime: '00:30',
        otHours: '00:00',
        otStatus: 'Approved',
        nd1: '5',
        nd2: '2',
        meal: 'Approved',
        transport: 'Applied'
    },
    {
        srNo: 4,
        shiftDate: '08/03/25',
        shift: '08:00-05:00',
        inDateTime: '08/03/24 09:30',
        outDateTime: '08/03/24 18:00',
        attendenceStatus: 'Approved',
        tardiness: '00:20',
        undertime: '00:10',
        otHours: '01:00',
        otStatus: 'Applied',
        nd1: '1',
        nd2: '3',
        meal: 'Approved',
        transport: 'Applied'
    },
    {
        srNo: 5,
        shiftDate: '22/03/25',
        shift: '09:00-06:00',
        inDateTime: '22/03/24 23:00',
        outDateTime: '23/03/24 07:00',
        attendenceStatus: 'Pending',
        tardiness: '00:05',
        undertime: '00:20',
        otHours: '02:30',
        otStatus: 'Approved',
        nd1: '3',
        nd2: '7',
        meal: 'Applied',
        transport: 'Approved',
    },
    {
        srNo: 6,
        shiftDate: '11/03/25',
        shift: '09:00-06:00',
        inDateTime: '11/03/24 12:45',
        outDateTime: '11/03/24 20:30',
        attendenceStatus: 'Approved',
        tardiness: '00:00',
        undertime: '00:00',
        otHours: '01:15',
        otStatus: 'Applied',
        nd1: '1',
        nd2: '2',
        meal: 'Approved',
        transport: 'Applied'
    },
    {
        srNo: 7,
        shiftDate: '15/03/25',
        shift: '09:00-06:00',
        inDateTime: '15/03/24 08:00',
        outDateTime: '15/03/24 16:30',
        attendenceStatus: 'Rejected',
        tardiness: '00:25',
        undertime: '00:15',
        otHours: '00:45',
        otStatus: 'Applied',
        nd1: '3',
        nd2: '4',
        meal: 'Approved',
        transport: 'Approved',
    },
    {
        srNo: 8,
        shiftDate: '29/03/25',
        shift: '09:00-06:00',
        inDateTime: '29/03/24 22:30',
        outDateTime: '30/03/24 06:30',
        attendenceStatus: 'Approved',
        tardiness: '00:10',
        undertime: '00:00',
        otHours: '02:00',
        otStatus: 'Approved',
        nd1: '3',
        nd2: '1',
        meal: 'Applied',
        transport: 'Applied',
    },
    {
        srNo: 9,
        shiftDate: '07/03/25',
        shift: '09:00-06:00',
        inDateTime: '07/03/24 14:00',
        outDateTime: '07/03/24 22:00',
        attendenceStatus: 'Pending',
        tardiness: '00:05',
        undertime: '00:10',
        otHours: '00:30',
        otStatus: 'Applied',
        nd1: '1',
        nd2: '7',
        meal: 'Applied',
        transport: 'Applied'
    },
    {
        srNo: 10,
        shiftDate: '01/03/25',
        shift: '09:00-06:00',
        inDateTime: '01/03/24 07:45',
        outDateTime: '01/03/24 16:15',
        attendenceStatus: 'Rejected',
        tardiness: '00:35',
        undertime: '00:20',
        otHours: '01:00',
        otStatus: 'Approved',
        nd1: '3',
        nd2: '2',
        meal: 'Approved',
        transport: 'Applied'
    },
    {
        srNo: 11,
        shiftDate: '20/03/25',
        shift: '09:00-06:00',
        inDateTime: '20/03/24 09:00',
        outDateTime: '20/03/24 18:00',
        attendenceStatus: 'Approved',
        tardiness: '00:00',
        undertime: '00:00',
        otHours: '00:45',
        otStatus: 'Approved',
        nd1: '3',
        nd2: '1',
        meal: 'Approved',
        transport: 'Applied'
    },
    {
        srNo: 12,
        shiftDate: '10/03/25',
        shift: '09:00-06:00',
        inDateTime: '10/03/24 21:30',
        outDateTime: '11/03/24 05:30',
        attendenceStatus: 'Pending',
        tardiness: '00:10',
        undertime: '00:00',
        otHours: '01:15',
        otStatus: 'Approved',
        nd1: '1',
        nd2: '2',
        meal: 'Applied',
        transport: 'Approved',
    },
    {
        srNo: 13,
        shiftDate: '17/03/25',
        shift: '09:00-06:00',
        inDateTime: '17/03/24 13:45',
        outDateTime: '17/03/24 22:30',
        attendenceStatus: 'Rejected',
        tardiness: '00:20',
        undertime: '00:30',
        otHours: '00:00',
        otStatus: 'Approved',
        nd1: '3',
        nd2: '4',
        meal: 'Applied',
        transport: 'Approved',
    },
    {
        srNo: 14,
        shiftDate: '25/03/25',
        shift: '09:00-06:00',
        inDateTime: '25/03/24 08:30',
        outDateTime: '25/03/24 17:45',
        attendenceStatus: 'Approved',
        tardiness: '00:10',
        undertime: '00:00',
        otHours: '02:30',
        otStatus: 'Approved',
        nd1: '5',
        nd2: '4',
        meal: 'Approved',
        transport: 'Applied',
    },
    {
        srNo: 15,
        shiftDate: '05/03/25',
        shift: '09:00-06:00',
        inDateTime: '05/03/24 08:45',
        outDateTime: '05/03/24 17:30',
        attendenceStatus: 'Approved',
        tardiness: '00:15',
        undertime: '00:00',
        otHours: '02:00',
        otStatus: 'Approved',
        nd1: '5',
        nd2: '4',
        meal: 'Applied',
        transport: 'Approved',
    },
    {
        srNo: 16,
        shiftDate: '05/03/25',
        shift: '09:00-06:00',
        inDateTime: '05/03/24 08:45',
        outDateTime: '05/03/24 17:30',
        attendenceStatus: 'Approved',
        tardiness: '00:15',
        undertime: '00:00',
        otHours: '02:00',
        otStatus: 'Applied',
        nd1: '3',
        nd2: '4',
        meal: 'Approved',
        transport: 'Applied'
    },
]);



//  count for status 
const statusCounts = computed(() => {
    return {
        pending: timesheetData.value.filter(item => item.attendenceStatus === 'Pending').length,
        rejected: timesheetData.value.filter(item => item.attendenceStatus === 'Rejected').length,
        approved: timesheetData.value.filter(item => item.attendenceStatus === 'Approved').length
    };
});

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
        return;
    }
    console.log(fromDate, toDate); 
};


</script>

<template>
    <div class="w-full   px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="text-lg font-semibold mb-2">View My Timesheet Approval</div>
        
        <div class="md:mt-10">
            <div class="flex flex-wrap justify-between items-center w-full mx-auto gap-2">
                
                <div class="bg-yellow-400  w-[300px] text-center font-semibold py-1 flex justify-center items-center"> PENDING 
                    <span class="ml-4 font-normal bg-yellow-200 px-2 text-sm rounded-lg">{{ statusCounts.pending }}</span>
                </div>
                
                <div class="bg-rose-400 w-[300px] text-center font-semibold py-1 flex justify-center items-center">REJECTED
                    <span class="ml-2 font-normal bg-yellow-200 px-2 text-sm rounded-lg">{{ statusCounts.rejected }}</span>
                </div>
                
                <div class="bg-green-500 w-[300px] text-center font-semibold py-1 flex justify-center items-center">APPROVED
                    <span class="ml-2 font-normal bg-yellow-200 px-2 text-sm rounded-lg">{{ statusCounts.approved }}</span>
                </div>
            </div>
        </div>
        
        <!-- search -->

        <div class="border-t-rose-500 border-t-[3px]  mt-6 flex flex-col gap-y-4 text-sm  rounded-xl border border-gray-300 shadow-sm bg-white">
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
                    <input type="date" v-model="fd"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                </div>

                <!-- to date -->
                <div class="flex-1 min-w-0">
                    <label class="block mb-2 text-gray-700">To Date</label>
                    <div class="flex items-center gap-x-2">
                        <input type="date" v-model="td"
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    </div>
                </div>
                <!-- search button -->

            </div>

            <!-- handle search -->
        <div class="mt-4 p-3 flex justify-end gap-x-3 bg-neutral-200">
            
            <button @click="dateSearch"
                class="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ">
                <Search class="w-5 h-5 mr-2" /> Search
            </button>
            <button @click="reserDateFilter"
                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ">
                <RefreshCw class="w-5 h-5 mr-2" /> Reset
            </button>

        </div>

        </div>
        

        <div class="mt-6  w-[100%] ">
            <EmployeeTimesheetDetails 
                :is-approval="true"
                :fromDate="fromDate"
                :toDate="toDate"
            />
        </div>
    </div>
</template>