<style lang="scss">
.scrollbar-div::-webkit-scrollbar {
    // position: absolute;
    // right: 0px;
}
</style>

<template>
    <el-config-provider :locale="zhCn">
        <el-container class="h-screen flex">
            <el-header class="p-0 flex-initial shrink-0">
                <Header></Header>
            </el-header>
            <el-container class="flex-auto flex">
                <el-aside
                    class="bg-white rounded-2xl"
                    width="220px"
                    style="box-shadow: 0px 3px 20px rgb(178 175 223 / 30%)"
                >
                    <Menu></Menu>
                </el-aside>
                <el-main class="flex flex-col">
                    <el-breadcrumb
                        separator="/"
                        class="pb-8 text-xl flex-initial shrink-0"
                        style="flex: 0 1 auto"
                    >
                        <template v-for="(item, index) in breadcrumb" :key="index">
                            <el-breadcrumb-item :to="{ path: item.path }">{{
                                item.meta.title ?? '首页'
                            }}</el-breadcrumb-item>
                        </template>
                    </el-breadcrumb>
                    <div
                        class="bg-white rounded-2xl flex flex-col p-[32px]"
                        style="
                            box-shadow: 0px 3px 20px rgb(178 175 223 / 30%);
                            height: calc(100vh - 60px - 40px - 36px);
                        "
                    >
                        <div class="w-full h-full overflow-y-auto scrollbar-div">
                            <router-view v-slot="{ Component }">
                                <KeepAlive
                                    ><component
                                        :is="Component"
                                        :key="$route.fullPath"
                                        v-if="$route.meta.keepAlive"
                                /></KeepAlive>
                                <component
                                    :is="Component"
                                    :key="$route.fullPath"
                                    v-if="!$route.meta.keepAlive"
                                />
                            </router-view>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </el-config-provider>
</template>

<script setup>
import Header from '@/layout/header/index.vue'
import Menu from '@/layout/menu/index.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter(),
    route = useRoute(),
    breadcrumb = ref(null)
let obj = {}

breadcrumb.value = route.matched.reduce((cur, next) => {
    obj[next.path] ? '' : (obj[next.path] = true && cur.push(next))
    return cur
}, [])

watch(route, (value) => {
    let obj = {}
    breadcrumb.value = value.matched.reduce((cur, next) => {
        obj[next.path] ? '' : (obj[next.path] = true && cur.push(next))
        return cur
    }, [])
})
</script>
