<style scoped></style>

<template>
    <router-view></router-view>
</template>

<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn')
</script>
