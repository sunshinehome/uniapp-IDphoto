<template>
	<view class="adContainer" v-if="use">
		<!-- #ifdef MP-BAIDU  -->
		<ad :appid="adsid" :apid="adpid" style="flex:1" />
		<!-- #endif -->

		<!-- #ifdef MP-KUAISHOU || MP-TOUTIAO || MP-QQ -->
		<ad :type="adsid" :unit-id="adpid" style="flex:1" />
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<ad :unit-id="adpid" :ad-type="adsid" v-if="isNaN(adpid)" style="flex:1" />
		<ad :adpid="adpid" v-else style="flex:1" />
		<!-- #endif -->

		<!-- #ifdef APP  || H5 -->
		<ad :adpid="adpid" style="flex:1" />
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
			adsid: {
				type: [String, Number],
				default: () => {
					return ''
				}
			}
		}
	}
</script>

<style scoped>
	.adContainer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex: 1;
	}
</style>