<script setup>
import { BookOpen } from "lucide-vue-next";
import logo from "../assets/images/neo-logo.png"
import { RouterLink } from "vue-router";

defineProps({
    isOpen: {
        type: Boolean,
        default: true
    }
});

</script>

<template>
    <aside class="fixed  left-0 top-0 z-40 transition-all duration-300 ease-in-out bg-gray-800 text-white min-h-screen"
        :class="[isOpen ? 'w-fit' : 'w-14']">
        <!-- Logo -->
        <div class="p-4 bg-white">
            <img :class="['h-6', !isOpen ? 'mx-auto' : '']" :src="logo" alt="Neo Logo">
        </div>

        <!-- Navigation Links -->
        <nav class="mt-8 flex justify-start items-start flex-col gap-y-2 text-sm">
            <RouterLink to="/">
                <div
                    class="px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex justify-center items-center cursor-pointer">
                    <BookOpen class="w-5 h-5" :class="isOpen ? 'mr-2' : 'mx-auto'" />
                    <span v-show="isOpen" class="whitespace-nowrap transition-all duration-300">
                        Employee Timesheet View Only
                    </span>
                </div>
            </RouterLink>
            <RouterLink to="/edit">
                <div
                    class="px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex justify-center items-center cursor-pointer">
                    <BookOpen class="w-5 h-5" :class="isOpen ? 'mr-2' : 'mx-auto'" />
                    <span v-show="isOpen" class="whitespace-nowrap transition-all duration-300">
                        Employee Timesheet Editable
                    </span>
                </div>
            </RouterLink>
            <RouterLink to="/approve">
                <div
                    class="px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex justify-center items-center cursor-pointer">
                    <BookOpen class="w-5 h-5" :class="isOpen ? 'mr-2' : 'mx-auto'" />
                    <span v-show="isOpen" class="whitespace-nowrap transition-all duration-300">
                        Employee Timesheet Approve
                    </span>
                </div>
            </RouterLink>
        </nav>

        <div class="mt-[400px] ml-4">
            <div>Version: 0.1</div>
            <div>Last build : 24-04-2025</div>
        </div>

    </aside>
</template>