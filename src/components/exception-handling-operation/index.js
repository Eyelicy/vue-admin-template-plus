import { defineAsyncComponent } from 'vue'

const components = import.meta.glob('./*.vue') //

export default function install(app) {
    for (const [key, value] of Object.entries(components)) {
        // 获取组件名
        const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
        // 注册组件
        app.component(name, defineAsyncComponent(value))
    }
}
