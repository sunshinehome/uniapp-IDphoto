<template>
	<view>
		<!-- #ifdef MP-WEIXIN || APP -->
		<ad-interstitial ref="insAd" :adpid="adpid" :preload="true" :loadnext="false" @load="onadload"
			@close="onadclose" @error="onaderror" v-if="!isNaN(adpid) && use" />
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
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
			mode: {
				type: Number,
				default: () => {
					return 1
				}
			},
			interval: {
				type: Number,
				default: () => {
					return 30000
				}
			}
		},
		data() {
			return {
				isFirst: true,
				showInterval: 3000
			}
		},
		mounted() {
			if (this.use && isNaN(this.adpid)) {
				this.initAd()
			}
		},
		methods: {
			onadload() {
				if (this.mode === 1 && !this.isFirst)
					return

				setTimeout(() => {
					this.$refs.insAd.show()
				}, this.showInterval)
			},
			onadclose() {
				this.isFirst = false
				if (this.mode === 0) {
					this.showInterval = this.interval
					this.$refs.insAd.load()
				}
			},
			onaderror() {
				this.isFirst = false
				if (this.mode === 0) {
					this.showInterval = this.interval
					this.$refs.insAd.load()
				}
			},
			initAd() {
				let that = this

				var interstitialAd = uni.createInterstitialAd({
					adUnitId: that.adpid
				});

				interstitialAd.onLoad(() => {
					setTimeout(() => {
						if (that.use) {
							interstitialAd.show();
						}
					}, that.showInterval)
				});
				interstitialAd.onClose(() => {
					if (that.mode === 0) {
						that.showInterval = that.interval
						interstitialAd.load()
					}
				});
				interstitialAd.onError(() => {
					if (that.mode === 0) {
						that.showInterval = that.interval
						interstitialAd.load()
					}
				});
				interstitialAd.load()
			}
		}
	}
</script>

<style>

</style>