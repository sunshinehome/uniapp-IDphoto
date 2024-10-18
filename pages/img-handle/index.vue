<template>
	<view class="container">
		<imageCut :avatar="imageSrc" @save="save"></imageCut>
	</view>
</template>

<script>
	import imageCut from "@/components/img/yuanlei-image-cut"
	export default {
		components: {
			imageCut
		},
		data() {
			return {
				imageSrc: "",
			}
		},
		created() {
			const photoInfo = uni.getStorageSync('photo_info');
			if (photoInfo) {
				this.imageSrc = photoInfo.path;
			}
		},
		onShow() {

		},
		methods: {
			save(e) {
				this.navigateToModify(e.avatar);
			},
			navigateToModify(filePath) {
				uni.setStorage({
					key: 'photo_info',
					data: {
						'path': filePath
					},
					success: function() {
						uni.navigateBack({
							delta: 1
						});
					}
				})
			},
		}
	}
</script>

<style>
</style>