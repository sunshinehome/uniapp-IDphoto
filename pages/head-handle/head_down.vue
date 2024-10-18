<template>
	<view class="top-content">
		<u-scroll-list>
			<view class="scroll-list">
				<view class="scroll-list__line" v-for="(item, index) in classifyImgList" :key="index">
					<view class="scroll-list__line__item" v-for="(item1, index1) in item" :key="index1"
						:class="[(index1 === item.length - 1) && 'scroll-list__line__item--no-margin-right']">
						<image class="scroll-list__line__item__image" :src="item1.url" mode="" @tap="popModal(item1)">
						</image>
					</view>
				</view>
			</view>
		</u-scroll-list>
		<u-modal :title="title" :content="content" :show="popshow" showCancelButton closeOnClickOverlay
			@confirm="confirm" @cancel="cancel" @close="close"></u-modal>
	</view>
</template>

<script>
	import requests from '@/common/js/requests.js'
	export default {
		data() {
			return {
				userInfoObj: {},
				fullscreenShow: false,
				classifyImgList: [],
				popshow: false,
				imgInfo: {},
				title: '温馨提示',
				content: '完整观看5-30秒视频，可以免费制作下载',
			}
		},
		onLoad() {
			this.userInfoObj = uni.getStorageSync('userInfo');
		},
		onReady() {
			this.getTypeData(11);
		},
		methods: {
			async popModal(item) {
				var that = this
				this.imgInfo = item;
				const data = {
					"userId": this.userInfoObj.userId
				};
				const num = await requests.currentGetRequest(that, data, '/api/User/GetAllNum');
				if (num < 2) {
					this.excDown();
				} else {
					this.popshow = true;
				}
			},
			confirm() {
				this.popshow = false
				this.downClick();
			},
			cancel() {
				this.popshow = false;
			},
			close() {
				this.popshow = false;
			},
			async excDown() {
				var that = this
				uni.showToast({
					title: '开始下载',
					duration: 2000
				});
				let tempath = await requests.downloadPhoto(that, this.imgInfo.url);
				console.log('----1-----', this.userInfoObj)
				const data = {
					"userId": this.userInfoObj.userId
				};
				
				requests.currentGetRequest(that, data, '/api/User/AddNums');
				uni.saveImageToPhotosAlbum({
					filePath: tempath,
					success: function() {
						uni.showToast({
							title: '保存成功',
							duration: 2000
						});
					},
					fail: function(errmsg) {
						uni.showToast({
							title: '保存失败',
							duration: 2000
						});
					}
				});
			},
			async downClick() {
				let that = this;
				let videoAd = null
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-6e1e20c8451c0c5d'
					})
					videoAd.onLoad(() => {

					})
					videoAd.onError((err) => {
						console.error('激励视频光告加载失败', err)
					})
					videoAd.onClose(async (res) => { // 用户点击了【关闭广告】按钮
						if (res && res.isEnded) {
							this.excDown();
						} else {
							uni.showToast({
								title: '亲，需要观看完成广告后，才可以下载',
								icon: 'none',
								duration: 2000
							});
						}

					})
				}
				// 用户触发广告后，显示激励视频广告
				if (videoAd) {
					videoAd.show().catch(() => {
						// 失败重试
						videoAd.load()
							.then(() => videoAd.show())
							.catch(err => {
								console.error('激励视频 广告显示失败', err)
							})
					})
				}
			},
			async getTypeData(type) {
				var that = this
				const data = {
					// "groupId": 0,
					"parentType": type,
					// "typeId": 0,
				}
				const list = await requests.currentPostRequest(that, data, '/api/Type/getTypeList');
				this.classifyGroup(list);
			},
			classifyGroup(list) {
				const groupedByGroupId = list.reduce((accumulator, item) => {
					// 如果 accumulator 中还没有当前 groupId 的数组，则创建一个
					if (!accumulator[item.groupId]) {
						accumulator[item.groupId] = [];
					}
					// 将当前项添加到对应 groupId 的数组中
					accumulator[item.groupId].push(item);
					return accumulator;
				}, {});

				// 将 groupedByGroupId 对象转换为数组的数组
				this.classifyImgList = Object.values(groupedByGroupId);
			},
		}
	}
</script>

<style lang="scss">
	.top-content {
		width: 90%;
		height: 700px;
		background-color: white;
		border-radius: 20px;
		margin: 0 auto;
	}

	.scroll-list {
		@include flex(column);

		&__line {
			@include flex;
			margin-top: 10px;

			&__item {
				margin-right: 15px;

				&__image {
					width: 150rpx;
					height: 150rpx;
					border-radius: 20rpx;
					border: 2px solid #f7f8fa;
					margin: 20rpx 10rpx 10rpx 10rpx;
				}

				&--no-margin-right {
					margin-right: 0;
				}
			}
		}
	}
</style>