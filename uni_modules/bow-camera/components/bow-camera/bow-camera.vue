<template>
	<view class="content"
		style="position: fixed;top: 0;left: 0;z-index: 777;width: 100%;height: 100vh;background-color: #FFFFFF;">
		<camera @error="handleCameraError" :device-position="position" flash="off"
			v-if="!cameraImage"
			style="width: 100%; height: 84vh;">
			<cover-image src="@/uni_modules/bow-camera/static/avater.png"
				style="width: 86vw; height: 45vh; margin:15vh 7vw 0 7vw;"></cover-image>
		</camera>
		<!-- 确认拍照照片 -->
		<image
			v-if="cameraImage" :src="cameraImage"
			style="width: 100%; height: 84vh;"
		></image>
		<!-- 准备拍照 -->
		<view v-if="!cameraImage" class="btns" style="width: 100%;height: 16vh;background: #3B4144; padding-bottom: 25rpx;">
			<image class="item" @tap="chooseImage" src="@/uni_modules/bow-camera/static/xiangce.png"></image>
			<image class="item_center" @tap="takePhotoByHead" src="@/uni_modules/bow-camera/static/paizhaoanniu.png"></image>
			<image class="item" @tap="reverseCamera" src="@/uni_modules/bow-camera/static/fanzhuan.png"></image>
		</view>
		<!-- 拍照完成 -->
		<view v-if="cameraImage" class="btns" style="width: 100%;height: 16vh;background: #3B4144; padding-bottom: 25rpx;">
			<image class="img_btn" @tap="cameraImage = ''" src="@/uni_modules/bow-camera/static/restart.png"></image>
			<image class="img_btn"></image>
			<image class="img_btn" @tap="confirmPhoto" src="@/uni_modules/bow-camera/static/confirm.png"></image>
		</view>
		<view class="error-handler" v-if="!authCamera">
			<button class="nobtn" openType="openSetting">获取相机权限失败</button>
		</view>
	</view>
</template>

<script>
	import props from './props.js'
	
	export default {
		mixins: [props],
		data() {
			return {
				ctxHeader: null,
				cameraImage: '',
				position: this.devicePosition
			}
		}, 
		beforeCreate() {
			// #ifdef MP-WEIXIN
			//获取相机权限
			uni.getSetting({
				success: (res) => {
					console.log('相机权限:', res)
					if (res.authSetting["scope.camera"]) {
						this.authCamera = true
					} else {
						this.authCamera = false
						console.log('没有获取到相机权限:', res)
						uni.showToast({
							title: '请确认是否允许获取您的相机权限！',
							icon: 'none'
						})
					}
				},
				fail: (err) => {
					console.log('相机权限获取失败:', res)
				}
			})
			// #endif
		},
		methods: {
			chooseImage(){
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: (res)=> {
						this.filePath = res.tempFilePaths[0]
						this.$emit('chooseImage', this.filePath)
				    }
				});
			},
			//拍摄头像
			takePhotoByHead() {
				this.ctxHeader = uni.createCameraContext();
				this.ctxHeader.takePhoto({
					quality: this.quality,
					success: (res) => {
						// console.log(res)
						uni.compressImage({
							src: res.tempImagePath,
							quality: this.compress, //压缩比例
							success: ress => {
								this.cameraImage = ress.tempFilePath; //图片
							}
						})
					},
					fail: (err) => {
						console.log('fail 拍照失败: ' + err);
						uni.showToast({
							title: '拍照失败',
							icon: 'none'
						})
					}
				});
			},
			handleCameraError() {
				uni.showToast({
					title: '用户拒绝使用摄像头',
					icon: 'none'
				})
			},
			reverseCamera() {
				this.position = (("back" === this.position) ? "front" : "back")
			},
			confirmPhoto() {
				this.$emit('confirmPhoto', this.cameraImage)
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: #fff;
		box-sizing: border-box;
		height: 100%;
		width: 100vw;

		.btns {
			display: flex;
			justify-content: space-around;
			align-items: center;
			
			.img_btn {
				width: 110rpx;
				height: 110rpx;
				border-radius: 60rpx;
			}
			
			.item_center {
				width: 130rpx;
				height: 130rpx;
			}
			
			.item {
				width: 90rpx;
				height: 90rpx;
			}

		}
	}
</style>
