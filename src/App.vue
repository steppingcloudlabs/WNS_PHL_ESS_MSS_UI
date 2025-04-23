<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SideBar from './components/SideBar.vue';
import Topbar from './components/Topbar.vue';
import ViewMyTimeSheet from './components/ViewMyTimeSheet.vue';
import { RouterView } from 'vue-router';
const isSidebarOpen = ref(false);
const isMobile = ref(window.innerWidth < 768);

// Handle window resize
const handleResize = () => {
  const mobile = window.innerWidth < 768;
  isMobile.value = mobile;
  if (mobile) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  // Set initial state
  if (!isMobile.value) {
    isSidebarOpen.value = true;
  }
  // Add resize listener
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const handleSidebarToggle = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Overlay for mobile when sidebar is open -->
    <div 
      v-if="isMobile && isSidebarOpen"
      class="fixed inset-0  bg-opacity- z-20 transition-opacity"
      @click="isSidebarOpen = false"
    />

    <!-- Sidebar - Fixed width states -->
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
    
    <!-- Main Content -->
    <div 
      class="flex-1 min-w-0 transition-all duration-300" 
      :class="{
        'md:ml-64': isSidebarOpen && !isMobile,
        'md:ml-16': !isSidebarOpen && !isMobile
      }"
    >
      <!-- Topbar - Matches sidebar width transition -->
      <Topbar 
        @toggle-sidebar="handleSidebarToggle"
        class="sticky top-0 z-10 border-b border-gray-200 "
        :class="{
          '': isSidebarOpen && !isMobile,
          'md:ml-16 ': !isSidebarOpen && !isMobile
        }"
      />

      <main 
      class="p-4 w-[100%] ">
        <!-- Router view for dynamic content -->
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