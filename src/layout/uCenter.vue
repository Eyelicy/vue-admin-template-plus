<template>
    <el-config-provider :locale="zhCn">
        <el-container style="height: 100vh; background: #f5f7f9">
            <el-header class="px-0">
                <Header></Header>
            </el-header>
            <el-container>
                <el-main class="py-12 px-12 flex flex-col">
                    <div
                        class="bg-white w-full h-full rounded-2xl p-12"
                        style="box-shadow: 0px 3px 20px rgb(178 175 223 / 30%)"
                    >
                        <router-view v-slot="{ Component }">
                            <keep-alive>
                                <component :is="Component" />
                            </keep-alive>
                        </router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </el-config-provider>
</template>

<script setup>
import Header from '@/layout/header/index.vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';


</script>

<style lang="scss" scoped></style>
