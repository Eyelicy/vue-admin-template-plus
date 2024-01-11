<template>
    <el-menu class="pt-12" router :default-active="activeIndex">
        <menu-item v-for="(menu, key) in menusList" :key="key" :menu="menu" />
    </el-menu>
</template>

<script setup>
import { routes } from '@/router/routes'
import { useUserStore } from '@/store/user'
import { getMenuByRouter } from '@/utils/index'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MenuItem from './MenuItem.vue'

const { userInfo } = useUserStore(),
    route = useRoute(),
    activeIndex = ref(route.path),
    menusList = ref(null)

watch(
    () => route.path,
    (newVal, oldVal) => {
        const array = newVal.split('/')
        if (array.length > 2) {
            activeIndex.value = `/${array[1]}/${array[2]}`
        } else {
            activeIndex.value = newVal
        }
    }
)

menusList.value = getMenuByRouter(routes[0].children, userInfo.user_rule_nodes)
</script>

<style lang="scss" scoped>
.el-menu {
    border-right: 0;
}
</style>
