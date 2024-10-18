<template>
	<view class="content">
		<Tips ref="tips" />
		<view class="top-card">
			<view class="search">
				<u-search :showAction="false" placeholder="搜索规格名称、尺寸" @click="onSearchClicked" disabled></u-search>
			</view>
			<u-swiper :list="carouselList" keyName="image" showTitle previousMargin="30" nextMargin="30" circular
				:autoplay="true" radius="5" height="150" bgColor="#00000000" @click="onHeadClick() "></u-swiper>
			<view class="grid">
				<u-grid col="4" align="center">
					<u-grid-item v-for="(listItem, listIndex) in hot_list" :key="listIndex" align="center"
						@tap="onSearchClicked(listItem[0])">
						<i :class="listItem[1]" style="font-size: 70rpx; color: #FFF; "></i>
						<u--text size=16 align="center" :text="listItem[0]" color="#FFF"></u--text>
					</u-grid-item>
				</u-grid>
			</view>

		</view>
		<view class="body-card">
			<u-text text="常用工具" size="20"></u-text>
			<view class="box">
				<u-scroll-list :indicator="indicator" indicatorColor="#fff0f0" indicatorActiveColor="#f56c6c">
					<view class="scroll-item" v-for="(item, index) in toolList" :key="index" @tap="clickedTools(item)">
						<image :src="item.icon"></image>
						<view>{{ item.title }}</view>
					</view>
				</u-scroll-list>
			</view>
		</view>
		<view class="body-card">
			<u-text text="常用尺寸" size="20"></u-text>
			<u-grid col="2" align="center">
				<u-grid-item v-for="(option,listIndex) in spec_list" :key="listIndex" @tap="clickedBox(option)">
					<view class="spec-card">
						<u--text size=16 align="left" :text="option.title"></u--text>
						<u--text size=14 align="left" :text="option.spec" type="info"></u--text>
					</view>
				</u-grid-item>
			</u-grid>
		</view>
	</view>
</template>

<script>
	import Tips from "@/components/S-Tips/Tips.vue"
	export default {
		components: {
			Tips
		},
		data() {
			return {
				hot_list: [
					["考试", "iconfont icon-sifakaoshi"],
					["签证", "iconfont icon-qianzheng"],
					["职业", "iconfont icon-zhiye1"],
					["证件", "iconfont icon-a-mingpianzhengjian"]
				],
				carouselList: [{
						image: '',
						title: '点击我，快速制作国庆节专属头像',
						path: '../head-handle/index'
					},
					{
						image: '',
						title: '点击我，快速制作国庆节专属头像',
						path: '../head-handle/index'
					},
					{
						image: '',
						title: '点击我，快速下载姓氏头像',
						path: '../head-handle/head_down',
					},

				],
				spec_list: [
					// 小一寸				一寸
					this.$allPhotoSize[1], this.$allPhotoSize[2],
					// 大一寸				二寸
					this.$allPhotoSize[3], this.$allPhotoSize[5],
					// 小二寸				大二寸
					this.$allPhotoSize[4], this.$allPhotoSize[6],
					// 三寸				  自定义尺寸
					this.$allPhotoSize[7], this.$allPhotoSize[8],
				],
				toolList: [{
						icon: '../../static/img/photo_icon.svg',
						title: '头像制作',
						path: '../head-handle/index'
					},
					{
						icon: '../../static/img/download.svg',
						title: '头像下载',
						path: '../head-handle/head_down',

					},
					{
						icon: '../../static/img/box_icon.svg',
						title: '百宝箱',
						path: '../bbox/index'
					},
					{
						icon: '../../static/img/developed.svg',
						title: '待开发',
						path: '../index/index'
					},
				],
				userInfoObj: {},
			}
		},
		onLoad() {

		},
		onHide() {
			this.$refs.tips.closeTips()
			console.log('触发了onHide事件')
		},
		methods: {
			onSearchClicked(keyword = '') {
				// let x='@/img/'
				//跳转搜索页面
				uni.navigateTo({
					url: '../search/search?keyword=' + keyword
				})
			},
			clickedBox(option) {
				console.log(option.id);
				this.userInfoObj = uni.getStorageSync('userInfo');
				console.log('用户信息：', JSON.stringify(this.userInfoObj))
				if (this.userInfoObj === '' || this.userInfoObj.nickname === '') {
					//跳转创建页面
					uni.navigateTo({
						url: '../login/login'
					})
				} else {
					//跳转创建页面
					uni.navigateTo({
						url: '../create-photo/create-photo?id=' + option.id
					})
				}
			},
			clickedTools(option) {
				this.userInfoObj = uni.getStorageSync('userInfo');
				console.log('用户信息：', JSON.stringify(this.userInfoObj))
				if (this.userInfoObj === '' || this.userInfoObj.nickname === '') {
					//跳转创建页面
					uni.navigateTo({
						url: '../login/login'
					})
				} else {
					//跳转创建页面
					uni.navigateTo({
						url: option.path + '?id=' + option.id
					})
				}
			},
			onHeadClick(index) {
				//跳转创建页面
				uni.navigateTo({
					url: this.carouselList[index].path
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.srcool {
		width: 100%;
		background-color: #ffffff; // 首页头部 背景
	}


	.box {
		width: 100%;
		margin: 0 auto;
		height: 250rpx;
		background-color: #ffffff; // 首页头部 背景
		border-radius: 10px;

		.u-scroll-list {
			margin: 20rpx 0 0 0;
			text-align: center;

			image {
				width: 60px;
				height: 60px;
				margin: 25px 12px 0 12px;
				border-radius: 10px;
				/* 设置圆角为10px */
				// background-color: #dddddd;
			}

			view {
				line-height: 20px;
				font-size: 12px;
			}
		}
	}

	.top-card {
		width: 100vw;
		padding-bottom: 25rpx;
		background-image: linear-gradient(to top, #a7a1ff, #f893ff); // 首页头部 背景
	}


	.top-card .search {
		padding: 40rpx;
	}

	.top-card .grid {
		margin: 10rpx 0 0 0;
	}

	.body-card {
		padding: 0 30rpx 30rpx 30rpx;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		background-color: $u-bg-color;
	}

	.body-card .u-text {
		padding: 10rpx 0 0 10rpx;
	}

	.body-card .spec-card {
		width: 34vw;
		padding: 38rpx;
		margin: 15rpx 0 5rpx 0;
		border-radius: 10rpx;
		box-shadow: 1rpx 1rpx 1rpx #dddddd;
		background-color: #FFF;
	}


	.u-block__content .u-row {
		margin: 35rpx 0 0 35rpx;
	}

	.u-block__content .layout {
		color: #E9FFF7;
		padding: 5rpx;
		border-radius: 4rpx;
		border: 1rpx solid #E9FFF7;
		border-radius: 5px;
	}
</style>