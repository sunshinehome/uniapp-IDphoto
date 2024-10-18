<template>
	<view>
		<view class="helpConBox">
			<view class="helpTitle">{{ resultData.title }}</view>
			<view class="helpCon">{{ resultData.content }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					pageIndex: 1
				},
				resultData:{},
				answerList: [{
						title: 'a.怎么拍照好看',
						content: '可以先用手机的照相机拍照保存图片，1.拍照时头部居中，正对镜头。 2. 站在光线充足的纯色背景下。3.露出眉毛、耳朵、面部、肩部不要有遮挡。然后使用小程序的证件照上传功能，上传拍照的图片，'
					},
					{
						title: 'b.怎么找到生成的证件照？',
						content: '进入【我的】页面,先完成昵称和头像的授权,授权完成后,点击 【我的证件照】进入证件照列表,可以看到生产的证件照,同理排版照类似。'
					},
					{
						title: 'b.为什么不能分享？',
						content: '小程序功能在不断完善中。'
					},
				]
			};
		},
		onLoad(options) {
			this.resultData= this.answerList.find(item => item.title === options.title);
			this.resultData.title = options.title;
			uni.setNavigationBarTitle({
				title: options.title
			});
		},
		methods: {}
	};
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.helpTitle {
		font-size: 44rpx;
		font-weight: bold;
		margin: 50rpx 30rpx 30rpx;
		color: #1d1d21;
	}

	.helpCon {
		font-size: 30rpx;
		margin: 30rpx 30rpx 50rpx;
		color: #1d1d21;
		line-height: 50rpx;
	}
</style>