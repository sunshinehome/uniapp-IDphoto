<template>
	<view class="container">
		<view class="service-list">
			<view class="service-item" v-for="(item, index) in services" :key="index" @tap="onJump(item)">
				<image :src="item.icon" class="service-icon"></image>
				<text class="service-text">{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				services: [{
						name: '帮美邻',
						icon: 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM5tQVJPFcqjbBgQFqAFzRZ6Vf9R5oGWu58av0u9FRHsTg/0',
						appid: '',
						path: 'pages/index/index'
					},
				],
			};
		},
		onReady() {
		},
		methods: {
			onJump(option) {
				if (option.appid === '' || option.appid === null) {
					uni.showModal({
						title: '提示',
						content: '功能开发中。。。。',
						showCancel: false,
					})
				} else {
					uni.navigateToMiniProgram({
						appId: option.appid, // 目标小程序的AppID
						path: option.path, // 目标页面的路径，如果为空则打开首页
						extraData: {
							// 需要传递给目标小程序的数据，目标小程序可在 `App` 的 `onLaunch` 或 `onShow` 事件中获取到这份数据
						},
						success(res) {
							// 打开成功
						},
						fail(err) {
							// 打开失败
							console.error('跳转失败', err);
						}
					});
				}
			}
		}
	};
</script>

<style scoped>
	.container {
		padding: 20px;
	}

	.service-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.service-item {
		width: 30%;
		height: 190rpx;
		box-sizing: border-box;
		border: 1px solid #ffffff;
		background-color: #ffffff;
		margin: 20rpx 5rpx 10rpx 5rpx;
		display: flex;
		border-radius: 10px;
		flex-direction: column;
		align-items: center;
	}

	.service-icon {
		width: 60px;
		/* Adjust based on your design */
		height: 60px;
		margin: 20rpx 0 0 0 ;
		border-radius: 10px;
	}

	.service-text {
		margin: 10rpx 0 0 0;
		text-align: center;
		font-size: 12px;
	}
</style>