<template>
	<view>
		<!-- #ifdef MP-WEIXIN || APP -->
		<ad-rewarded-video ref="adRewardedVideo" :adpid="adpid" :preload="true" :loadnext="true" @load="onadload" @close="onadclose" @error="onaderror" v-if="!isNaN(adpid) && use" />
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		emits:["onClose"],
		props: {
			use: {
				type: Boolean,
				default: () => {
					return false
				}
			},
			adpid: {
				type: [String, Number],
				default: () => {
					return ''
				}
			},
			adsid: {
				type: [String, Number],
				default: () => {
					return ''
				}
			}
		},
		data() {
			return {
				adLoaded: false,
				rewardedVideoAd: null
			}
		},
		methods: {
			onadload: function() {
				this.adLoaded = true
			},
			onadclose: function(e) {
				this.$emit('onClose', e.detail)
			},
			onaderror: function() {
				this.adLoaded = false
			},
			initAd: function() {
				if (!uni.canIUse('createRewardedVideoAd')) return false

				if (this.rewardedVideoAd?.closeHandler) {
					try {
						this.rewardedVideoAd.offClose(this.rewardedVideoAd.closeHandler);
					} catch (e) {
						console.error(e);
					}
				}

				if (this.rewardedVideoAd?.errorHandler) {
					try {
						this.rewardedVideoAd.offError(this.rewardedVideoAd.errorHandler);
					} catch (e) {
						console.error(e);
					}
				}

				let rewardedVideoAd = this.rewardedVideoAd = uni.createRewardedVideoAd({
					// #ifdef APP
					adpid: this.adpid,
					// #endif

					// #ifdef MP-BAIDU
					appSid: this.adsid,
					adUnitId: this.adpid,
					// #endif

					// #ifdef MP-KUAISHOU
					type: this.adsid,
					unitId: this.adpid,
					// #endif

					// #ifdef MP-QQ || MP-TOUTIAO || MP-WEIXIN || MP-ALIPAY
					adUnitId: this.adpid,
					// #endif
				})

				rewardedVideoAd.errorHandler = (e)=> {
					console.log(e)
				}

				rewardedVideoAd.closeHandler = (e)=> {
					this.$emit('onClose', e)
				};

				rewardedVideoAd.onError(rewardedVideoAd.errorHandler)

				rewardedVideoAd.onClose(rewardedVideoAd.closeHandler)

				return true
			},
			showAd: function() {
				let that = this
				if (that.use) {
					// #ifdef MP-WEIXIN || APP
					if (isNaN(that.adpid)) {
						if (that.initAd()) {
							that.rewardedVideoAd.show()
								.catch(() => {
									setTimeout(() => {
										that.rewardedVideoAd.load()
											.then(() => {
												that.rewardedVideoAd.show()
											})
											.catch(() => {
												uni.$g.tip.showToast('没有可以展示的广告！')
											})
									}, 50)
								})
						}
					} else {
						if (that.adLoaded) {
							that.$refs.adRewardedVideo.show()
						} else {
							uni.$g.tip.showToast('广告尚未准备好，请重试！')
						}
					}
					// #endif

					// #ifndef  MP-WEIXIN || APP
					if (that.initAd()) {
						that.rewardedVideoAd.show()
							.catch(() => {
								setTimeout(() => {
									that.rewardedVideoAd.load()
										.then(() => {
											that.rewardedVideoAd.show()
										})
										.catch(() => {
											uni.$g.tip.showToast('没有可以展示的广告！')
										})
								}, 50)
							})
					}
					// #endif
				} else {
					that.$emit('onClose', {
						isEnded: true
					})
				}
			}
		}
	}
</script>

<style>

</style>