<style lang="scss" scoped>
.my-dialog {
    border-radius: 8px;

    .el-dialog__header {
        padding: 0;
        margin-right: 0;
        border-bottom: 1px solid #eeeeee;
    }

    .my-header {
        padding: 20px 32px;
        @apply flex items-center justify-between;
    }

    .my-header-title {
        @apply text-2xl font-medium;
        color: #303133;
    }
}
</style>

<template>
    <el-dialog class="my-dialog" v-bind="$attrs" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header zIndex30">
                <p class="my-header-title">{{ title }}</p>
                <el-icon color="#909399" class="" style="cursor: pointer" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>

        <div class="map" id="map" style="height: 526px"></div>
        <template #footer="scope" v-if="showButton">
            <slot name="footer" v-bind="scope"></slot>
        </template>
    </el-dialog>
</template>

<script setup>
//   import { getIpApi } from '@/server/index';
import AMapLoader from '@amap/amap-jsapi-loader';
import { defineEmits, defineProps, reactive, watch } from 'vue';

const props = defineProps({
    location: {
        type: Object,
        default: () => {
            return {
                show: false,
                title: '定位',
                lng: 0,
                lat: 0,
            }
        },
        required: true,
    },
})

const emit = defineEmits(['confirm'])

let AMap = reactive(null),
    map = reactive(null),
    marker = reactive(null),
    geocoder = reactive(null)

watch(
    () => props.location.show,
    async () => {
        if (props.location.show) {
            await mapInit()
        }
    }
)

const mapInit = async () => {
    AMap = await AMapLoader.load({
        key: 'dfedd87642280288d91e0e233ecab9f5',
        version: '2.0',
        plugins: ['AMap.Geocoder'],
    })
    

    var satellite = new AMap.TileLayer.Satellite()
    var roadNet = new AMap.TileLayer.RoadNet()
    geocoder = new AMap.Geocoder({
        city: '全国',
    })
    map = new AMap.Map('map', {
        zoom: 13, //级别
        // center: [props.location.lng, props.location.lat],
    })

    if (props.location.lng && props.location.lat) {
        map.setCenter([props.location.lng ,props.location.lat])
        addMarker(props.location.lng, props.location.lat)
    } else {
        AMap.plugin('AMap.Geolocation', function () {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位，默认：true
                timeout: 10000, // 设置定位超时时间，默认：无穷大
                offset: [10, 20], // 定位按钮的停靠位置的偏移量
                zoomToAccuracy: true, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                position: 'RB', //  定位按钮的排放位置,  RB表示右下
            })

            geolocation.getCurrentPosition(function (status, result) {
                if (status == 'complete') {
                    onComplete(result)
                } else {
                    onError(result)
                }
            })

            function onComplete(data) {
                console.log('onComplete:', data)
                // data是具体的定位信息
                map.setCenter(data.position)
            }

            function onError(data) {
                console.log('err:', data)
                // 定位出错
            }
        })
    }
    // addMarker(props.location.lng, props.location.lat)

    map.on('click', (ev) => {
        var lnglat = ev.lnglat
        map.setCenter([lnglat.lng, lnglat.lat])
        addMarker(lnglat.lng, lnglat.lat)
    })
}

const addMarker = (lng, lat) => {
    if (marker) {
        map.remove(marker)
    }
    marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    })
    map.add(marker)
}

const confirm = () => {
    AMap.plugin('AMap.Geocoder', () => {
        var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: '010',
        })

        var lnglat = [map.getCenter().lng, map.getCenter().lat]

        geocoder.getAddress(lnglat, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
                console.log(result)
                props.location.show = false
                result.regeocode.addressComponent.location = `${map.getCenter().lng}|${
                    map.getCenter().lat
                }`
                emit('confirm', {
                    coordinate: `${map.getCenter().lng}|${map.getCenter().lat}`,
                    detailAddress: result.regeocode.formattedAddress,
                    standardAddress: `${result.regeocode.addressComponent.province}|${
                        result.regeocode.addressComponent.city ??
                        result.regeocode.addressComponent.province
                    }|${result.regeocode.addressComponent.district}`,
                })
            }
        })
    })
}

const close = () => {
    props.location.show = false
}
</script>
