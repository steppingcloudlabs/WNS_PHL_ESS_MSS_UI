<script setup>
import { AlignJustify, Power, UserRound } from 'lucide-vue-next';
import { ref } from 'vue';

const isOpen = ref(true);
const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
  emit('toggle-sidebar', isOpen.value);
};
</script>

<template>
  <div class="md:w-full px-6 md:px-10 py-2  flex justify-between items-center bg-[#ff7c00] text-white">
    <button 
      @click="toggleSidebar"
      class="p-2 hover:cursor-pointer"
      
    >
      <AlignJustify class="w-5 h-5"/>
    </button>

    <div class=" hover:cursor-pointer flex justify-center items-center md:gap-x-2">
      <div>
        <UserRound class="w-8 h-8"/>
      </div>

      <div class="flex justify-center items-start flex-col text-xs gap-y-1 mx-4">
        <div>Mark Jacob</div>
        <div>U123456</div>
      </div>
      
      <button class=" hover:cursor-pointer md:mr-8 p-2 hover:bg-[#e66f00] rounded-lg transition-colors">
        <Power class="w-5 h-5"/>
      </button>
    </div>
  </div>
</template>