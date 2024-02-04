<style lang="scss" scoped></style>

<template>
    <el-popover
        :width="526"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
        @before-enter="mapInit"
        :append-to-body="true"
        :preview-teleported="true"
    >
        <template #reference>
            <div class="cursor-pointer inline">
                <slot></slot>
                <el-icon color="#348DED" class="ml-2"><MapLocation /></el-icon>
            </div>
        </template>
        <template #default>
            <div ref="mapRef" class="map" id="map" style="height: 526px"></div>
        </template>
    </el-popover>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader'
import { MapLocation } from '@element-plus/icons-vue'
import { defineEmits, defineProps, ref } from 'vue'

const mapRef = ref()

const props = defineProps({
    longitude: {
        type: Number,
    },
    latitude: {
        type: Number,
    },
})

const emit = defineEmits(['confirm', 'update:show'])

let AMap = null,
    map = null,
    marker = null,
    geocoder = null

const mapInit = async () => {
    AMap = await AMapLoader.load({
        key: '536f8f9c0f3cd71f799cba67901c571f',
        version: '2.0',
        plugins: [
            'AMap.Geocoder',
            'AMap.PlaceSearch',
            'AMap.AutoComplete',
            'AMap.Scale',
            'AMap.ToolBar',
            'AMap.ControlBar',
        ],
    })

    geocoder = new AMap.Geocoder({
        city: '全国',
    })
    map = new AMap.Map(mapRef.value, {
        zoom: 13, //级别
        viewMode: '3D',
        center: [props.longitude, props.latitude],
    })

    addMarker(props.longitude, props.latitude)

    AMap.plugin(
        ['AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar'],
        function () {
            //添加控件-比例尺控件
            map.addControl(new AMap.Scale())
            //添加控件-工具条控件
            map.addControl(new AMap.ToolBar())
            map.addControl(new AMap.ControlBar())
        }
    )
}

const addMarker = (lng, lat) => {
    if (marker) {
        map.remove(marker)
    }
    marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
    })
    map.add(marker)
}
</script>
