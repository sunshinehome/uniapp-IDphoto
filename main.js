import App from './App'
import photoSize from 'common/js/photo-size.js'

// #ifndef VUE3
import Vue from 'vue'
// import Vuex from "vuex";
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
import './uni.promisify.adaptor'
import './static/css/iconfont.css';

Vue.config.productionTip = false

// 测试服务器地址
Vue.prototype.$baseUrl = 'https://127.0.0.1:7017'
Vue.prototype.$logoUrl =
	'https://wx.qlogo.cn/mmhead/sstLNDibp2U5EM5B3cM72jpz1iabicu1fG3zhbLMIBobWbn83llXPjECaHHiaCVhYH3Q7Y8Iwzx2wk0/0'
// 全局添加证件照类型
Vue.prototype.$photoSize = photoSize
Vue.prototype.$allPhotoSize = {
	...photoSize.generics,
	...photoSize.job,
	...photoSize.country,
	...photoSize.other
}

App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif