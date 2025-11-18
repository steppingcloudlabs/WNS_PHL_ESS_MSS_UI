<script setup>
import moment from 'moment';
import * as XLSX from 'xlsx';
import { Download, Expand, ListTree, ToggleLeft, ChevronDown, Trash, ChevronUp, Check, Pencil, Search, Edit } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch, } from 'vue';
// import { updateShift } from '../store/userStore';
import { useUserStore } from '../store/userStore';

const userStore = useUserStore();

// get timeSheet Data
const timesheetData = computed(() => {
  changePage(1);
  return userStore.timesheetData;
});


const LoggedInUserId = computed(() => userStore.userInfo);

const loading = ref(null);
// Load data when component mounts
onMounted(async () => {
    loading.value = true;

    // Get previous month range using moment
    const startOfPrevMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfPrevMonth = moment().format('YYYY-MM-DD');
    const res = await userStore.fetchTimesheet(null, startOfPrevMonth, endOfPrevMonth);

    // console.log("timesheet data: ", res);

    if (res) {
        loading.value = false;
    } else {
        loading.value = false;
        showNotification('failed to get timesheet data', 'error');
    }
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
    if (item.attendanceTypeCode === 'WEXTSWIPE') {
        return 'APPROVED';
    }

    if (item.RegStatus) {
        return item.RegStatus;
    }
    return '-';
};

// -------------------------------COLUMS CONTROLS
const mt = computed(() => userStore.getIsRoleBandA); //for Meal and Transport
console.log("mt: ", mt.value) 
const columns = ref([
    // { key: 'srNo', label: 'Sr.No', visible: true },
    { key: 'userId', label: 'User ID', visible: true },
    { key: 'startDate', label: 'Shift Date', visible: true },
    { key: 'ShiftId', label: 'Shift', visible: true },
    { key: 'inTime', label: 'In Time', visible: true },
    { key: 'outTime', label: 'Out Time', visible: true },
    { key: 'RegStatus', label: 'Attendence Status', visible: true },
    { key: "attendanceTypeCode", label:"attendance Code" , visible:false},
    { key: 'attendanceType', label: 'Attendance Type', visible: true },
    { key: 'leave', label: 'Leave', visible: true },
    { key: 'leaveStatus', label: 'Leave Status', visible: true },
    { key: 'Tardy', label: 'Tardy', visible: true },
    { key: 'Undertime', label: 'Undertime', visible: true },
    { key: 'TCH_Value', label: 'TCH', visible: true },
    { key: 'TCH_Value_Breakup', label: 'TCH Breakup', visible: false },
    { key: "TCH_Status", label: "TCH Status", visible: false },
    { key: 'UCH_Value', label: 'UCH', visible: true },
    { key: 'UCH_Value_Breakup', label: 'UCH Breakup', visible: false},
    { key: "UCH_Status", label: "UCH Status", visible: false },
    { key: 'OTHourAndMin', label: 'OT Hours', visible: true },
    { key: 'OTHourAndMin_Breakup', label: 'OT Hours _Breakup', visible: false },
    { key: 'ExcessOT_HrAndMin', label: 'Excess OT Hours', visible: true },
    { key: 'ExcessOT_HrAndMin_Breakup', label: 'Excess OT Hours _Breakup', visible: false },
    { key: 'OTStatus', label: 'OT Status', visible: true },
    { key: 'ND1', label: 'ND1', visible: true },
    { key: "ND1_Breakup", label: "ND1 Breakup", visible: false },
    { key: 'ExcessND1', label: 'Excess ND1', visible: true },
    { key: "ExcessND1_Breakup", label: "Exces ND1 Breakup", visible: false },
    { key: 'ND2', label: 'ND2', visible: true },
    { key: "ND2_Breakup", label: "ND2 Breakup", visible: false },
    { key: 'ExcessND2', label: 'Excess ND2', visible: true },
    { key: "ExcessND2_Breakup", label: "Exces ND2 Breakup", visible: false },
    { key: 'Meal', label: 'Meal', visible: true },
    { key: 'Transport', label: 'Transport', visible: true },
    { key: 'ActualInTime', label: 'Swipe In', visible: true },
    { key: 'ActualOutTime', label: 'Swipe Out', visible: true },

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
  return columns.value.filter(col => {
    if (['Meal', 'Transport'].includes(col.key)) {
      return !mt.value && col.visible;
    }
    return col.visible;
  });
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
const tempTimeExternalCode = ref('');
const workSchedule = ref('');
const loadingShifts = ref(false);

const shiftdropdownData = ref([]);

const notification = ref({
    message: '',
    type: '', // 'success' or 'error'
    visible: false,
});

const showNotification = (message, type) => {
    notification.value = {
        message,
        type,
        visible: true,
    };
    //  hide the notification after 3 seconds
    setTimeout(() => {
        notification.value.visible = false;
    }, 3000);
};

const formatDisplayDate = (date) => {
    if (!date) return '';
    // Format the date as "Day, Month Date, Year" (e.g., "Monday, January 15, 2023")
    return moment(date).format('dddd, MMMM D, YYYY');
};
// shift update 
const handleShiftClick = async (item) => {

    console.log('Shift Clicked:', item);
    startDate.value = item.startDate;
    tempTimeExternalCode.value = item.tempTimeExternalCode;
    showShiftModal.value = true;
    

    const today = new Date();
    const itemDate = new Date(item.startDate); // ✅ Convert to Date object
    const diffTime = Math.abs(today - itemDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    loadingShifts.value = true; // Start loader
    console.log('Loading Shifts:', loadingShifts.value); // Debugging

    try {
        const result = await userStore.fetchShiftList(LoggedInUserId.value.userId, item.startDate);
        if (result.success) {
            shiftdropdownData.value = result.data;

            const currentDate = new Date();
            const sevenDaysAgo = new Date(currentDate);
            sevenDaysAgo.setDate(currentDate.getDate() - 7);

            // const defaultEndDate = currentDate.toISOString().split('T')[0];
            // const defaultStartDate = sevenDaysAgo.toISOString().split('T')[0];
            // await userStore.fetchTimesheet(null, defaultStartDate, defaultEndDate);


        } else {
            alert('Failed to load shift list: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading shifts:', error);
        alert('Error loading shift list');
    } finally {
        loadingShifts.value = false; // Stop loader
        console.log('Loading Shifts:', loadingShifts.value); // Debugging
    }
};

const isShiftUpdate = (dateStr, userId) => {
  const today = new Date();
  const shiftDate = new Date(dateStr);
  const diffTime = Math.abs(today - shiftDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if(diffDays> 60) {
    showNotification('Shift update is allowed only for the last 60 days', 'error');
  } 
  return diffDays > 60 || (userId && userId !== LoggedInUserId.value.userId);
};


const shiftupdateLoader = ref(null);
// shift update function 
const Shift = async () => {

    

     shiftupdateLoader.value = true; 
    const res = await userStore.updateShift(
        LoggedInUserId.value.userId,
        startDate.value,
        workSchedule.value,
        tempTimeExternalCode.value
    );

    console.log('Shift update response:', res.success);

    if (res.success) {
        shiftupdateLoader.value = false; 
        showNotification('Shift update workflow initiated successfully.', 'success');
        showShiftModal.value = false;

        const currentDate = new Date();
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        const defaultEndDate = currentDate.toISOString().split('T')[0];
        const defaultStartDate = sevenDaysAgo.toISOString().split('T')[0];
        // userStore.fetchTimesheet(null, defaultStartDate, defaultEndDate);

    } else {
        shiftupdateLoader.value = false;
        const errorMessage = res.message || 'Failed to update shift';
        showNotification(errorMessage, 'error');
        showShiftModal.value = false;
    }
};

// breakup data
const showBreakupModal = ref(false);
const breakupData = ref([]); // This will hold the array of objects for the breakup
const handleBreakupClick = (breakupArray) => {
    breakupData.value = breakupArray || []; // Set the breakup data
    showBreakupModal.value = true; // Show the modal
};
// download Excel
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


// status Hover popup 
const hoveredStatusItem = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });

const showStatusTooltip = (event, item, key) => {
    if(key==="TCH_Value"){
        key = "TCH_Status";
    }

    if (key==="UCH_Value") {
        key="UCH_Status";
    }

    console.log("Key hovered: ", key);
    
    const approvedKey = `${key}LastModifiedBy`;
    const nameKey = `${key}LastModifiedByName`;
    const modifiedKey = `${key}LastModifiedAt`;

    const approver = item[approvedKey];
    const approverName = item[nameKey];
    const modifiedDate = item[modifiedKey];

    hoveredStatusItem.value = {
        label: key,
        approvedBy: approver
            ? `${approver}${approverName ? ` (${approverName})` : ''}`
            : '-',
        lastModifiedBy: modifiedDate || '-',
    };

    const tooltipWidth = 200;
    const tooltipHeight = 80;

    tooltipPosition.value = {
        x: event.clientX - (tooltipWidth -5) / 2,
        y: event.clientY - tooltipHeight - 5,
    };
};

const hideStatusTooltip = () => {
    hoveredStatusItem.value = null;
};

</script>

<template>

    <div :class="{ ' fixed inset-0 z-50 bg-white overflow-auto': isFullscreen }" class="shadow-md rounded-lg mx-auto">
        <div class="md:w-full p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <!-- Notification -->
            <div v-if="notification.visible" :class="[
                'fixed z-[99999] top-10 right-10 px-4 py-2 rounded shadow-lg text-white',
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            ]">
                {{ notification.message }}
            </div>

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
                            class="absolute md:right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-[999999]">
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
                        <option value="PENDING_APPROVAL">Pending</option>
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

                        <template v-if="column.key === 'RegStatus'">
                            <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium inline-block',
                                getRegStatus(row).toLowerCase() == 'approved' ? 'bg-green-100 text-green-800' : '',
                                getRegStatus(row).toLowerCase() == 'pending_approval' ? 'bg-yellow-100 text-yellow-800' : '',
                                getRegStatus(row).toLowerCase() == 'rejected' ? 'bg-red-100 text-red-800' : ''
                            ]">
                                {{ getRegStatus(row) }}
                            </span>
                        </template>

                        <template v-else-if=" column.key === 'OTStatus'">
                            <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium inline-block',
                                row[column.key] === 'APPROVED' ? 'bg-green-100 text-green-800' : '',
                                row[column.key] === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' : '',
                                row[column.key] === 'REJECTED' ? 'bg-red-100 text-red-800' : ''
                            ]">
                                {{ row[column.key] || "-" }}
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
                                {{ row[column.key] || "-" }}
                            </span>
                        </template>
                        <template v-else-if="column.key === 'userId'">
                            <span class="px-2 py-1 text-xs font-medium inline-block">
                                {{ row[column.key] || "-" }}
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
                                
                            </span>
                        </template>



                        <template v-else-if="column.key === 'inTime' || column.key === 'outTime'">
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

        <div v-else class="relative overflow-x-auto pb-4  py-10">

            <div v-if="loading" class="flex justify-center items-center mb-4">
                <div class="flex flex-col items-center">
                    <div class="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent">
                    </div>
                    <div class=" text-lg font-medium">loading timesheet...</div>
                </div>
            </div>

            <div class="max-h-[500px] overflow-y-auto relative">
                <table v-if="!loading" class="table-auto min-w-full divide-y  divide-gray-200">
                
                    <thead class="bg-gray-200 sticky font-medium top-0 z-[1000]">
                    <tr>
                        <th v-for="column in visibleColumns" :key="column.key"
                            class=" px-3 py-3  hover:cursor-pointer text-left text-xs  font-medium text-black whitespace-nowrap"
                            :class="{
                                        'sticky font-medium left-0 bg-gray-200 z-20': column.key === 'startDate',
                                        'w-auto font-medium min-w-[50px]': ['ShiftId', 'ND1', 'ND2', 'Meal', 'Transport'].includes(column.key),
                                        // 'w-auto font-medium min-w-[50px]': ['Meal', 'Transport'].includes(column.key) && mt.value,
                                        'w-auto font-medium min-w-[50px]': ['Tardiness', 'Undertime', 'OTHours'].includes(column.key),
                                        'w-auto font-medium min-w-[50px]': ['shiftDate', 'inTime', 'outTime'].includes(column.key),
                                        'w-auto font-medium min-w-[50px]': ['attendenceStatus', 'RegStatus'].includes(column.key) 
                                    }"  @click="toggleSort(column.key)">
                            
                            <div class="flex items-center justify-between gap-2 font-medium">
                                <span>{{ column.label }}</span>
                                <div v-if="column.key !== 'actions'" class="flex flex-col">
                                    <ChevronUp class="w-3 h-3" />
                                    <ChevronDown class="w-3 h-3" />
                                </div>
                            </div>
                            
                        </th>
                    </tr>
                </thead>

                <tbody class="tablebody bg-white divide-y divide-gray-200 ">
                    <tr v-for="item in paginatedData" :key="item.srNo"
                        class="divide-x  divide-gray-200 hover:bg-gray-50 text-center text-xs">
                        <td v-for="column in visibleColumns" :key="column.key"
                            :class="{
                                        'sticky left-0 bg-white z-10 divide-y divide-gray-200': column.key === 'startDate',
                                        '': ['srNo', 'nd1', 'nd2', 'meal', 'transport'].includes(column.key)
                                    }">

                                     <!-- Shift Date (sticky column) -->
                                    <template v-if="column.key === 'startDate'">
                                        <span class="block divide-y divide-gray-200">{{ item[column.key] }}</span>
                                    </template>
                            <!-- attendence Status -->
                            <template v-else-if="column.key === 'RegStatus'">
                                <span
                                @mouseenter="showStatusTooltip($event, item, column.key)"
                                @mouseleave="hideStatusTooltip"
                                :class="[
                                    'px-2 py-1 text-center text-xs font-medium inline-block',
                                    getRegStatus(item).toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : '',
                                    getRegStatus(item).toLowerCase() === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' : '',
                                    getRegStatus(item).toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' : ''
                                ]">
                                    {{ getRegStatus(item) }}
                                </span>
                            </template>

                            <!-- attendance Type -->
                            <template v-else-if="column.key === 'attendanceType'">
                                <span class="px-2 py-1 text-xs font-medium inline-block">
                                    {{ item[column.key] || "-" }}
                                </span>
                            </template>
<!-- OTHourAndMin (OT Hours) with Breakup and Status -->
<template v-else-if="column.key === 'OTHourAndMin'">
    <span
        
        @click="item.OTHourAndMin_Breakup && handleBreakupClick(item.OTHourAndMin_Breakup)"
        :class="[
            'px-2 py-1 rounded text-xs font-medium inline-block',
            item.OTStatus.toLowerCase() === 'approved'  ? 'text-green-800' : '',
            item.OTStatus.toLowerCase() === 'pending_approval' ? 'text-orange-800' : '',
            item.OTStatus.toLowerCase() === 'rejected'  ? 'text-red-800' : '',
            item.OTHourAndMin_Breakup ? 'cursor-pointer  hover:underline' : ''
        ]"
        :title="item.OTHourAndMin_Breakup ? 'Show OT Hours Breakup' : ''"
    >
        {{ item[column.key] || "-" }}
    </span>
</template>
<!-- Excess OTHourAndMin (Excess OT Hours) with Breakup and Status -->
<template v-else-if="column.key === 'ExcessOT_HrAndMin'">
    <span
        @click="item.ExcessOT_HrAndMin_Breakup && handleBreakupClick(item.ExcessOT_HrAndMin_Breakup)"
        :class="[
            'px-2 py-1 rounded text-xs font-medium inline-block',
            item.OTStatus.toLowerCase() === 'approved'  ? 'text-green-800' : '',
            item.OTStatus.toLowerCase() === 'pending_approval' ? 'text-orange-800' : '',
            item.OTStatus.toLowerCase() === 'rejected'  ? 'text-red-800' : '',
            item.ExcessOT_HrAndMin_Breakup ? 'cursor-pointer  hover:underline' : ''
        ]"
        :title="item.ExcessOT_HrAndMin_Breakup ? 'Show Excess OT Hours Breakup' : ''"
    >
        {{ item[column.key] || "-" }}
    </span>
</template>

 <!-- TCH_Value with Breakup and Status -->
<template v-else-if="column.key === 'TCH_Value'">
    <span
          @mouseenter="showStatusTooltip($event, item, column.key)"
          @mouseleave="hideStatusTooltip"
        @click="item.TCH_Value_Breakup && handleBreakupClick(item.TCH_Value_Breakup)"
        :class="[
            'px-2 py-1 rounded text-xs font-medium inline-block',
            item.TCH_Status.toLowerCase() === 'approved' || item.TCH_Status === 'Approved' ? 'bg-green-100 text-green-800' : '',
            item.TCH_Status.toLowerCase() === 'pending_approval' ? 'bg-orange-100 text-orange-800' : '',
            item.TCH_Status.toLowerCase() === 'rejected' || item.TCH_Status === 'Rejected' ? 'bg-red-100 text-red-800' : '',
            item.TCH_Value_Breakup ? 'cursor-pointer  hover:underline' : ''
        ]"
        :title="item.TCH_Value_Breakup ? 'Show TCH Breakup' : ''"
    >
        {{ item[column.key] || "-" }}
    </span>
</template>

<!-- UCH_Value with Breakup and Status -->
<template v-else-if="column.key === 'UCH_Value'">
    <span
    @mouseenter="showStatusTooltip($event, item, column.key)"
                                @mouseleave="hideStatusTooltip"
        @click="item.UCH_Value_Breakup && handleBreakupClick(item.UCH_Value_Breakup)"
        :class="[
            'px-2 py-1 rounded text-xs font-medium inline-block',
            item.UCH_Status === 'APPROVED' || item.UCH_Status === 'Approved' ? 'bg-green-100 text-green-800' : '',
            item.UCH_Status === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-800' : '',
            item.UCH_Status === 'REJECTED' || item.UCH_Status === 'Rejected' ? 'bg-red-100 text-red-800' : '',
            item.UCH_Value_Breakup ? 'cursor-pointer  hover:underline' : ''
        ]"
        :title="item.UCH_Value_Breakup ? 'Show UCH Breakup' : ''"
    >
        {{ item[column.key] || "-" }}
        <!-- {{item.UCH_Status}} -->
    </span>
</template>

                            <!-- shift id and popup for update -->
                            <template v-else-if="column.key === 'ShiftId'">
                                <span @click="!isShiftUpdate(item.startDate, item.userId) && handleShiftClick(item)"
                                    class=" cursor-pointer hover:text-orange-500 hover:underline">
                                    {{ item[column.key] || "-" }}
                                </span>
                                <div v-if="showShiftModal"
                                    class="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[9999]">
                                    <div class="bg-white rounded-lg p-6 w-96 border border-black">
                                        
                                        <h3 class="text-lg font-semibold mb-4">Update Shift</h3>

                                        <div class="mb-2 text-sm font-medium text-gray-700 border border-gray-200 py-1">
            Updating shift for: <span class="font-semibold">{{ formatDisplayDate(startDate) }}</span>
        </div>

                                        <div v-if="loadingShifts" class="flex justify-center items-center mb-4">
                                            <svg class="animate-spin h-6 w-6 text-orange-500"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                        </div>

                                        <div v-else>
                                            <div class="mb-4">
                                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                                    Select New Shift
                                                </label>
                                                <select v-model="workSchedule"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                                                    <option value="">Select a shift</option>
                                                    <option v-for="shift in shiftdropdownData" :key="shift.externalCode"
                                                        :value="shift.SHIFTCODE">
                                                        {{ shift.SHIFTCODE + " " }} ({{ shift.externalCode }})
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="flex justify-end gap-3">
                                                <button @click="showShiftModal = false"
                                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                                    Cancel
                                                </button>

                                                <button v-if="shiftupdateLoader"
                                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                                    <svg class="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg"
                                                        fill="none" viewBox="0 0 24 24">
                                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                            stroke-width="4"></circle>
                                                        <path class="opacity-75" fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                    </svg>
                                                </button>

                                                <button v-else @click="Shift"
                                                    class="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

 
                            <!-- OT status -->
                            <template v-else-if="column.key === 'OTStatus'">
                                <span 
                                @mouseenter="showStatusTooltip($event, item, column.key)"
                                @mouseleave="hideStatusTooltip"
                                :class="[
                                    'px-2 py-1 rounded text-xs font-medium inline-block',
                                    item[column.key] === 'APPROVED' || item[column.key] === 'Approved' ? 'bg-green-100 text-green-800' : '',
                                    item[column.key] === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-800' : '',
                                    item[column.key] === 'REJECTED' || item[column.key] === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                                ]">
                                    {{ item[column.key] || "-" }}
                                </span>
                            </template>

                            <!-- ND1, ND2, ExcessND1, ExcessND2 -->
                            <template v-else-if="['ND1','OTHourAndMin', 'ExcessOT_HrAndMin' , 'ND2', 'ExcessND1', 'ExcessND2'].includes(column.key)">
                                <span @click="handleBreakupClick(item[`${column.key}_Breakup`])"
                                    class="cursor-pointer text-black-500 hover:underline">
                                    {{ item[column.key] || "-" }}
                                </span>
                            </template>

<!-- ---------breakup pop up ---  -->
                        <div v-else-if="showBreakupModal"
                       
                                class="fixed inset-0   bg-opacity-30  flex items-center justify-center z-[8889]">
                                <!-- breakupData: {{breakupData}} -->
                                <div class="bg-gray-100 border-[1px] border-gray-400  rounded-lg p-6  ">
                                    <h3 class="text-lg font-semibold mb-4">Breakup Details</h3>

                                    <div v-if="breakupData.length === 0" class="text-gray-500 text-sm ">
                                        No breakup data available.
                                    </div>

                                    
                                    <ul v-else class="space-y-2 flex flex-col">

                                        <li v-for="(breakup, index) in breakupData" :key="index"
                                            class=" flex justify-between items-center  ">
                                            <span class="text-sm font-medium ">{{ breakup.name || " - " }} &nbsp;&nbsp; </span>
                                            <span class="text-sm text-gray-800"> {{ breakup.hoursAndMinutes || "-"
                                                }}</span>
                                        </li>
                                       
                                    </ul>

                                    <div class="flex justify-end mt-8">
                                        <button @click="showBreakupModal = false"
                                            class="px-4 py-2 bg-red-400 text-sm font-medium text-black bg-gray-100 rounded-md hover:bg-red-600">
                                            Close
                                        </button>
                                    </div>
                                </div>
                        </div>

                            <!-- leave || status -->
                            <template v-else-if="column.key === 'leave'">
                                <span :class="[
                                    'px-2 py-1 rounded text-xs font-medium inline-block',
                                    item.leaveStatus === 'APPROVED' || item.leaveStatus === 'Approved' ? 'text-green-800' : '',
                                    item.leaveStatus === 'PENDING' || item.leaveStatus === 'Pending' ? 'text-orange-800' : '',
                                    item.leaveStatus === 'REJECTED' || item.leaveStatus === 'Rejected' ? 'text-red-800' : ''
                                ]">
                                    {{ item[column.key] || "-" }}
                                </span>
                            </template>

                            <template v-else-if="column.key === 'leaveStatus'">
                                <span 
                                @mouseenter="showStatusTooltip($event, item, column.key)"
                                @mouseleave="hideStatusTooltip"
                               
                                :class="[
                                    'px-2 py-1 rounded text-xs font-medium inline-block',
                                    item[column.key] === 'APPROVED' || item[column.key] === 'Approved' ? 'bg-green-100 text-green-800' : '',
                                    item[column.key] === 'PENDING' || item[column.key] === 'Pending' ? 'bg-orange-100 text-orange-800' : '',
                                    item[column.key] === 'REJECTED' || item[column.key] === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                                ]">
                                    {{ item[column.key] || "-" }}
                                </span>
                            </template>

                            <!-- meal and trasnport -->
                          <template v-else-if="column.key === 'Meal' || column.key === 'Transport'">
  <div v-if="mt">
    <span 
      @mouseenter="showStatusTooltip($event, item, column.key)"
      @mouseleave="hideStatusTooltip"
      :class="[
        'px-2 py-1 rounded text-xs font-medium inline-block',
        // Status-based background colors
        item[column.key] === 'APPROVED' ? 'bg-green-100 text-green-800' : '',
        item[column.key] === 'APPLIED' || item[column.key] === 'pending' ? 'bg-orange-100 text-orange-800' : '',
        item[column.key] === 'REJECTED' ? 'bg-red-100 text-red-800' : '',
      ]">
      <div>
        {{ item[`${column.key}Hours`] || "-" }}
      </div>
    </span>
  </div>
  <div v-else>
    {{ item[`${column.key}Hours`] || "-" }}
  </div>
</template>
                            
                            <!-- inTime and outTime -->
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
        </div>

        <!-- hover Status =>  Meal, Transport, UCH, TCH, RegStatus -->
<div 
v-if="hoveredStatusItem" 
     class="fixed z-[9999999999999] h-[110px] w-[250px] bg-white tooltip-shape rounded-md p-3 text-xs "
     :style="{ 
         top: `${tooltipPosition.y-30}px`, 
         left: `${tooltipPosition.x-20}px`,
     }">
     
    <div class="grid grid-cols-2 gap-2">
        <span class="font-medium"> Approved By:</span>
        <span>{{ hoveredStatusItem.approvedBy }}</span>
        <span class="font-medium">Last Modified At:</span>
        <span>{{ hoveredStatusItem.lastModifiedBy }}</span>
    </div>
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

.tooltip-shape {
    background-color: #b2b1b0;
    clip-path: polygon(0% 0%, 100% 0%, 100% 80%, 59% 82%, 56% 100%, 48% 82%, 0 82%);
}
/* Improved scrollbar styling */
.table-container {
    overflow-x: auto;
    position: relative;
}

.tablebody{
    font-weight: 400;
    
}

.sticky {
    position: sticky;
    
}

thead .sticky {
    z-index: 20;
}

.sticky::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;   
}

table {
    min-width: 100%;
}

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
