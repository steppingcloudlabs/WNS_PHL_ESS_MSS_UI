<script setup>
import { AlignJustify, Power, UserRound } from 'lucide-vue-next';
import { ref } from 'vue';
import { useUserStore } from '../store/userStore';
import logo from "../assets/images/neo-logo.png"

const isOpen = ref(true);
const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
  emit('toggle-sidebar', isOpen.value);

};

const userStore = useUserStore();
// <!-- remove in production -->
const refreshapi = () => {
  const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const defaultEndDate = currentDate.toISOString().split('T')[0];
    const defaultStartDate = sevenDaysAgo.toISOString().split('T')[0];
     userStore.fetchTimesheet(null, defaultStartDate, defaultEndDate);
}

</script>

<template>
  <div class="w-screen px-6 md:pr-10 py-2  flex justify-between items-center bg-[#ff7c00]  text-white">
    <div class="flex flex-row">
      <button 
      @click="toggleSidebar"
      class="hover:cursor-pointer hover:bg-[#e66f00] px-2 rounded-md"
    >
      <AlignJustify class="w-7 h-7"/>
    </button>
    <!-- Logo -->
    <div class="p-4 ">
            <img :class="['h-5', !isOpen ? 'mx-auto' : '']" :src="logo" alt="Neo Logo">
        </div>
    </div>

    <!-- remove in production -->
    <div
    @click="refreshapi"
    class="border font-bold text-black italic border-black p-2 rounded-2xl hover:cursor-pointer">
      Refresh Timesheet API 
    </div>

    <div class=" hover:cursor-pointer flex justify-center items-center md:gap-x-2">
      <div>
        <UserRound class="w-8 h-8"/>
      </div>

      <div class="flex justify-center items-start flex-col text-xs gap-y-1 mx-4">
        <div>{{ userStore.fullName}}</div>
        <div>{{ userStore.userId }}</div>
      </div>
      
      <button class=" hover:cursor-pointer md:mr-8 p-2 hover:bg-[#e66f00] rounded-lg transition-colors">
        <Power class="w-5 h-5"/>
      </button>
    </div>


  </div>
</template>