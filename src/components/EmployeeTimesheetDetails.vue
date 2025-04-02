<script setup>

import { Download, Expand, ListTree, ToggleLeft, ChevronDown, Trash, ChevronUp, Check, Pencil, Search } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch, } from 'vue';


const emit = defineEmits(['edit', 'save', 'approve', 'reject']);

// Demo Data 
const timesheetData = ref([
    {
        srNo: 1,
        shiftDate: '05/03/25',
        shift: '09:00-06:00',
        inDateTime: '05/03/24 08:45',
        outDateTime: '05/03/24 17:30',
        regularizationStatus: 'Approved',
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
        regularizationStatus: 'Pending',
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
        regularizationStatus: 'Rejected',
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
        regularizationStatus: 'Approved',
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
        regularizationStatus: 'Pending',
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
        regularizationStatus: 'Approved',
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
        regularizationStatus: 'Rejected',
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
        regularizationStatus: 'Approved',
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
        regularizationStatus: 'Pending',
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
        regularizationStatus: 'Rejected',
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
        regularizationStatus: 'Approved',
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
        regularizationStatus: 'Pending',
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
        regularizationStatus: 'Rejected',
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
        regularizationStatus: 'Approved',
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
        regularizationStatus: 'Approved',
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
        regularizationStatus: 'Approved',
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


// props to handle colums for view, edit and approve
const props = defineProps({
    isEditable: {
        type: Boolean,
        default: false
    },
    isApproval: {
        type: Boolean,
        default: false
    },
    fromDate: {
        type: String,
    },
    toDate: {
        type: String,
    }
});


watch(
    [() => props.fromDate, () => props.toDate],
    ([newFromDate, newToDate]) => {
        if (newFromDate && newToDate) {
            // Implement your filtering logic here
            // console.log(newFromDate, newToDate);

        }
    }
)

const isFullscreen = ref(false);
const searchQuery = ref('');
const activeSearch = ref('');

const handleSearch = () => {

    activeSearch.value = searchQuery.value.trim();
};

const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
};

const filters = ref({
    regularization: '',
    otStatus: '',
    meal: '',
    transport: ''
});

// filtering data
const filteredTimesheetData = computed(() => {
    return timesheetData.value.filter((item) => {
        // Date filtering
        const [itemDay, itemMonth, itemYear] = item.shiftDate?.split('/') || [];
        const itemDate = itemDay ? new Date(Number('20' + itemYear), Number(itemMonth) - 1, Number(itemDay)) : null;

        let isWithinDateRange = true;
        if (props.fromDate && props.toDate) {
            const fromDateObj = new Date(props.fromDate);
            const toDateObj = new Date(props.toDate);

            fromDateObj.setHours(0, 0, 0, 0);
            toDateObj.setHours(0, 0, 0, 0);
            itemDate?.setHours(0, 0, 0, 0);

            isWithinDateRange = itemDate >= fromDateObj && itemDate <= toDateObj;
        }

        // Search filtering
        const searchTerm = activeSearch.value.toLowerCase();
        const matchesSearch = !searchTerm ||
            ['regularizationStatus', 'otStatus', 'meal', 'transport'].some(key => {
                const value = item[key];
                return value?.toLowerCase().includes(searchTerm);
            });

        // Other filters
        const matchesRegularization =
            !filters.value.regularization || item.regularizationStatus?.toLowerCase() === filters.value.regularization.toLowerCase();

        const matchesOtStatus =
            !filters.value.otStatus || item.otStatus?.toLowerCase() === filters.value.otStatus.toLowerCase();

        const matchesMeal =
            !filters.value.meal || item.meal?.toLowerCase() === filters.value.meal.toLowerCase();

        const matchesTransport =
            !filters.value.transport || item.transport?.toLowerCase() === filters.value.transport.toLowerCase();

        return isWithinDateRange && matchesSearch && matchesRegularization && matchesOtStatus && matchesMeal && matchesTransport;
    });
});
// COLUMS CONTROLS
const columns = ref([
    { key: 'srNo', label: 'Sr.No', visible: true },
    { key: 'shiftDate', label: 'Shift Date', visible: true },
    { key: 'shift', label: 'Shift', visible: true },
    { key: 'inDateTime', label: 'In', visible: true },
    { key: 'outDateTime', label: 'Out', visible: true },
    { key: 'regularizationStatus', label: 'Reg Status', visible: true },
    { key: 'tardiness', label: 'Tardiness', visible: true },
    { key: 'undertime', label: 'Undertime', visible: true },
    { key: 'otHours', label: 'OT Hours', visible: true },
    { key: 'otStatus', label: 'OT Status', visible: true },
    { key: 'nd1', label: 'ND1', visible: true },
    { key: 'nd2', label: 'ND2', visible: true },
    { key: 'meal', label: 'Meal', visible: true },
    { key: 'transport', label: 'Transport', visible: true }
]);


// Add actions column if editable
if (props.isEditable) {
    columns.value.push({
        key: 'actions',
        label: 'Actions',
        visible: true,
        locked: true
    });
}

// approval column 
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
    emit('edit', item);
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
    return Math.ceil(filteredTimesheetData.value.length / rowsPerPage.value);
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
    let data = [...filteredTimesheetData.value];

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

</script>

<template>
    <div :class="{ ' fixed inset-0 z-50 bg-white overflow-auto': isFullscreen }" class="shadow-md rounded-lg mx-auto">
        <div class="md:w-full p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div class="text-lg font-semibold">
                Employee Timesheet Details
            </div>


            <div class=" md:w-auto flex flex-row gap-4 items-stretch md:items-center">
                <!-- Search -->
                <div class="w-full md:w-64 flex items-center gap-2">
                    <input v-model="searchQuery" @keyup.enter="handleSearch"
                        class="w-full border border-neutral-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        type="text" placeholder="Search status (press Enter)">
                    <button @click="handleSearch"
                        class="px-3 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                        <Search class="w-5 h-5" />
                    </button>
                </div>

                <!-- Action buttons -->
                <div class="flex  gap-2 bg-neutral-200 border border-neutral-400 rounded-lg p-1">
                    <button class="p-1 hover:bg-neutral-300 rounded" title="Delete">
                        <Trash class="w-5 h-5" />
                    </button>

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
                            class="absolute md:right-0  mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
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
                    <button class="p-1 hover:bg-neutral-300 rounded">
                        <Download class="w-5 h-5" />
                    </button>

                </div>

            </div>
        </div>

        <!-- Filters -->
        <div v-if="!isListView" class="px-4 py-2 bg-gray-100 border-t border-b mb-10">
            <div class="flex flex-wrap gap-4 justify-center text-sm">
                <div class="flex items-center gap-2">
                    <label class="font-medium">Regularization:</label>
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
                        <option value="applied">Applied</option>

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

        <!-- List View -->
        <div v-if="isListView" class="space-y-2 p-4">
            <div v-for="row in filteredTimesheetData" :key="row.srNo"
                class="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                <div v-for="column in visibleColumns" :key="column.key" class="grid grid-cols-2 gap-2 py-1">
                    <span class="font-semibold text-sm">{{ column.label }}:</span>
                    <span class="text-sm text-gray-800">
                        <template v-if="column.key === 'regularizationStatus' || column.key === 'otStatus'">
                            <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium inline-block',
                                row[column.key] === 'Approved' ? 'bg-green-100 text-green-800' : '',
                                row[column.key] === 'Pending' ? 'bg-yellow-100 text-yellow-800' : '',
                                row[column.key] === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                            ]">
                                {{ row[column.key] }}
                            </span>
                        </template>
                        <template v-else>
                            {{ row[column.key] }}
                        </template>
                    </span>
                </div>
            </div>
        </div>

        <!-- Table View -->
        <div v-else class="overflow-x-auto pb-4">
            <table class="table-auto min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th v-for="column in visibleColumns" :key="column.key"
                            class="px-3 py-3 hover:cursor-pointer text-left text-xs font-medium text-gray-500 whitespace-nowrap"
                            :class="{
                                'w-auto min-w-[50px]': ['srNo'].includes(column.key),
                                'w-auto min-w-[50px]': ['shift', 'nd1', 'nd2', 'meal', 'transport'].includes(column.key),
                                'w-auto min-w-[50px]': ['tardiness', 'undertime', 'otHours'].includes(column.key),
                                'w-auto min-w-[50px]': ['shiftDate', 'inDateTime', 'outDateTime'].includes(column.key),
                                'w-auto min-w-[50px]': ['regularizationStatus', 'otStatus'].includes(column.key)
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
                    <tr v-for="item in paginatedData" :key="item.srNo" class="hover:bg-gray-50">
                        <td v-for="column in visibleColumns" :key="column.key"
                            class="px-3 py-3 text-xs whitespace-nowrap" :class="{
                                'text-center': ['srNo', 'nd1', 'nd2', 'meal', 'transport'].includes(column.key)
                            }">
                            <template v-if="column.key === 'regularizationStatus'">
                                <span :class="[
                                    'px-2 py-1  text-xs font-medium inline-block',
                                    item[column.key] === 'Approved' ? 'bg-green-100 text-green-800' : '',
                                    item[column.key] === 'Pending' ? 'bg-yellow-100 text-yellow-800' : '',
                                    item[column.key] === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                                ]">
                                    {{ item[column.key] }}
                                </span>
                            </template>

                            <template
                                v-else-if="column.key === 'otStatus' || column.key === 'meal' || column.key === 'transport'">
                                <span :class="[
                                    'px-2 py-1 rounded-full text-xs font-semibold inline-block',
                                    item[column.key] === 'Approved' ? ' text-green-800' : '',
                                    item[column.key] === 'Applied' ? ' text-yellow-800' : ''
                                ]">
                                    {{ item[column.key] }}
                                </span>
                            </template>



                            <template v-else>
                                {{ item[column.key] }}
                            </template>
                            <!-- <eidt or save -->
                            <template v-if="column.key === 'actions' && props.isEditable">
                                <div class="flex items-center gap-2 justify-center">
                                    <button v-if="item.regularizationStatus === 'Pending'" @click="handleSave(item)"
                                        class="p-1 hover:bg-green-100 rounded text-green-600" title="Approve">
                                        <Check class="w-4 h-4" />
                                    </button>
                                    <button
                                        v-if="item.regularizationStatus === 'Approved' || item.regularizationStatus === 'Rejected'"
                                        @click="handleEdit(item)" class="p-1 hover:bg-red-100 rounded text-red-600"
                                        title="Reject">
                                        <Pencil class="w-4 h-4" />
                                    </button>
                                </div>
                            </template>
                            <template v-if="column.key === 'approvalActions'">
    <div class="flex items-center gap-2">
        <button 
            v-if="item.regularizationStatus !== 'Approved'"
            @click="handleApprove(item)"
            class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
        >
            Approve
        </button>
        <button 
            v-if="item.regularizationStatus !== 'Rejected'"
            @click="handleReject(item)"
            class="px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 text-xs"
        >
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