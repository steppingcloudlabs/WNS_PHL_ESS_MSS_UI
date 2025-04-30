<script setup>
import * as XLSX from 'xlsx';
import { Download, Expand, ListTree, ToggleLeft, ChevronDown, Trash, ChevronUp, Check, Pencil, Search, Edit } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch, } from 'vue';
import { getTimesheetData } from '../store/module/userModule';
import { updateShift } from '../store/module/userModule';
import { useUserStore } from '../store/userStore';



const userStore = useUserStore();

// Access data through computed property
const timesheetData = computed(() => userStore.timesheetData);

const LoggedInUserId = computed(()=>userStore.userInfo);
console.log("loggedin USer: ", LoggedInUserId.value.userId);


// Load data when component mounts
onMounted(async () => {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const defaultEndDate = currentDate.toISOString().split('T')[0];
    const defaultStartDate = sevenDaysAgo.toISOString().split('T')[0];
    await userStore.fetchTimesheet(null, defaultStartDate, defaultEndDate);
    console.log("Current timesheet data:", timesheetData.value);
});



// props to handle colums for view, edit and approve
const props = defineProps({
    isEditable: {
        type: Boolean,
        default: false
    },
    isApproval: {
        type: Boolean,
        default: false
    }
});





const isFullscreen = ref(false);
const activeSearch = ref('');

const filters = ref({
    regularization: '',
    otStatus: '',
    meal: '',
    transport: ''
});

// filtering data
const filteredTimesheetData = computed(() => {
    if (!timesheetData.value || !Array.isArray(timesheetData.value)) {
        return [];
    }


    return timesheetData.value.filter((item) => {
        if (!item) return false;


        const effectiveRegStatus = getRegStatus(item)?.toLowerCase();
        const matchesRegularization = !filters.value.regularization ||
            (filters.value.regularization.toLowerCase() === effectiveRegStatus) ||
            (filters.value.regularization.toLowerCase() === 'approved' &&
                item.timeSheet?.some(ts => ts.timeType === 'WEXTSWIPE'));

        const matchesOtStatus = !filters.value.otStatus ||
            (item.OTStatus && item.OTStatus.toLowerCase() === filters.value.otStatus.toLowerCase()) ||
            (item.timeValuation && item.timeValuation.some(tv =>
                tv.approvalStatus?.toLowerCase() === filters.value.otStatus.toLowerCase()
            ));

            const matchesMeal = !filters.value.meal ||
            (item.Meal && item.Meal.toLowerCase() === filters.value.meal.toLowerCase());

        const matchesTransport = !filters.value.transport ||
            (item.Transport && item.Transport.toLowerCase() === filters.value.transport.toLowerCase());

        return matchesRegularization && matchesOtStatus && matchesMeal && matchesTransport;

    });
});

const getRegStatus = (item) => {
    if (item.attendanceType === 'WEXTSWIPE') {
        return 'APPROVED';
    }
    return item.RegStatus;
};


// COLUMS CONTROLS
const columns = ref([
    // { key: 'srNo', label: 'Sr.No', visible: true },
    { key: 'userId', label: 'User ID', visible: true },
    { key: 'startDate', label: 'Shift Date', visible: true },
    { key: 'ShiftId', label: 'Shift', visible: true },
    { key: 'inTime', label: 'In Time', visible: true },
    { key: 'outTime', label: 'Out Time', visible: true },
    { key: 'RegStatus', label: 'Attendence Status', visible: true },
    { key: 'attendanceType', label: 'Attendance Type', visible: true },
    { key: 'leave', label: 'Leave', visible: true },
    { key: 'leaveStatus', label: 'Leave Status', visible: false},
    { key: 'Tardiness', label: 'Tardiness', visible: true },
    { key: 'Undertime', label: 'Undertime', visible: true },
    { key: 'OTHourAndMin', label: 'OT Hours', visible: true },
    { key: 'OTStatus', label: 'OT Status', visible: false},
    { key: 'ND11', label: 'ND11', visible: true },
    { key: 'ND12', label: 'ND12', visible: true },
    { key: 'ND21', label: 'ND21', visible: true },
    { key: 'ND22', label: 'ND22', visible: true },
    { key: 'Meal', label: 'Meal', visible: true },
    { key: 'Transport', label: 'Transport', visible: true }

]);


// date Format
const formatISODuration = (duration) => {
    if (!duration) return '';

    // Handle PT0S case
    if (duration === 'PT0S') return '00:00';
    const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!matches) return duration;

    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

};

// Add actions column if editable
if (props.isEditable) {
    columns.value.push({
        key: 'actions',
        label: 'Actions',
        visible: true,
        locked: true
    });
}

// approval column if Approval
if (props.isApproval) {
    columns.value.unshift({
        key: 'approvalActions',
        label: 'Approve/Reject',
        visible: true,
        locked: true
    });
}

// edit and save 
const handleSave = (item) => {
    emit('save', item);
};

const handleEdit = (item) => {
    // emit('edit', item);
    console.log(item);
};

// approve / reject
const handleApprove = (item) => {
    emit('approve', item);
};

const handleReject = (item) => {
    emit('reject', item);
};

const showColumnSelector = ref(false);
const isListView = ref(false);
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
    screenWidth.value = window.innerWidth;
};

onMounted(() => {
    window.addEventListener('resize', updateScreenWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);
});

const toggleColumn = (column) => {
    column.visible = !column.visible;
};

const visibleColumns = computed(() => {
    return columns.value.filter(col => col.visible);
});

const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
    if (isFullscreen.value) {
        document.documentElement.requestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
};

const toggleView = () => {
    isListView.value = !isListView.value;
};

// Pagination
const currentPage = ref(1);
const rowsPerPage = ref(10);
const rowsPerPageOptions = [10, 20, 50, 100];
const totalPages = computed(() => {
    return Math.ceil(filteredTimesheetData?.value.length / rowsPerPage.value);
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value;
    const end = start + rowsPerPage.value;
    return sortedData.value.slice(start, end);
});

const changePage = (page) => {
    currentPage.value = page;
};

const changeRowsPerPage = (rows) => {
    rowsPerPage.value = rows;
    currentPage.value = 1;
};


// sorting by row
const sortBy = ref('');
const sortDesc = ref(false);

const sortedData = computed(() => {
    let data = [...filteredTimesheetData?.value];

    if (sortBy.value) {
        data.sort((a, b) => {
            let aValue = a[sortBy.value];
            let bValue = b[sortBy.value];

            // Handle date fields
            if (['shiftDate'].includes(sortBy.value)) {
                // Convert DD/MM/YY to Date object
                const [aDay, aMonth, aYear] = aValue.split('/');
                const [bDay, bMonth, bYear] = bValue.split('/');

                aValue = new Date(Number('20' + aYear), Number(aMonth) - 1, Number(aDay));
                bValue = new Date(Number('20' + bYear), Number(bMonth) - 1, Number(bDay));
            }

            // Handle datetime fields
            if (['inDateTime', 'outDateTime'].includes(sortBy.value)) {
                // Convert DD/MM/YY HH:mm to Date object
                const [aDate, aTime] = aValue.split(' ');
                const [bDate, bTime] = bValue.split(' ');

                const [aDay, aMonth, aYear] = aDate.split('/');
                const [bDay, bMonth, bYear] = bDate.split('/');

                const [aHour, aMinute] = aTime.split(':');
                const [bHour, bMinute] = bTime.split(':');

                aValue = new Date(Number('20' + aYear), Number(aMonth) - 1, Number(aDay), Number(aHour), Number(aMinute));
                bValue = new Date(Number('20' + bYear), Number(bMonth) - 1, Number(bDay), Number(bHour), Number(bMinute));
            }

            // Handle time duration fields
            if (['tardiness', 'undertime', 'otHours'].includes(sortBy.value)) {
                aValue = aValue.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
                bValue = bValue.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
            }

            if (aValue < bValue) return sortDesc.value ? 1 : -1;
            if (aValue > bValue) return sortDesc.value ? -1 : 1;
            return 0;
        });
    }
    return data;

});

const toggleSort = (columnKey) => {
    if (sortBy.value === columnKey) {
        sortDesc.value = !sortDesc.value;
    } else {
        sortBy.value = columnKey;
        sortDesc.value = false;
    }
};

const showShiftModal = ref(false);
const selectedItem = ref(null);
const startDate = ref(null);
const newShiftId = ref('');
const tempTimeExternalCode = ref('');


// cannot be updated da
const handleShiftClick = (item) => {
    const shiftDate = new Date(item.startDate);

    const today = new Date();
    const diffTime = Math.abs(today - shiftDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 60) {
        alert('Cannot update shift data older than 60 days');
        return;
    }

    selectedItem.value = item;
    startDate.value = item.startDate
    tempTimeExternalCode.value = item.tempTimeExternalCode
    newShiftId.value = item.ShiftId;
    showShiftModal.value = true;

};

// shift update function 
const Shift = async () => {
    updateShift(LoggedInUserId.value.userId, startDate.value, newShiftId.value, tempTimeExternalCode);
};

const downloadExcel = () => {
    const headers = visibleColumns.value.map(col => col.label);
    const data = filteredTimesheetData.value.map(item => {
        const row = {};
        visibleColumns.value.forEach(col => {
            let value = item[col.key];

            if (col.key === 'inTime' || col.key === 'outTime') {
                value = formatISODuration(value);
            }
            if (col.key === 'RegStatus') {
                value = getRegStatus(item);
            }
            row[col.label] = value || '-';
        });
        return row;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Timesheet');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save file
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Timesheet_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
};

</script>

<template>

    <!-- <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="flex flex-col items-center gap-4">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"> </div>
            <span class="text-gray-600">Loading timesheet data... </span>
        </div>
    </div> -->

    <div :class="{ ' fixed inset-0 z-50 bg-white overflow-auto': isFullscreen }" class="shadow-md rounded-lg mx-auto">
        <div class="md:w-full p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div class="text-lg font-semibold">
                Employee Timesheet Details
            </div>

            <div class=" md:w-auto flex flex-row gap-4 items-stretch md:items-center">

                <!-- Action buttons -->
                <div class="flex  gap-2 bg-neutral-200 border border-neutral-400 rounded-lg p-1">
                    <!-- <button class="p-1 hover:bg-neutral-300 rounded" title="Delete">
                        <Trash class="w-5 h-5" />
                    </button> -->

                    <button @click="toggleView" class="p-1 hover:bg-neutral-300 rounded"
                        :title="isListView ? 'Table View' : 'List View'">
                        <ToggleLeft class="w-5 h-5" />
                    </button>

                    <button @click="toggleFullscreen" class="p-1 hover:bg-neutral-300 rounded" title="Fullscreen">
                        <Expand class="w-5 h-5" />
                    </button>



                    <div class="relative">
                        <button @click="showColumnSelector = !showColumnSelector"
                            class="p-1 hover:bg-neutral-300 rounded" title="Columns">
                            <ListTree class="w-5 h-5" />
                        </button>

                        <!-- Column Selector Dropdown -->
                        <div v-if="showColumnSelector"
                            class="absolute md:right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div class="p-4">
                                <h3 class="text-sm font-semibold mb-2">Show/Hide Columns</h3>
                                <div class="space-y-2 max-h-80 overflow-y-auto">
                                    <label v-for="column in columns" :key="column.key"
                                        class="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                                        <input type="checkbox" v-model="column.visible"
                                            class="rounded border-gray-300 text-orange-500 focus:ring-orange-500">
                                        <span class="text-sm">{{ column.label }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                    <button @click="downloadExcel" class="p-1 hover:bg-neutral-300 rounded">
                        <Download class="w-5 h-5" />
                    </button>

                </div>

            </div>
        </div>

        <!-- Filters -->
        <div v-if="!isListView" class=" px-4 py-2 bg-gray-100 border-t border-b mb-10">
            <div class="flex flex-wrap gap-4 justify-center text-sm">
                <div class="flex items-center gap-2">
                    <label class="font-medium">Attendence</label>
                    <select v-model="filters.regularization"
                        class="rounded-md border-gray-300 text-sm focus:ring-orange-500">
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div class="flex items-center gap-2">
                    <label class="font-medium">OT Status:</label>
                    <select v-model="filters.otStatus" class="rounded-md border-gray-300 text-sm focus:ring-orange-500">
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>

                    </select>
                </div>

                <div class="flex items-center gap-2">
                    <label class="font-medium">Meal:</label>
                    <select v-model="filters.meal" class="rounded-md border-gray-300 text-sm focus:ring-orange-500">
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="applied">Applied</option>>
                    </select>
                </div>

                <div class="flex items-center gap-2">
                    <label class="font-medium">Transport:</label>
                    <select v-model="filters.transport"
                        class="rounded-md border-gray-300 text-sm focus:ring-orange-500">
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="applied">Applied</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- legends -->
        <div>
            <div class="px-4 py-2 border-b">
                <div class="flex flex-wrap gap-4 items-center text-sm">
                    <span class="font-medium text-lg">Status:</span>
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded-full bg-green-500"></div>
                            <span>Approved</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded-full bg-orange-500"></div>
                            <span>Pending</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded-full bg-red-500"></div>
                            <span>Declined</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- List View -->
        <div v-if="isListView" class="space-y-2 p-4">
            <div v-for="row in filteredTimesheetData" :key="row.srNo"
                class="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                <div v-for="column in visibleColumns" :key="column.key" class="grid grid-cols-2 gap-2 py-1">
                    <span class="font-semibold text-sm">{{ column.label }}:</span>
                    <span class="text-sm text-gray-800">
                        
                        <template v-if="column.key === 'RegStatus' || column.key === 'OTStatus'">
                            <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium inline-block',
                                row[column.key] === 'APPROVED' ? 'bg-green-100 text-green-800' : '',
                                row[column.key] === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : '',
                                row[column.key] === 'REJECTED' ? 'bg-red-100 text-red-800' : ''
                            ]">
                                {{  getRegStatus(row) }}
                            </span>
                        </template>

                        <template v-else-if="column.key === 'leave'">
    <span :class="[
        'px-2 py-1 rounded text-xs font-medium inline-block',
        row.leaveStatus === 'APPROVED' || row.leaveStatus === 'Approved' ? 'bg-green-100 text-green-800' : '',
        row.leaveStatus === 'PENDING' || row.leaveStatus === 'Pending' ? 'bg-orange-100 text-orange-800' : '',
        row.leaveStatus === 'REJECTED' || row.leaveStatus === 'Rejected' ? 'bg-red-100 text-red-800' : ''
    ]">
        {{ row[column.key] || "-" }}
    </span>
</template>
                        

                        <template v-else-if="column.key === 'attendanceType'">
                            <span class="px-2 py-1 text-xs font-medium inline-block">
                                {{ row[column.key] || "-"  }}
                            </span>
                        </template>

                        <!-- Meal and Transport  -->
                        <template v-else-if="column.key === 'Meal' || column.key === 'Transport'">
                            <span :class="[
                                'px-2 py-1 rounded text-xs font-medium inline-block',
                                row[column.key] === 'approved' ? 'bg-green-100 text-green-800' : '',
                                row[column.key] === 'applied' ? 'bg-orange-100 text-orange-800' : '',
                                row[column.key] === 'rejected' ? 'bg-red-100 text-red-800' : '',
                            ]">
                                {{ row[`${column.key}Hours`] || "-" }}
                                {{ row[column.key] ? `(${row[column.key]})` : '' }}
                            </span>
                        </template>



                        <template v-if="column.key === 'inTime' || column.key === 'outTime'">
                            {{ formatISODuration(row[column.key]) || "-" }}
                        </template>


                        <template v-else>
                            {{ row[column.key] || "-" }}
                        </template>
                    </span>
                </div>
            </div>
        </div>

        <!-- Table View -->
        <div v-else class="overflow-x-auto pb-4">
            <table class="table-auto min-w-full divide-y  divide-gray-200">
                <thead class="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th v-for="column in visibleColumns" :key="column.key"
                            class="px-3 py-3 hover:cursor-pointer text-left text-xs font-medium text-gray-500 whitespace-nowrap"
                            :class="{
                                'w-auto min-w-[50px]': ['srNo'].includes(column.key),
                                'w-auto min-w-[50px]': ['ShiftId', 'ND1', 'ND2', 'Meal', 'Transport'].includes(column.key),
                                'w-auto min-w-[50px]': ['Tardiness', 'Undertime', 'OTHours'].includes(column.key),
                                'w-auto min-w-[50px]': ['shiftDate', 'inTime', 'outTime'].includes(column.key),
                                'w-auto min-w-[50px]': ['attendenceStatus', ' RegStatus'].includes(column.key)
                            }" @click="toggleSort(column.key)">
                            <div class="flex items-center justify-between gap-2">
                                <span>{{ column.label }}</span>
                                <div v-if="column.key !== 'actions'" class="flex flex-col">
                                    <ChevronUp class="w-3 h-3" />
                                    <ChevronDown class="w-3 h-3" />
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in paginatedData" :key="item.srNo"
                        class="divide-x text-center divide-gray-200 hover:bg-gray-50">
                        <td v-for="column in visibleColumns" :key="column.key"
                            class="px-3 py-3 text-xs whitespace-nowrap " :class="{
                                'text-center': ['srNo', 'nd1', 'nd2', 'meal', 'transport'].includes(column.key)
                            }">
                            <template v-if="column.key === 'RegStatus'">
                                <span :class="[
                                    'px-2 py-1 text-center text-xs font-medium inline-block',
                                    getRegStatus(item) === 'APPROVED' ? 'bg-green-100 text-green-800' : '',
                                    getRegStatus(item) === 'Pending' ? 'bg-yellow-100 text-yellow-800' : '',
                                    getRegStatus(item) === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                                ]">
                                    {{ getRegStatus(item) }}
                                </span>
                            </template>

                            <template v-else-if="column.key === 'attendanceType'">
                                <span class="px-2 py-1 text-xs font-medium inline-block">
                                    {{ item[column.key] || "-" }}
                                </span>
                            </template>

                            <!-- shift id and popup for update -->
                            <template v-else-if="column.key === 'ShiftId'">
                                <span @click="handleShiftClick(item)"
                                    class="cursor-pointer hover:text-orange-500 hover:underline">
                                    {{ item[column.key] || "-" }}
                                </span>
                                <div v-if="showShiftModal"
                                    class="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
                                    <div class="bg-white rounded-lg p-6 w-96 shadow-xl">
                                        <h3 class="text-lg font-semibold mb-4">Update Shift</h3>

                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                New Shift ID
                                            </label>
                                            <input type="text" v-model="newShiftId"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="Enter new shift ID">
                                        </div>

                                        <div class="flex justify-end gap-3">
                                            <button @click="showShiftModal = false"
                                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                                Cancel
                                            </button>
                                            <button @click="Shift"
                                                class="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
<!-- OT status  and Hours-->
<template v-else-if="column.key === 'OTHourAndMin'">
    <span :class="[
        'px-2 py-1 rounded text-xs font-medium inline-block',
        item.OTStatus === 'APPROVED' || item.OTStatus === 'Approved' ? 'bg-green-100 text-green-800' : '',
        item.OTStatus === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-800' : '',
        item.OTStatus === 'REJECTED' || item.OTStatus === 'Rejected' ? 'bg-red-100 text-red-800' : ''
    ]">
        {{ item[column.key] || "-" }}
    </span>
</template>

<!-- leave || status -->
<template v-else-if="column.key === 'leave'">
    <span :class="[
        'px-2 py-1 rounded text-xs font-medium inline-block',
        item?.leaveStatus === 'APPROVED' || item?.leaveStatus === 'Approved' ? 'bg-green-100 text-green-800' : '',
        item?.leaveStatus === 'PENDING' || item?.leaveStatus === 'Pending' ? 'bg-orange-100 text-orange-800' : '',
        item?.leaveStatus === 'REJECTED' || item?.leaveStatus === 'Rejected' ? 'bg-red-100 text-red-800' : ''
    ]">
        {{ item[column.key] || "-" }}
    </span>
</template>


<template v-else-if="column.key === 'Meal' || column.key === 'Transport'">
    <span :class="[
        'px-2 py-1 rounded text-xs font-medium inline-block',
        // Status-based background colors
        item[column.key] === 'approved' ? 'bg-green-100 text-green-800' : '',
        item[column.key] === 'applied' || item[column.key] === 'pending' ? 'bg-orange-100 text-orange-800' : '',
        item[column.key] === 'rejected' ? 'bg-red-100 text-red-800' : '',
    ]">
        <template v-if="item[column.key] === 'approved'">
            {{ item[`${column.key}Hours`] || "-" }}
        </template>
        <template v-else>
            {{ item[`${column.key}Hours`] ? `${item[`${column.key}Hours`]} (${item[column.key]})` : "-" }}
        </template>
    </span>
</template>

                            
<template v-else-if="column.key === 'inTime' || column.key === 'outTime'">
                                {{ formatISODuration(item[column.key] || "-") }}
                            </template>



                            <template class="" v-else>
                                {{ item[column.key] || "-" }}
                            </template>
                            <!-- <eidt or save -->
                            <template v-if="column.key === 'actions' && props.isEditable">
                                <div class="flex items-center gap-2 justify-center">
                                    <button v-if="item.attendenceStatus === 'Pending'" @click="handleEdit(item)"
                                        class="p-1 hover:bg-green-100 rounded text-green-600" title="Approve">
                                        <Check class="w-4 h-4" />
                                    </button>
                                    <button
                                        v-if="item.attendenceStatus === 'Approved' || item.attendenceStatus === 'Rejected'"
                                        @click="handleEdit(item)" class="p-1 hover:bg-red-100 rounded text-red-600"
                                        title="Reject">
                                        <Pencil class="w-4 h-4" />
                                    </button>
                                </div>
                            </template>
                            <template v-if="column.key === 'approvalActions'">
                                <div class="flex items-center gap-2">
                                    <button v-if="item.attendenceStatus !== 'Approved'" @click="handleApprove(item)"
                                        class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">
                                        Approve
                                    </button>
                                    <button v-if="item.attendenceStatus !== 'Rejected'" @click="handleReject(item)"
                                        class="px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 text-xs">
                                        Reject
                                    </button>
                                </div>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- pagination handle -->
        <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <!-- Rows per page selector -->
            <div class="flex items-center gap-2">
                <span class="md:text-sm text-xs text-gray-700">Rows per page:</span>
                <select v-model="rowsPerPage" @change="changeRowsPerPage($event.target.value)"
                    class="rounded-md border-gray-300 text-sm focus:ring-orange-500">
                    <option v-for="option in rowsPerPageOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>
            <!-- Page information -->
            <div class="md:text-sm text-xs text-gray-700">
                Showing
                {{ (currentPage - 1) * rowsPerPage + 1 }}
                to
                {{ Math.min(currentPage * rowsPerPage, filteredTimesheetData.length) }}
                of
                {{ filteredTimesheetData.length }}
                entries
            </div>

            <!-- Pagination buttons -->
            <div class="flex gap-1">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                    class="md:px-3 px-1 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Prev
                </button>
                <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="[
                    'md:px-3 px-2 py-1 rounded-md text-sm font-medium',
                    currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                ]">
                    {{ page }}
                </button>

                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="md:px-3 px-1 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>

        </div>

    </div>

</template>



<style scoped>
/* Improved scrollbar styling */
.overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f8fafc;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
    border: 2px solid #f8fafc;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}



/* Responsive table cells */
@media (max-width: 767px) {
    .table-cell {
        padding: 0.5rem;
        font-size: 0.875rem;
    }

    /* Shorter labels for mobile */
    [data-label]::before {
        content: attr(data-label);
        font-weight: 600;
        display: inline-block;
        width: 30%;
    }
}

.pagination-button {

    transition-property: colors;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
}

.pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 640px) {
    .pagination-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;

    }

    .page-info {
        text-align: center;
    }
}
</style>