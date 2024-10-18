<template>
	<view class="content">
		<view class="top">
			<view class="background"></view>
		</view>
		<view class="user-card">
			<view class="card">
				<view class="top">
					<view class="userImage">
						<image :src="userAvatarUrl" class="avatar" mode="aspectFill">
						</image>
					</view>
				</view>
				<view class="bottom">
					<view class="left">
						<view class="user-text">
							<!-- <open-data type="userNickName">{{nickname}}</open-data> -->
							<view>{{nickname}}</view>
						</view>
					</view>
					<view class="right flex-center">
						<u-icon class="icon" name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="list-card">
			<view class="card">
				<view class="item item-bottom-solid" @tap="myPhotolist(1)">
					<view class="left flex-center">
						<image src="../../static/img/照片2.png" mode="aspectFit"></image>
					</view>
					<view class="center">
						<text>我的证件照</text>
					</view>
					<view class="right flex-center">
						<u-icon class="icon" name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="item item-bottom-solid" @tap="myPhotolist(2)">
					<view class="left flex-center">
						<image src="../../static/img/照片墙.png" mode="aspectFit"></image>
					</view>
					<view class="center">
						<text>我的排版照</text>
					</view>
					<view class="right flex-center">
						<u-icon class="icon" name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="item" @tap="openService()">
					<view class="left flex-center">
						<image src="../../static/img/客服.png" mode="aspectFit"></image>
					</view>
					<view class="center">
						<text>客服帮助</text>
					</view>
					<view class="right flex-center">
						<u-icon class="icon" name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<wxwinpopup ref="wxwinpopup"></wxwinpopup>
	</view>
</template>

<script>
	import wxwinpopup from '@/components/wx/wxLogin.vue';
	import wxRequest from '@/common/js/wechat.js';
	export default {
		components: {
			wxwinpopup
		},
		data() {
			return {
				userInfoObj: {},
				isShow: false, // 控制弹窗显示隐藏
				nickname: '微信用户',
				userAvatarUrl: '',
			};
		},
		//监听页面初始化，其参数同 onLoad 参数，为上个页面传递的数据，参数类型为 Object（用于页面传参），触发时机早于 onLoad
		onInit() {},
		//监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参）
		onLoad() {
			this.userAvatarUrl = this.$logoUrl
			this.userInfoObj = uni.getStorageSync('userInfo');
			if (this.userInfoObj !== '' || this.userInfoObj !== null) {
				if (this.userInfoObj.nickName === '' || this.userInfoObj.nickName === null) {
					this.$refs.wxwinpopup.show = true
				} else {
					this.nickname = this.userInfoObj.nickName
				}
			}
		},
		//监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady() {},
		onShow() {
			this.userInfoObj = uni.getStorageSync('userInfo');
		},
		//监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		beforeDestroy() {},
		//页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。
		onReachBottom() {},
		onShareAppMessage(res) {},
		created() {

		},
		methods: {
			loginWin() {
				this.$refs.wxwinpopup.show = true
			},
			openService() {
				uni.navigateTo({
					url: '../helpandfeedback/helpandfeedback'
				})
			},
			myPhotolist(val) {
				console.log('-------------3------------', this.userInfoObj)
				if (this.userInfoObj === '' || this.userInfoObj === null) {
					uni.navigateTo({
						url: '../login/login'
					})
				}
				uni.navigateTo({
					url: '../my/photo-list/index?type=' + val
				})
			},
			async backWxUserInfo(wxUserData) {
				this.nickname = wxUserData.nickname
				this.userAvatarUrl = wxUserData.active

				if (wxUserData.nickName !== '' || wxUserData.nickName !== null) {
					const userInfo = await wxRequest.wxGetUserInfo(this, this.userInfoObj.userId, this.nickname, this
						.userAvatarUrl);
					uni.setStorageSync('userInfo', userInfo)
				}
				//更新用户信息
				this.userInfoObj = uni.getStorageSync('userInfo');
				this.$refs.wxwinpopup.show = false
			},
		},
	};
</script>

<style lang="scss" scoped>
	.top {
		height: 300rpx;
		position: relative;

		.background {
			background: linear-gradient(to top, #99b8ff, #fa6a8c);
			// border-bottom-left-radius: 22px;
			// border-bottom-right-radius: 22px;
			position: absolute;
			height: 300rpx;
			width: 100%;
		}
	}

	.icon {
		color: #96a1ae;
		font-size: 40rpx;
	}

	.user-card {
		height: 170rpx;
		padding: 0 15px;

		.card {
			position: relative;
			bottom: 62px;
			height: 250rpx;
			background-color: white;
			border-radius: 5px;

			.top {
				height: 30%;
				position: relative;

				.userImage {
					position: absolute;
					bottom: 24%;
					left: 10%;
					overflow: hidden;

					image {
						width: 150rpx;
						height: 150rpx;

						border-radius: 50%;
						border: 2px solid white;
					}
				}
			}

			.bottom {
				display: flex;
				height: 70%;

				.left {
					width: 80%;
					height: 100%;
					position: relative;

					.user-text {
						width: 100%;
						font-size: 1.6em;
						padding-left: 80rpx;
						height: 50%;
					}
				}

				.right {
					width: 20%;
					height: 50%;
				}
			}
		}
	}

	.list-card {
		padding: 0 15px;

		.card {
			border-radius: 5px;
			position: relative;
			background-color: white;
			border-radius: 5px;
			padding: 5px 30px;

			.item {
				display: flex;
				height: 120rpx;

				.left {
					width: 15%;

					image {
						width: 70rpx;
						height: 70rpx;
					}
				}

				.center {
					width: 65%;
					padding-left: 10rpx;
					display: flex;
					justify-content: start;
					align-items: center;
					font-size: 1.1em;
				}

				.right {
					width: 20%;
					justify-content: flex-end;
				}
			}
		}
	}

	.item-bottom-solid {
		border-bottom: 1px solid #d4d6da;
	}

	.quit {
		height: 100rpx;
		margin-top: 50px;

		.btn {
			background-color: #4f99ff;
			border-radius: 30px;
			width: 80%;
			color: white;
			font-size: 1.2em;
			height: 100%;
		}
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>