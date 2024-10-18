<template>
	<!--
		@devicePosition: 摄像头位置	前置或后置摄像头，值为front, bac
		@quality: 成像质量，值为high（高质量）、normal（普通质量）、low（低质量）
	-->
	<bow-camera
		:devicePosition="front"
		:quality="high"
		@chooseImage="chooseImage"
		@confirmPhoto="confirmPhoto"
	></bow-camera>
</template>

<script>
	import bowCamera from '@/uni_modules/bow-camera/components/bow-camera/bow-camera.vue';

	export default {
		data() {
			return {
				photoSizeId: null
			}
		}, 
		components: {
		    bowCamera
		},
		onLoad(e) {
			
		},
		methods: {
			chooseImage(filePath){
				// console.log('选择的相册图片: ' + filePath);
				uni.setStorage({
					key: 'photo_info',
					data: {'id': this.$mp.query.id, 'path': filePath},
					success: function () {
						// console.log('success : ' + filePath);
						uni.navigateTo({
							url:'../modify-photo/modify-photo'
						})
					}
				});
			},
			confirmPhoto(filePath){
				// console.log('拍摄的图片: ' + filePath);
				uni.setStorage({
					key: 'photo_info',
					data: {'id': this.$mp.query.id, 'path': filePath},
					success: function () {
						// console.log('success : ' + filePath);
						uni.navigateTo({
							url:'../modify-photo/modify-photo'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
