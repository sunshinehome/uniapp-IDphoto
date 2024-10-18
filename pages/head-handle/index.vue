<template>
	<view class="content">
		<u-overlay :show="fullscreenShow" @click="show = false"></u-overlay>
		<image :src="background" class="all-back"></image>
		<view class="top-content">
			<u-tabs :list="classifyList" @change="classifyClick()" :selected-index="selectedIndex"></u-tabs>
			<u-scroll-list>
				<view class="scroll-list">
					<view class="scroll-list__line" v-for="(item, index) in classifyImgList" :key="index">
						<view class="scroll-list__line__item" v-for="(item1, index1) in item" :key="index1"
							:class="[(index1 === item.length - 1) && 'scroll-list__line__item--no-margin-right']">
							<image class="scroll-list__line__item__image" :src="item1.url" mode=""
								@tap="templateClick(item1)"></image>
						</view>
					</view>
				</view>
			</u-scroll-list>
		</view>

		<view class="image-card">
			<view class="photo-main-view">
				<!--头像制作  -->
				<view class="avatar-div " id="avatar-container">
					<image class="img" id="avatar-img" :src="userHeadImg"></image>
					<image class="avatar-default " :src="templateImg"></image>
					<canvas canvas-id="mergeCanvas"
						:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', position: 'fixed', left: '-9999px', top: '-9999px' }"></canvas>
				</view>

				<view class="ctlbtn">
					<button class="action-btn btn-head" open-type="chooseAvatar"
						@chooseavatar="onChooseAvatar">获取头像</button>
					<view class="action-btn btn-photo" @tap="navigateToModify()">制作头像</view>
					<view class="action-btn btn-primary" @click="popModal()">保存头像</view>
				</view>
			</view>
		</view>
		<view class="hideCanvasView">
			<canvas class="hideCanvas" id="default_PosterCanvasId" canvas-id="default_PosterCanvasId"
				:style="{ width: (poster.width || 10) + 'px', height: (poster.height || 10) + 'px' }"></canvas>
		</view>
		<view class="pageLoading" v-show="loading">
			<full-loading :bgColor="loadingBgColor" />
		</view>
		<u-modal :title="title" :content="content" :show="popshow" showCancelButton closeOnClickOverlay
			@confirm="confirm" @cancel="cancel" @close="close"></u-modal>
	</view>
</template>
<script>
	import {
		getSharePoster
	} from '@/common/js/QS-SharePoster.js';
	import requests from '@/common/js/requests.js'
	export default {
		data() {
			return {
				poster: {},
				posterImage: '',
				userInfoObj: {},
				fullscreenShow: false,
				canvasId: 'default_PosterCanvasId',
				imageList: [], // 返回数据
				selectedIndex: 0,
				background: "",
				templateImg: '', // 模板图片地址
				userHeadImg: '', // 上传图片地址
				canvasWidth: 0,
				canvasHeight: 0,
				popshow: false,
				title: '温馨提示',
				content: '完整观看5-30秒视频，可以免费制作下载',
				classifyList: [{
						id: 1,
						name: '热门',
					},
					{
						id: 2,
						name: '国旗',
					}, {
						id: 3,
						name: '渐变'
					}, {
						id: 4,
						name: '清爽'
					}, {
						id: 5,
						name: '祖国'
					}, {
						id: 6,
						name: '其他'
					}
				],
				classifyImgList: [],
			}
		},
		onLoad() {
			this.getTypeData(10);
			uni.setStorageSync('photo_info', '');
			this.userInfoObj = uni.getStorageSync('userInfo');
			console.log('--------1-------------',this.userInfoObj)
		},
		onReady() {},
		onShow() {
			const photoInfo = uni.getStorageSync('photo_info');
			if (photoInfo) {
				this.downloadimg(photoInfo.path);
			}
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
					this.excSave();
				} else {
					this.popshow = true;
				}
			},
			confirm() {
				this.popshow = false;
				if (!this.userHeadImg || !this.templateImg) {
					uni.showToast({
						title: '请先获取头像和选择模板',
						icon: 'none'
					});
					return;
				}
				this.saveBtn1();
			},
			cancel() {
				this.popshow = false;
			},
			close() {
				this.popshow = false;
			},
			async excSave() {
				var that = this
				this.fullscreenShow = true;
				uni.showLoading({
					title: '图片处理中。。。'
				});
				const d = await getSharePoster({
					that: this, //若在组件中使用 必传
					type: 'testShareType',
					formData: {
						//访问接口获取背景图携带自定义数据
					},
					backgroundImage: this.userHeadImg,
					posterCanvasId: this.canvasId, //canvasId
					delayTimeScale: 20, //延时系数
					drawArray: ({
						bgObj,
						type,
						bgScale
					}) => {
						//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
						return new Promise((rs, rj) => {
							rs([{
								type: 'image',
								url: this.templateImg,
								dx: 0,
								dy: 0,
								infoCallBack(imageInfo) {
									return {
										dWidth: bgObj
											.width, // 因为设置了圆形图片 所以要乘以2
										dHeight: bgObj
											.height
									};
								}
							}]);
						});
					},
					setCanvasWH: ({
						bgObj,
						type,
						bgScale
					}) => {
						// 为动态设置画布宽高的方法，
						this.poster = bgObj;
					}
				});
				this.posterImage = d.poster.tempFilePath;
				this.fullscreenShow = false;
				const data = {
					"userId": this.userInfoObj.userId
				};
				requests.currentGetRequest(that, data, '/api/User/AddNums');
				this.savefile();
				
			},
			async saveBtn() {
				if (!this.userHeadImg) {
					uni.showToast({
						title: '请先获取头像',
						icon: 'none'
					});
					return;
				}
				try {
					let videoAd = null
					// 在页面onLoad回调事件中创建激励视频广告实例
					if (wx.createRewardedVideoAd) {
						videoAd = wx.createRewardedVideoAd({
							adUnitId: 'adunit-562cd9f4c5f23f37'
						})
						videoAd.onLoad(async () => {

						})
						videoAd.onError((err) => {
							console.error('激励视频光告加载失败', err)
						})
						videoAd.onClose(async (res) => {
							// 用户点击了【关闭广告】按钮
							if (res && res.isEnded) {
								this.excSave();
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
								.then(() => videoAd.show(

								))
								.catch(err => {
									console.error('激励视频 广告显示失败', err)
								})
						})
					}


				} catch (e) {
					this.fullscreenShow = false;
				}
			},
			savefile() {
				//获取相册授权
				let that = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									uni.hideLoading();
									//这里是用户同意授权后的回调
									that.saveImgToLocal();
								},
								fail(e) {
									uni.hideLoading();
									uni.showModal({
										content: '检测到您没打开下载图片功能权限，是否去设置打开？',
										confirmText: '确认',
										cancelText: '取消',
										success: function(res) {
											//点击“确认”时打开设置页面
											if (res.confirm) {
												wx.openSetting();
											}
										}
									});
								}
							});
						} else {
							//用户已经授权过了
							that.saveImgToLocal();
						}
					}
				});
			},
			saveImgToLocal(e) {
				let that = this;
				uni.saveImageToPhotosAlbum({
					filePath: this.posterImage,
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
			onChooseAvatar(e) {
				let that = this;
				this.downloadimg(e.detail.avatarUrl);
			},
			async getTypeData(type) {
				var that = this
				const data = {
					// "groupId": 0,
					"parentType": type,
					// "typeId": 0,
				}
				this.imageList = await requests.currentPostRequest(that, data, '/api/Type/getTypeList');
				let list = this.imageList.filter(s => s.typeId == (this.selectedIndex + 1));
				this.classifyGroup(list);

			},
			templateClick(item) {
				this.templateImg = item.url;
			},
			// 分类变换
			classifyClick(item) {
				this.selectedIndex = item.index;
				let list = this.imageList.filter(s => s.typeId == (this.selectedIndex + 1));
				console.log()
				this.classifyGroup(list);
			},
			selectImageFromLocal() {
				uni.chooseImage({
					count: 1, // 只能选择一张图片
					sourceType: ['album', 'camera'], // 支持从相册、摄像头选择图片
					crop: {
						quality: 80
					},
					success: res => {
						const filePath = res.tempFiles[0].path; // 获取选择的图片路径
						// 根据图片信息判断是否压缩
						uni.getImageInfo({
							src: filePath,
							success: (image) => {
								if (image.width > 795 || image.height > 1448) {
									console.log('图片过大，准备压缩...')
									this.compressImage({
										imageImfo: image,
										photoPath: filePath,
										success: (filePath) => {
											this.navigateToModify(filePath);
										}
									})
								} else {
									this.navigateToModify(filePath);
								}
							},
							fail: (err) => {
								console.log('getImageInfo err: ' + res)
							}
						})
					}
				})
			},
			showSwitch() {},
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
			navigateToModify(filePath) {
				uni.setStorage({
					key: 'photo_info',
					data: {
						'path': filePath
					},
					success: function() {
						setTimeout(() => {
							uni.navigateTo({
								url: '../img-handle/index'
							})
						}, 500)

					}
				})
			},
			downloadimg(path) {
				const fs = uni.getFileSystemManager();
				fs.saveFile({
					tempFilePath: path,
					success: (res) => {
						this.userHeadImg = res.savedFilePath;
					}
				})
			},
			compressImage(callback) {
				let imageImfo = callback.photoPath
				let width = imageImfo.width
				let height = imageImfo.height
				let cvsRatioWidth = 816 / width
				let cvsRatioHeight = 1240 / height
				let maxRation = Math.max(...[cvsRatioWidth, cvsRatioHeight]);
				// 压缩图片
				uni.compressImage({
					src: callback.photoPath,
					quality: 80,
					compressedWidth: Number(width * maxRation),
					compressHeight: Number(height * maxRation),
					success: res => {
						let photoPath = res.tempFilePath
						// console.log(`压缩宽度：${ Number(width*maxRation)} x ${ Number(height*maxRation)}` )
						callback.success(photoPath)

					}
				})
			},
			async mergeImages() {
				return new Promise((resolve, reject) => {
					const getImageInfo = (src) => {
						return new Promise((res, rej) => {
							uni.getImageInfo({
								src: src,
								success: res,
								fail: rej
							});
						});
					};

					Promise.all([
						getImageInfo(this.userHeadImg),
						getImageInfo(this.templateImg)
					]).then(([userImgInfo, templateImgInfo]) => {
						console.log('User image info:', userImgInfo);
						console.log('Template image info:', templateImgInfo);

						// 使用用户头像的实际尺寸
						this.canvasWidth = userImgInfo.width;
						this.canvasHeight = userImgInfo.height;

						const ctx = uni.createCanvasContext('mergeCanvas', this);

						// 绘制用户头像
						ctx.drawImage(userImgInfo.path, 0, 0, this.canvasWidth, this.canvasHeight);

						// 计算模板图片的缩放比例和位置
						const templateScale = Math.min(this.canvasWidth / templateImgInfo.width, this
							.canvasHeight / templateImgInfo.height);
						const templateWidth = templateImgInfo.width * templateScale;
						const templateHeight = templateImgInfo.height * templateScale;
						const templateX = (this.canvasWidth - templateWidth) / 2;
						const templateY = (this.canvasHeight - templateHeight) / 2;

						// 绘制模板图片
						ctx.drawImage(templateImgInfo.path, templateX, templateY, templateWidth,
							templateHeight);

						ctx.draw(false, () => {
							console.log('Canvas draw completed');
							setTimeout(() => {
								uni.canvasToTempFilePath({
									canvasId: 'mergeCanvas',
									width: this.canvasWidth,
									height: this.canvasHeight,
									destWidth: this.canvasWidth,
									destHeight: this.canvasHeight,
									success: (res) => {
										console.log(
											'Canvas to temp file success:',
											res.tempFilePath);
										resolve(res.tempFilePath);
									},
									fail: (err) => {
										console.error(
											'Canvas to temp file failed:',
											err);
										reject(err);
									}
								}, this);
							}, 200);
						});
					}).catch(reject);
				});
			},
			async saveBtn1() {
				let videoAd = null
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-562cd9f4c5f23f37'
					})
					videoAd.onLoad(async () => {

					})
					videoAd.onError((err) => {
						console.error('激励视频光告加载失败', err)
					})
					videoAd.onClose(async (res) => {
						// 用户点击了【关闭广告】按钮
						if (res && res.isEnded) {
							try {
								uni.showLoading({
									title: '处理中...'
								});
								const mergedImagePath = await this.mergeImages();

								uni.hideLoading();
								this.saveImageToAlbum(mergedImagePath);
							} catch (error) {
								uni.hideLoading();
								uni.showToast({
									title: '处理失败，请重试',
									icon: 'none'
								});
								console.error('Error in saveBtn:', error);
							}
						}
					})
				}
				// 用户触发广告后，显示激励视频广告
				if (videoAd) {
					videoAd.show().catch(() => {
						// 失败重试
						videoAd.load()
							.then(() => videoAd.show(

							))
							.catch(err => {
								console.error('激励视频 广告显示失败', err)
							})
					})
				}

			},
			saveImageToAlbum(filePath) {
				uni.saveImageToPhotosAlbum({
					filePath: filePath,
					success: () => {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						});
					},
					fail: (err) => {
						console.error('Save to album failed:', err);
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				});
			},
		},
	}
</script>

<style lang="scss">
	.content {
		background-size: 100% 100%;
		padding-top: 20rpx;

		.top-content {
			width: 90%;
			height: 300px;
			background-color: white;
			border-radius: 20px;
			margin: 0 auto;
		}

		.all-back {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			min-height: 100vh;
			width: 750rpx;
		}

		.image-card {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			.image-center {
				width: 300rpx;
				height: 300rpx;
				border-radius: 50rpx;
				margin: 0 70rpx;
			}

			.iconfont {
				color: #f7f8fa;
				font-size: 80rpx;
				font-weight: bold;
			}
		}

		.btn-div {
			padding: 50rpx;
			display: flex;
			justify-content: space-between;

			.btn-left {
				background-color: #f7f8fa;
				box-shadow: 0px 4px 54px 0px rgba(108, 108, 108, 0.14);
				padding: 0 70rpx;
				height: 100rpx;
				line-height: 100rpx;
				border-radius: 80rpx;
				color: #646566;
				font-weight: bold;
			}

			.btn-right {
				background-image: linear-gradient(90deg, #ff8c00, #ff4500);
				padding: 0 100rpx;
				height: 100rpx;
				line-height: 100rpx;
				border-radius: 80rpx;
				color: #ffffff;
				font-weight: bold;
			}
		}
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.avatar-div {
		height: 380rpx;
		margin-right: 40rpx;
		position: relative;
		width: 380rpx;
	}

	.avatar-div,
	.empty-view {
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-box-pack: center;
		-webkit-box-align: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		z-index: 1;
	}

	.empty {
		height: 100px;
		margin-bottom: 24px;
		width: 100px;
	}

	.img {
		background-color: #fff;
		border-radius: 48rpx;
		height: 360rpx;
		position: absolute;
		width: 360rpx;
		z-index: 0;
	}

	.avatar-default {
		border-radius: 48rpx;
		height: 100%;
		left: 0;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 10;
	}

	.container {
		background-color: #fbebe1;
		min-height: 100vh;
		overflow: hidden;
	}

	.photo-main-view {
		display: flex;
		justify-content: space-between;
		width: 690rpx;
		margin: 30rpx 30rpx 0;
	}

	.icon-div {
		position: relative;
		height: 80rpx;

		.icon-zuo {
			position: absolute;
			left: 0;
		}

		.icon-you {
			position: absolute;
			right: 0;
		}
	}

	.action-btn {
		background: #fff;
		border: none;
		// border: 1rpx solid #efefef;
		border-radius: 48rpx;
		// box-shadow: 0 12rpx 16rpx -8rpx rgba(0, 0, 0, 0.1);
		color: #4d4d4d;
		font-weight: bolder;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		padding: 0 60rpx;
	}

	.btn-head {
		margin: 10rpx 0 40rpx 0;
	}

	.btn-photo {
		margin: 10rpx 0 40rpx 0;
		background: linear-gradient(97.71deg, #ff55ff, #55ffff 88.36%);
	}

	.btn-primary {
		background: linear-gradient(97.71deg, #ffa462, #ff4d42 88.36%);
		border-radius: 48rpx;
		color: #fff;
	}

	.ad-wraper {
		padding-top: 40rpx;
	}

	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
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