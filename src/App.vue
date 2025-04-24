<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SideBar from './components/SideBar.vue'
import Topbar from './components/Topbar.vue'
import { RouterView } from 'vue-router'
import { getTimesheetData, getUserRole } from './store/module/userModule'

const isSidebarOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)
const authorized = ref(false)
const loading = ref(true)
const errorMessage = ref('')

// Handle window resize
const handleResize = () => {
  const mobile = window.innerWidth < 768
  isMobile.value = mobile
  if (mobile) {
    isSidebarOpen.value = false
  }
}

// Only check if the user is authorized
const checkUserAccess = async () => {
  const result = await getUserRole()
  if (result.success) {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const defaultEndDate = currentDate.toISOString().split('T')[0];
    const defaultStartDate = sevenDaysAgo.toISOString().split('T')[0];
    getTimesheetData(null, defaultStartDate, defaultEndDate);
    authorized.value = true
  } else {
    authorized.value = false
    errorMessage.value = result.error || 'Unauthorized access'
  }
  loading.value = false
}

onMounted(() => {
  checkUserAccess()
  if (!isMobile.value) {
    isSidebarOpen.value = true
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleSidebarToggle = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>


<template>
  <!-- Show loading while checking user access -->
  <div v-if="loading" class="flex flex-col items-center justify-center  h-screen bg-gray-50 gap-4">
    <div class="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
    <p class=" text-lg font-medium">Checking access...</p>
  </div>

  <!-- Show unauthorized message if not allowed -->
  <div v-else-if="!authorized" class="flex items-center justify-center h-screen bg-gray-50">
    <div class="text-center">
      <p class="text-2xl font-bold text-red-600">Unauthorized Access</p>
      <p class="mt-2 text-gray-600">{{ errorMessage }}</p>
    </div>
  </div>

  <!-- Show full app if authorized -->
  <div v-else class="flex min-h-screen bg-gray-50">
    <!-- Overlay for mobile when sidebar is open -->
    <div 
      v-if="isMobile && isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity"
      @click="isSidebarOpen = false"
    />

    <!-- Sidebar -->
    <SideBar 
      :is-open="isSidebarOpen"
      class="fixed top-0 left-0 h-screen z-30 transition-all duration-300 ease-in-out"
      :class="{
        'w-64': isSidebarOpen,
        'w-16': !isSidebarOpen && !isMobile,
        'w-0': !isSidebarOpen && isMobile,
        '-translate-x-full': !isSidebarOpen && isMobile
      }"
    />

    <!-- Main content area -->
    <div 
      class="flex-1 min-w-0 transition-all duration-300" 
      :class="{
        'md:ml-64': isSidebarOpen && !isMobile,
        'md:ml-16': !isSidebarOpen && !isMobile
      }"
    >
      <!-- Topbar -->
      <Topbar 
        @toggle-sidebar="handleSidebarToggle"
        class="sticky top-0 z-10 border-b border-gray-200"
        :class="{
          '': isSidebarOpen && !isMobile,
          'md:ml-16': !isSidebarOpen && !isMobile
        }"
      />

      <!-- Page Content -->
      <main class="p-4 w-full">
        <RouterView />
      </main>
    </div>
  </div>
</template>


<style>
/* Smooth transitions */
.sidebar-transition {
  transition: width 0.3s ease, transform 0.3s ease;
}

/* Prevent horizontal scroll */
html, body {
  overflow-x: hidden;
}
</style>