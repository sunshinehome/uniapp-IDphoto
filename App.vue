<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// const userInfoObj = uni.getStorageSync('userInfo');
			// if (userInfoObj === '' || userInfoObj === null) {
			// 	uni.reLaunch({
			// 		url: '/pages/login/login'
			// 	})
			// } else {
			// 	uni.reLaunch({
			// 		url: '/pages/index/index'
			// 	})
			// }
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "/uni_modules/uview-ui/index.scss";

	page {
		background-color: $u-bg-color;
	}
</style>