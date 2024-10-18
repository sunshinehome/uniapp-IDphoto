<template>
	<view class="app">
		<div class="imgDiv">
			<image :src="logoUrl" mode="aspectFill"></image>
		</div>
		<button type="primary" @click="wxLogin">
			授权登录
		</button>
		<view class="mt20">为了您的方便，首次使用需要授权</view>
		<view class="mt20">全本程序一律采用授权信息登陆方直接授权系统用户信息即可完成注册或登录</view>
	</view>
</template>

<script>
	import {
		showToast
	} from '@/common/js/util.js'
	import wxRequests from '../../common/js/wechat.js'

	export default {
		data() {
			return {
				userInfoObj: {},
				logoUrl: ''
			}
		},
		onLoad() {
			this.logoUrl = this.$logoUrl
			console.log('---------',this.logoUrl)
		},
		methods: {
			async wxLogin() {
				let that = this;
				const res = await wx.login();
				let userInfoObj = await wxRequests.wxGetCode(this, res.code)
				uni.setStorageSync('userInfo', userInfoObj)
				showToast('登陆成功');
				setTimeout(() => {
					//跳转创建页面
					uni.navigateBack({
						delta: 1 // 这里的 delta 表示返回的页面数，1 表示返回上一级，即返回到上一页面。
					});
				}, 2000)
			}
		},
	}
</script>


<style scoped lang='scss'>
	.app {
		text-align: center;
		padding: 20px;
	}

	.imgDiv {
		width: 200rpx;
		height: 200rpx;
		margin: 50px auto;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.mt20 {
		margin-top: 20px;
	}
</style>