<template>
	<view class="container">
		<view class="imageBox">
			<canvas class="canvasimg" canvas-id="photoCanvas" id="photoCanvas"></canvas>
			<!-- <image :src="previewImagePath" ></image> -->
		</view>
		<view class="bottom-drawer">
			<u-tabs :list="tabs" lineWidth="65" :activeStyle="{
				color: '#303133'
			    }"></u-tabs>
			<u-scroll-list :indicator="true" indicatorWidth=50 indicatorBarWidth=50 indicatorActiveColor="#2b85e4"
				style="margin: 25rpx;">
				<view v-for="(item, index) in backimgs" :key="index" class="color-block"
					@tap="onClickBackimg($event, item,index)" :class="{'color-shadow':backimgShadowId==item.id}">
					<u--image :src="item.url" radius="10" :lazy-load="true" width="80px" height="80px"></u--image>
				</view>
			</u-scroll-list>
			<view style="position: fixed; bottom: 1rpx; width: 100%;">
				<u-button type="success" icon="photo-fill" text="相册选择" @tap="showSelectUpload = true"></u-button>
			</view>
		</view>
		<!-- 选择照片上传方式 -->
		<u-popup :show="showSelectUpload" :overlay="true" mode="center" :round="10" :safeAreaInsetBottom="true"
			@close="closeSelectUpload" @open="openSelectUpload">
			<view class="dropbox">
				<u--text type="info" align="center" size="16" text="从相册中选择" @tap="selectImageFromLocal"></u--text>
				<u-line margin="20rpx 0rpx"></u-line>
				<u--text type="info" align="center" size="16" text="从聊天记录选择照片"
					@click="selectPhotoFromChatHistory"></u--text>
				<u-line margin="20rpx 0rpx"></u-line>
				<u-button size="20" text="取消" color="#F3F3F3" customStyle="color: #898989;"
					@click="closeSelectUpload"></u-button>
			</view>
		</u-popup>
		<u-overlay :show="show" opacity="0.5">
			<view class="warp">
				<u-loading-icon size=42></u-loading-icon>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import wechat from '../../common/js/wechat.js'
	import requests from '../../common/js/requests.js'

	export default {
		data() {
			return {
				userInfoObj: {},
				sizeId: '',
				photoPath: '',
				photoSize: {},
				widthSpec: 0,
				heightSpec: 0,
				widthPixel: 0,
				heightPixel: 0,
				positionStyle: {},
				widthStyle: {},
				heightStyle: {},
				// 用户上传图片
				previewImagePath: '',
				widthPreview: {},
				heightPreview: {},
				showSelectUpload: false,
				// 默认背景色
				backimgShadowId: '1',
				tabs: [{
					name: '背景颜色'
				}],
				backimgs: [{
						'id': '1',
						'title': '国旗前景1',
						'url': '',
						'localurl': '',
					},
					{
						'id': '2',
						'title': '国旗前景2',
						'url': '',
						'localurl': '',
					},
					{
						'id': '100',
						'title': '国旗背景1',
						'url': '',
						'localurl': '',
					},

				],
				// 画布
				canvas: null,
				canvasSelect: null,
				// 遮罩
				show: true
			}
		},
		onLoad(e) {
			this.show = false;
			this.userInfoObj = uni.getStorageSync('userInfo');
		},
		async onReady() {
			let that = this;
			const backimg = this.backimgs[0];
			this.canvas = uni.createCanvasContext('photoCanvas', this);
			this.canvasSelect = uni.createSelectorQuery().in(this).select('#photoCanvas');

			let tempath = await requests.downloadPhoto(that, backimg.url);
			this.backimgs[0].localurl = tempath;

			this.drawCanvas(tempath).then(res => {
				this.previewPhoto();
			})
		},
		methods: {
			openSelectUpload() {},
			closeSelectUpload() {
				this.showSelectUpload = false
			},
			async onClickBackimg(event, backimg, index) {
				let that = this;
				this.backimgShadowId = backimg.id
				let tempath = await requests.downloadPhoto(that, backimg.url);
				this.backimgs[index].localurl = tempath;
				if (this.photoPath !== '') {
					uni.getImageInfo({
						src: this.photoPath,
						success: (image) => {
							// sourceInfo = image
							this.drawCanvas(tempath, image).then(res => {
								this.previewPhoto();
							})
						}
					})
				} else {
					this.drawCanvas(tempath).then(res => {
						this.previewPhoto();
					})
				}

			},
			drawCanvas(tempath, imgpath) {
				let ctx = this.canvas;
				let width = 300;
				let height = 300;
				return new Promise((resolve, reject) => {
					// 更新画布
					this.canvasSelect.boundingClientRect(rect => {
						if (!rect) return
						// 清除画布
						ctx.clearRect(0, 0, width, height);
						if (this.backimgShadowId.length > 2) {
							width=350;
							// 填充背景
							if (tempath) {
					
								ctx.drawImage(tempath, 0, 0, width, height);
							}
							if (imgpath) {
								ctx.drawImage(imgpath, 200, 0, width, height);
							}
						} else {
							if (imgpath) {
								ctx.drawImage(imgpath, 0, 0, width, height);
							}
							// 填充前景
							if (tempath) {
								// 先绘制模板图片
								ctx.drawImage(tempath, 0, 0, width, height);
							}

						}

						ctx.draw()
					}).exec();
					setTimeout(res => {
						resolve()
					}, 300)
				})
			},
			/// 导出为临时图片
			previewPhoto() {
				let that = this;
				uni.canvasToTempFilePath({
					fileType: 'jpg',
					canvasId: 'photoCanvas',
					success: function(res) {
						that.previewImagePath = res.tempFilePath;
					},
					fail: function(res) {
						console.log('preview fail ' + res)
					}
				})
			},
			savePoster() {
				let that = this;
				// #ifdef MP-WEIXIN
				wx.canvasToTempFilePath({
					canvasId: 'photoCanvas',
					quality: 0.9,
					fileType: 'jpg',
					destWidth: this.widthPixel,
					destHeight: this.heightPixel,
					success: res => {
						let url = res.tempFilePath;
						that.saveImage(url);
					},
					fail: err => {
						uni.showToast({
							title: '证件照生产失败, 请返回上一页重试!',
							icon: 'none',
							duration: 5000
						})
					}
				}, this);
				// #endif
			},
			saveImage(url) {
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success: function(e) {
						console.log('save success ' + e);
						uni.showToast({
							title: '保存成功！您可在相册中查看照片！',
							icon: 'none',
							duration: 2500
						})
					},
					fail: function(res) {
						// console.log('保存失败： ' + res);
						uni.showToast({
							title: '证件照片保存到相册失败！',
							icon: 'none',
							duration: 2500
						})
					}
				})
			},
			selectImageFromLocal() {
				const backimgObj = this.backimgs.find(item => item.id === this.backimgShadowId);
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
											this.photoPath = filePath;
											this.showSelectUpload = false
											this.drawCanvas(backimgObj.localurl,
												filePath)
										}
									})
								} else {
									this.photoPath = filePath;
									this.showSelectUpload = false
									this.drawCanvas(backimgObj.localurl, filePath)
								}
							},
							fail: (err) => {
								console.log('getImageInfo err: ' + res)
							}
						})
					}
				})
			},
			selectPhotoFromChatHistory() {
				wx.chooseMessageFile({
					count: 1, //限制选择的文件数量
					type: 'image', //非图片和视频的文件,不选默认为all
					success: res => {
						const filePath = res.tempFiles[0].path; // 获取选择的图片路径					
						this.compressImage({
							sizeId: sizeId,
							photoPath: filePath,
							success: (sizeId, filePath) => {
								console.log('聊天记录获取地址： ' + filePath)
								this.photoPath = filePath;
							}
						})
					},
					fail: (err) => {
						console.log('聊天记录获取失败： ' + err)
					}
				})
			},
			/**
			 * 压缩图片 
			 */
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
						// console.log('压缩后地址： ' +  photoPath)
						callback.success(callback.sizeId, photoPath)

					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}


	.container {
		display: flex;
		/* 创建flex容器 */
		justify-content: center;
		/* 水平居中对齐子元素 */
		align-items: center;
		/* 垂直居中对齐子元素 */
	}

	.imageBox {
		padding-top: 10vh;
		width: 100%;
		height: 90%;
		display: flex;
		/* 创建flex容器 */
		justify-content: center;
		/* 水平居中对齐子元素 */
		align-items: center;

		.canvasimg {
			z-index: 9999;
			width: 300px;
			/* 或者你需要的宽度值 */
			height: 300px;
			/* 或者你需要的高度值 */
		}

		.image {
			z-index: 99;
		}
	}

	.bottom-drawer {
		height: 30vh;
		bottom: 0;
		left: 0;
		right: 0;
		position: fixed;
		box-shadow: 0 0 25rpx 10rpx #E5E5E5;
		background-color: #FFF;

		.u-tabs {
			box-shadow: 0 0 1rpx 1rpx #E5E5E5;
		}

		.color-block {
			margin: 10rpx;
			border: 1rpx solid #E1E1E1;
			border-radius: 5rpx;
		}

		.color-shadow {
			box-shadow: 0 0 5rpx 5rpx #3492C4;
		}

		.dropbox {
			width: 60vw;
			margin: 40rpx 50rpx 40rpx 50rpx;
		}
	}
</style>