<template>
	<view class="content">
		<view class="box"
			v-for="(option, index) in options" :key="index"
			@click="clickedBox(option)"
			>
			<text class="t1">{{ option.title }}</text>
			<text class="t2">{{ option.info }}</text>
		</view>

		<view class="empty" v-if="!options.length || finish">没有更多数据了</view>
	</view>
	
	
</template>

<script>
	import props from './props.js';
	
	export default {
		mixins: [props],
		data() {
			return {
			}
		},
		methods: {
			clickedBox(option){
				this.$emit('clickedBox', option);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../../static/css/components.scss";
	
	.content {
		background-color: #f3f4f6;
		padding: 10rpx;
		
		.empty {
			margin-top: 30rpx;
			text-align: center;
			font-size: 28rpx;
			color: #909399;
		}
	}
		
	.box {
		margin: 10rpx 15rpx 10rpx 15rpx;
		padding: 25rpx;
		background-color: white;
		border-radius: 10rpx;
		box-shadow: 1rpx 1rpx 1rpx #eee;
	}
	
	.box .t1 {
		font-size: 32rpx;
		color: #303133;
	}
	
	.box .t2 {
		padding: 5rpx 0 5rpx;
		font-size: 25rpx;
		color: #909399;
	}
</style>