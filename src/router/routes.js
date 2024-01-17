import layout from '@/layout/index.vue'
import uCenterLayout from '@/layout/uCenter.vue'

export const routes = [
    {
        path: '/',
        redirect: '/home',
        component: layout,
        children: [
            // 首页
            {
                path: '/home',
                name: 'home',
                meta: {
                    title: '首页',
                    icon: 'chunf-shouye',
                },
                component: () => import('@/views/dashboard/index.vue'),
            },
            // 异常监控管理
            {
                path: '/exception-monitoring-management',
                name: 'ExceptionMonitoringManagement',
                redirect: '/exception-monitoring-management/delivery-location-deviation',
                meta: {
                    title: '异常监控管理',
                },
                children: [
                    {
                        path: 'delivery-location-deviation',
                        name: 'DeliveryLocationDeviation1',
                        meta: {
                            title: '签收地偏离',
                        },
                        component: () => import('@/views/AbnormalManagement/Deviate/index.vue'),
                    },
                    {
                        path: 'delivery-location-deviation/detail/:id',
                        name: 'DeliveryLocationDeviationDetail',
                        meta: {
                            title: '签收地偏离异常详情',
                            hideMenu: true,
                        },
                        component: () => import('@/views/AbnormalManagement/Deviate/detail.vue'),
                    },
                    {
                        path: 'SameFaceDifferentPlace',
                        name: 'SameFaceDifferentPlace',
                        meta: {
                            title: '同脸异地',
                        },
                        component: () =>
                            import('@/views/AbnormalManagement/SameFaceDifferentPlace/index.vue'),
                    },
                    {
                        path: 'SameFaceDifferentPlace/Detail/:id',
                        name: 'SameFaceDifferentPlaceDetail',
                        meta: {
                            title: '同脸异地详情',
                            hideMenu: true,
                        },
                        component: () =>
                            import('@/views/AbnormalManagement/SameFaceDifferentPlace/detail.vue'),
                    },
                    {
                        path: 'SameStoreDifferentFace',
                        name: 'SameStoreDifferentFace',
                        meta: {
                            title: '同店异脸',
                        },
                        component: () =>
                            import('@/views/AbnormalManagement/SameStoreDifferentFace/index.vue'),
                    },
                    {
                        path: 'SameStoreDifferentFace/Detail/:id',
                        name: 'SameStoreDifferentFaceDetail',
                        meta: {
                            title: '同店异脸详情',
                            hideMenu: true,
                        },
                        component: () =>
                            import('@/views/AbnormalManagement/SameStoreDifferentFace/detail.vue'),
                    },
                    {
                        path: 'CigarettePackageErrorCorrection',
                        name: 'CigarettePackageErrorCorrection',
                        meta: {
                            title: '烟包纠错',
                        },
                        component: () =>
                            import(
                                '@/views/AbnormalManagement/CigarettePackageErrorCorrection/index.vue'
                            ),
                    },

                    {
                        path: 'CigarettePackageErrorCorrection/Detail/:id',
                        name: 'CigarettePackageErrorCorrectionDetail',
                        meta: {
                            title: '烟包纠错详情',
                            hideMenu: true,
                        },
                        component: () =>
                            import(
                                '@/views/AbnormalManagement/CigarettePackageErrorCorrection/detail.vue'
                            ),
                    },
                ],
            },
            // 签收异常统计
            {
                path: '/abnormal-receipt-statistics',
                name: 'AbnormalReceiptStatistics',
                redirect: '/abnormal-receipt-statistics/abnormal-receipt-customer',
                meta: {
                    title: '签收异常统计',
                },
                children: [
                    {
                        path: 'abnormal-receipt-customer',
                        name: 'AbnormalReceiptCustomer',
                        meta: {
                            title: '异常签收客户',
                        },
                        component: () =>
                            import(
                                '@/views/AbnormalReceiptStatistics/AbnormalReceiptCustomer/index.vue'
                            ),
                    },
                    {
                        path: 'abnormal-receipt-customer/edit/:id',
                        name: 'AbnormalReceiptCustomerEdit',
                        meta: {
                            title: '异常签收客户详情',
                            hideMenu: true,
                        },
                        component: () =>
                            import(
                                '@/views/AbnormalReceiptStatistics/AbnormalReceiptCustomer/edit.vue'
                            ),
                    },
                    {
                        path: 'abnormal-receipt-order',
                        name: 'AbnormalReceiptOrder',
                        meta: {
                            title: '异常签收订单',
                        },
                        component: () =>
                            import(
                                '@/views/AbnormalReceiptStatistics/AbnormalReceiptOrder/index.vue'
                            ),
                    },
                ],
            },
            // 异常监测配置
            {
                path: '/anomaly-detection-configuration',
                name: 'AnomalyDetectionConfiguration',
                redirect: '/anomaly-detection-configuration/delivery-location-deviation',
                meta: {
                    title: '异常监测配置',
                },
                children: [
                    {
                        path: 'delivery-location-deviation',
                        name: 'DeliveryLocationDeviation',
                        meta: {
                            title: '签收地偏离',
                        },
                        component: () =>
                            import(
                                '@/views/AnomalyDetectionConfiguration/DeliveryLocationDeviation/index.vue'
                            ),
                    },
                    {
                        path: 'delivery-location-deviation/edit/:id',
                        name: 'DeliveryLocationDeviationEdit',
                        meta: {
                            title: '编辑签收地偏离',
                            hideMenu: true,
                        },
                        component: () =>
                            import(
                                '@/views/AnomalyDetectionConfiguration/DeliveryLocationDeviation/edit.vue'
                            ),
                    },
                    {
                        path: 'same-face-different-places',
                        name: 'SameFaceDifferentPlaces',
                        meta: {
                            title: '同脸异地',
                        },
                        component: () =>
                            import(
                                '@/views/AnomalyDetectionConfiguration/SameFaceDifferentPlaces/index.vue'
                            ),
                    },
                    {
                        path: 'same-face-different-places/edit/:id',
                        name: 'SameFaceDifferentPlacesEdit',
                        meta: {
                            title: '同脸异地详情',
                            hideMenu: true,
                        },
                        component: () =>
                            import(
                                '@/views/AnomalyDetectionConfiguration/SameFaceDifferentPlaces/edit.vue'
                            ),
                    },
                    {
                        path: 'same-store-different-faces',
                        name: 'SameStoreDifferentFaces',
                        meta: {
                            title: '同店异脸',
                        },
                        component: () =>
                            import(
                                '@/views/AnomalyDetectionConfiguration/SameStoreDifferentFaces/index.vue'
                            ),
                    },
                    {
                        path: 'same-store-different-faces/edit/:id',
                        name: 'SameStoreDifferentFacesEdit',
                        meta: {
                            title: '同店异脸详情',
                            hideMenu: true,
                        },
                        component: () =>
                            import(
                                '@/views/AnomalyDetectionConfiguration/SameStoreDifferentFaces/edit.vue'
                            ),
                    },
                    {
                        path: 'customer-warning-level',
                        name: 'CustomerWarningLevel',
                        meta: {
                            title: '客户预警等级',
                        },
                        component: () =>
                            import(
                                '@/views/AnomalyDetectionConfiguration/CustomerWarningLevel.vue'
                            ),
                    },
                ],
            },
            // 机构管理
            {
                path: '/Organization',
                name: 'Organization',
                redirect: 'Organization',
                meta: {
                    title: '机构管理',
                    icon: 'chunf-jigouguanli',
                },
                children: [
                    {
                        path: 'Organization',
                        name: 'Organization',
                        meta: {
                            title: '机构列表',
                        },
                        component: () => import('@/views/Organization/Organization.vue'),
                    },
                    {
                        path: 'Department',
                        name: 'Department',
                        meta: {
                            title: '部门管理',
                        },
                        component: () => import('@/views/Organization/Department.vue'),
                    },
                    {
                        path: 'Staff',
                        name: 'Staff',
                        meta: {
                            title: '员工管理',
                        },
                        component: () => import('@/views/Organization/Staff.vue'),
                    },
                    {
                        path: 'Staff/EditStaff/:id?',
                        name: 'EditStaff',
                        meta: {
                            title: '编辑员工',
                            hideMenu: true,
                        },
                        component: () => import('@/views/Organization/EditStaff.vue'),
                    },
                    {
                        path: 'Role',
                        name: 'Role',
                        meta: {
                            title: '角色管理',
                        },
                        component: () => import('@/views/Organization/Role.vue'),
                    },
                ],
            },
            // 系统设置
            {
                path: '/system',
                name: 'system',
                meta: {
                    title: '系统设置',
                    icon: 'chunf-xitongshezhi',
                },
                children: [
                    {
                        path: 'changePwd',
                        name: 'changePwd',
                        meta: {
                            title: '更改密码',
                        },
                        component: () => import('@/views/system/changePwd.vue'),
                    },
                    {
                        path: 'AlertLog',
                        name: 'AlertLog',
                        meta: {
                            title: '预警日志',
                        },
                        component: () => import('@/views/system/AlertLog.vue'),
                    },
                    {
                        path: 'OperationLog',
                        name: 'OperationLog',
                        meta: {
                            title: '操作日志',
                        },
                        component: () => import('@/views/system/OperationLog.vue'),
                    },
                    {
                        path: 'DeviceLog',
                        name: 'DeviceLog',
                        meta: {
                            title: '设备日志',
                        },
                        component: () => import('@/views/system/DeviceLog.vue'),
                    },
                    {
                        path: 'Version',
                        name: 'Version',
                        meta: {
                            title: '系统版本说明',
                        },
                        component: () => import('@/views/system/Version.vue'),
                    },
                ],
            },
        ],
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/views/system/login.vue'),
    },
    {
        path: '/userCenter',
        redirect: '/userCenter',
        component: uCenterLayout,
        children: [
            {
                path: '/userCenter',
                name: 'userCenter',
                meta: {
                    title: '用户中心',
                },
                component: () => import('@/views/system/userCenter.vue'),
            },
        ],
    },
]
