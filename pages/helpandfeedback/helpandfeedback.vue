<template>
	<view>
		<view class="feedBox" v-for="(items, index) in problem_Box" :key="index">
			<view class="feedTitle">{{ items.problemTitle }}</view>
			<view class="feedConBox">
				<view class="feedTextBox flex align-center justify-between" hover-class="contentHover"
					hover-stay-time="50" @click="goFeedDetail(item)" v-for="(item, idx) in items.problemList"
					:key="idx">
					<view class="feedText">{{ item.title }}</view>
					<view class="cuIcon-right padding-right"></view>
				</view>
			</view>
		</view>
		<view class="footBtnBox">
			<view class="footBox flex justify-around align-center">
				<view class="footIconBox" v-for="(item, index) in footData" :key="index" @click="goFeedBtn(item)">
					<button class="cu-btn bg-while" :open-type="item.wxOpenType">
						<view class="">
							<view class="footText">{{ item.text }}</view>
						</view>
					</button>
				</view>
			</view>
		</view>
		<view class="footBtnBlock"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				footData: [{
						name: 'mark',
						text: '问题反馈',
						wxOpenType: 'feedback'
					},
					//  #ifdef MP-WEIXIN
					{
						name: 'service',
						text: '在线客服',
						wxOpenType: 'contact'
					},
					// #endif
				],
				problem_Box: [{
						problemTitle: '1、热门问题',
						problemList: [{
								title: 'a.怎么拍照好看',
								pbmId: 0
							},
							{
								title: 'b.怎么找到生成的证件照？',
								pbmId: 2
							},
							{
								title: 'b.为什么不能分享？',
								pbmId: 3
							}
						]
					},
					{
						problemTitle: '2、分享相关',
						problemList: [{
								title: 'a.为什么提示“该文件类型不支持分享”？',
								pbmId: 4
							},
							{
								title: 'b.转存的文件大小超过剩余空间怎么办？',
								pbmId: 5
							},
							{
								title: 'c.如何分享多个文件？',
								pbmId: 6
							},
							{
								title: 'd.怎么分享「相册，中的图片/视频？',
								pbmId: 7
							},
							{
								title: 'e.分享文件的大小/数量，是否有限制？',
								pbmId: 8
							}
						]
					}
				]
			};
		},
		methods: {
			goFeedDetail(item) {
				uni.navigateTo({
					url: `helpdetail/helpdetail?title=${item.title}`
				});
			},
			goFeedBtn(item) {
				console.log('item===', item);
				if (item.name == 'appreciate') {
					/*打开应用市场参考：https://blog.csdn.net/Jo_liver/article/details/120464048?spm=1001.2014.3001.5501
					 */
					var appurl;
					if (plus.os.name == 'Android') {
						appurl = 'market://details?id=io.dcloud.hellouniapp'; //可能部分应用商店没有收录
					} else {
						appurl = 'itms-apps://itunes.apple.com/cn/app/hello-uni-app/id1417078253';
					}
					plus.runtime.openURL(appurl, function(res) {
						console.log('打开应用市场==', res);
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.feedBox {
		margin: 30rpx;

		.feedTitle {
			font-size: 32rpx;
			font-weight: bold;
			color: #1d1d21;
			margin: 20rpx 0;
		}

		.feedConBox {
			background: #ffffff;
			box-shadow: 0px 0px 10rpx rgba(193, 193, 193, 0.2);
			border-radius: 16rpx;

			.feedTextBox {
				border-top: 1rpx solid rgba(213, 213, 213, 0.2);
			}

			.feedText {
				padding: 30rpx;
				font-size: 30rpx;
				color: #1d1d21;
			}

			&:nth-of-type(1) {
				border-top: none;
			}
		}
	}

	.footBtnBox {
		display: flex;
		position: fixed;
		bottom: 0rpx;
		background-color: #f2f2f2;
		width: 100%;
		height: 140rpx;

		.footBox {
			width: 92%;
			height: 120rpx;
			padding: 30rpx;
			margin: 10rpx 30rpx 10rpx;
			background: #ffffff;
			box-shadow: 0px 0px 10px rgba(193, 193, 193, 0.2);
			border-radius: 16rpx;
			display: flex;
			/* 开启 Flexbox 布局 */
			justify-content: space-between;
			/* 按钮之间的间距平均分布 */
		}

		.footIconBox {
			width: 33.33%;
			text-align: center;
			.cu-btn {
				padding: 0;
				background-color: #ffffff;
				line-height: 50rpx;
			}
			image{
				width: 30rpx;
				height: 30rpx;
			}
		}

		.footText {
			font-size: 30rpx;
			color: #1d1d21;
		}
	}

	.footBtnBlock {
		width: 100%;
		height: 150rpx;
	}

	.opacityHover {
		opacity: 0.6 !important;
	}
</style>