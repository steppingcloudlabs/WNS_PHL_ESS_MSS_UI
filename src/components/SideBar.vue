<script setup>
import { BookOpen } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import constant from "../constant";

defineProps({
    isOpen: {
        type: Boolean,
        default: true
    }
});
</script>

<template>
    <aside 
        class="fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out bg-gray-800 text-white  flex flex-col"
        :class="[isOpen ? 'w-64' : 'w-14']"
    >
        <!-- Main Content Area -->
        <div class="flex-1">
            <!-- Navigation Links -->
            <nav class="mt-8 flex justify-start items-start flex-col gap-y-2 text-sm">
                <RouterLink to="/">
                    <div class="px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex justify-center items-center cursor-pointer w-full">
                        <BookOpen class="w-5 h-5" :class="isOpen ? 'mr-2' : 'mx-auto'" />
                        <span v-show="isOpen" class="whitespace-nowrap transition-all duration-300">
                            Employee Timesheet View Only
                        </span>
                    </div>
                </RouterLink>
                <!-- <RouterLink to="/edit">
                    <div class="px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex justify-center items-center cursor-pointer w-full">
                        <BookOpen class="w-5 h-5" :class="isOpen ? 'mr-2' : 'mx-auto'" />
                        <span v-show="isOpen" class="whitespace-nowrap transition-all duration-300">
                            Employee Timesheet Editable
                        </span>
                    </div>
                </RouterLink>
                <RouterLink to="/approve">
                    <div class="px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex justify-center items-center cursor-pointer w-full">
                        <BookOpen class="w-5 h-5" :class="isOpen ? 'mr-2' : 'mx-auto'" />
                        <span v-show="isOpen" class="whitespace-nowrap transition-all duration-300">
                            Employee Timesheet Approve
                        </span>
                    </div>
                </RouterLink> -->
            </nav>
        </div>

        <div class=" border-t border-gray-700">
            <div v-if="isOpen" class="p-4 text-xs flex flex-col gap-2">
                <div class="flex items-center gap-1">
                    <div class="font-medium">Version:</div>
                    <div>{{ constant.version }}</div>
                </div>
                <div class="flex items-center gap-1">
                    <div class="font-medium">Last build:</div>
                    <div>{{ constant.lastBuild }}</div>
                </div>
            </div>
            <div v-else class="p-2 text-center text-xs">
                <div>V: {{ constant.version }}</div>
            </div>
        </div>

    </aside>
</template>