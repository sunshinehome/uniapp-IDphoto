<template>
	<view>
		<u-overlay :show="fullscreenShow" @click="show = false"></u-overlay>
		<view class="content">
			<u--text :text="photoInfo.title" size=16 :bold="true" margin="10rpx"></u--text>
			<u-line margin="10rpx"></u-line>
			<u-line margin="20rpx" color="#FFF"></u-line>
			<u-row justify="flex-start" gutter="10">
				<u-col span="4">
					<u--text text="打印尺寸：" type="info-dark" align="right"></u--text>
				</u-col>
				<u-col span="3" text-align="left">
					<u--text :text="photoInfo.spec" type="info"></u--text>
				</u-col>
			</u-row>
			<u-line margin="20rpx" color="#FFF"></u-line>
			<u-row justify="start" gutter="10">
				<u-col span="4">
					<u--text text="像素尺寸：" type="info-dark" align="right"></u--text>
				</u-col>
				<u-col span="3" text-align="left">
					<u--text :text="photoInfo.pixel" type="info"></u--text>
				</u-col>
			</u-row>
			<u-line margin="20rpx" color="#FFF"></u-line>
			<u-row justify="start" gutter="10">
				<u-col span="4">
					<u--text text="分辨率：" type="info-dark" align="right"></u--text>
				</u-col>
				<u-col span="3" text-align="left">
					<u--text text="330dpi" type="info"></u--text>
				</u-col>
			</u-row>
			<u-line margin="20rpx" color="#FFF"></u-line>
			<u-row justify="start" gutter="10">
				<u-col span="4" text-align="right">
					<u--text text="文件格式：" type="info-dark" align="right"></u--text>
				</u-col>
				<u-col span="3" text-align="left">
					<u--text text="jpg" type="info"></u--text>
				</u-col>
			</u-row>
			<u-line margin="20rpx" color="#FFF"></u-line>
			<u-row justify="start" gutter="10">
				<u-col span="4" text-align="right">
					<u--text text="背景色：" type="info-dark" align="right"></u--text>
				</u-col>
				<u-col span="8" text-align="left">
					<u-scroll-list :indicator="true" indicatorWidth=200 indicatorBarWidth=200
						indicatorActiveColor="#2b85e4">
						<view v-for="(item, index) in colors" :key="index" class="color-block"
							:class="{'color-shadow':colorShadowId==item.id}">
							<u-avatar text=" " shape="square" :size="28" :bgColor="item.bgColor"
								:customStyle="item.customStyle" :ref="item.id"
								@tap="onClickColor($event, item)"></u-avatar>
						</view>
					</u-scroll-list>
				</u-col>
			</u-row>
			<u-line margin="20rpx" color="#FFF"></u-line>
			<u-row justify="start" gutter="10">
				<u-col span="4" text-align="right">
					<u--text text="生成排版照：" type="info-dark" align="right"></u--text>
				</u-col>
				<u-col span="3" text-align="left">
					<u-radio-group v-model="seletedSetType" placement="row">
						<u-radio label="否" name='0'></u-radio>
						<u-radio label="是" name='1'></u-radio>
					</u-radio-group>
				</u-col>
			</u-row>
			<u-line margin="10rpx" color="#FFF"></u-line>
		</view>
		<view class="warn">
			<u--text text="拍照事项：" size=14 :bold="true"></u--text>
			<u-steps current="4" direction="column">
				<u-steps-item title="站在光线充足均匀的纯色背景前">
				</u-steps-item>
				<u-steps-item title="头部居中，正对镜头">
				</u-steps-item>
				<u-steps-item title="露出眉毛和耳朵，面部、肩部不要被遮挡">
				</u-steps-item>
				<u-steps-item title="证件照会自动根据图片截取头部">
				</u-steps-item>
			</u-steps>
		</view>
		<view>
			<u-button type="success" icon="photo-fill" text="选择头像" @tap="popModal(1)"></u-button>
			<u-button type="primary" icon="camera" :plain='true' text="开始拍照" @tap="popModal(2)"></u-button>
		</view>
		<u-modal :title="title" :content="content" :show="popshow" showCancelButton closeOnClickOverlay
			@confirm="confirm" @cancel="cancel" @close="close"></u-modal>
	</view>
</template>

<script>
	import requests from '../../common/js/requests.js'
	export default {
		data() {
			return {
				photoInfo: {},
				userInfoObj: {},
				fullscreenShow: false,
				showSelectUpload: false,
				popshow: false,
				title: '温馨提示',
				content: '完整观看5-30秒视频，可以免费制作下载',
				seletedSetType: '0',
				colorShadowId: 'color_11',
				type: 0,
				colors: [{
						'id': 'color_11',
						'bgColor': '#6AC6F9',
						'customStyle': ''
					},
					{
						'id': 'color_12',
						'bgColor': '#02A7F0',
						'customStyle': ''
					},
					{
						'id': 'color_13',
						'bgColor': '#438EDB',
						'customStyle': ''
					},
					{
						'id': 'color_101',
						'bgColor': '#3D99E2',
						'bgImage': ['#3D99E2', '#FFFFFF'],
						'customStyle': "background-image: linear-gradient(to bottom, #3D99E2, #FFFFFF)"
					},
					{
						'id': 'color_102',
						'bgColor': '#3492C4',
						'bgImage': ['#3492C4', '#FFFFFF'],
						'customStyle': "background-image: linear-gradient(to bottom, #3492C4, #FFFFFF)"
					},
					{
						'id': 'color_21',
						'bgColor': '#FF0000',
						'customStyle': ''
					},
					{
						'id': 'color_22',
						'bgColor': '#D9001B',
						'customStyle': ''
					},

					{
						'id': 'color_203',
						'bgColor': '#FF0000',
						'bgImage': ['#FF0000', '#FFFFFF'],
						'customStyle': "background-image: linear-gradient(to bottom, #FF0000, #FFFFFF)"
					},
					{
						'id': 'color_204',
						'bgColor': '#D9001B',
						'bgImage': ['#D9001B', '#FFFFFF'],
						'customStyle': "background-image: linear-gradient(to bottom, #D9001B, #FFFFFF)"
					},
					{
						'id': 'color_1',
						'bgColor': '#FFFFFF',
						'customStyle': ''
					},
					{
						'id': 'color_31',
						'bgColor': '#D2D2D2',
						'customStyle': ''
					}
				],
			}
		},
		onLoad(e) {
			this.userInfoObj = uni.getStorageSync('userInfo');
			// this.photoSizeId = this.$mp.query.id
			this.photoInfo = this.$allPhotoSize[e.id]
			console.log('load createPhoto ' + this.photoInfo)
			if (this.userInfoObj === '' || this.userInfoObj === null) {
				uni.navigateTo({
					url: '../login/login'
				})
			}
		},
		methods: {
			openSelectUpload() {},
			cancel() {
				this.popshow = false;
			},
			close() {
				this.popshow = false;
			},
			closeSelectUpload() {
				this.showSelectUpload = false
			},
			clickedOpenCamera() {
				let videoAd = null
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-6e1e20c8451c0c5d'
					})
					videoAd.onLoad(() => {})
					videoAd.onError((err) => {
						rewardedVideoAd.load()
							.then(() => rewardedVideoAd.show())
							.catch(err => {
								console.log('激励视频 广告显示失败')
							})
					})
					videoAd.onClose((res) => {
						if (res && res.isEnded) {
							uni.navigateTo({
								url: '../camera/camera?id=' + this.photoInfo.id
							})
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
			async popModal(type) {
				var that = this
				this.type = type;
				const data = {
					"userId": this.userInfoObj.userId
				};
				const num = await requests.currentGetRequest(that, data, '/api/User/GetAllNum');
				if (num < 3) {
					this.excType();
				} else {
					this.popshow = true;
				}

			},
		    confirm() {
				var that = this
				this.popshow = false

				let videoAd = null
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-6e1e20c8451c0c5d'
					})
					videoAd.onLoad(() => {})
					videoAd.onError((err) => {
						rewardedVideoAd.load()
							.then(() => rewardedVideoAd.show())
							.catch(err => {
								console.log('激励视频 广告显示失败')
							})
					})
					videoAd.onClose((res) => {
						if (res && res.isEnded) {
							this.excType();
						}
					})
				} else {
					uni.showToast({
						title: '亲，需要观看完成广告后，才可以下载',
						icon: 'none',
						duration: 2000
					});
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
			onClickColor(event, color) {
				let that = this;
				this.colorShadowId = color.id
				uni.getImageInfo({
					src: this.photoPath,
					success: (image) => {
						// sourceInfo = image
						this.drawCanvas(color, image).then(res => {
							this.previewPhoto();
						})
					}
				})
			},
			excType() {
				if (this.type === 1) {
					this.selectImageFromLocal();
				} else if (this.type === 2) {
					this.clickedOpenCamera();
				}
			},
			selectImageFromLocal() {
				let sizeId = this.photoInfo.id
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
										sizeId: sizeId,
										imageImfo: image,
										photoPath: filePath,
										success: (sizeId,
											filePath) => {
											this.checkImg(filePath)
											// this.navigateToModify(sizeId, filePath)
										}
									})
								} else {
									// this.navigateToModify(sizeId, filePath)
									this.checkImg(filePath)
								}
							},
							fail: (err) => {
								console.log('getImageInfo err: ' + err)
							}
						})
					},

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
						// console.log('压缩后地址： ' +  photoPath)
						callback.success(callback.sizeId, photoPath)

					}
				})
			},
			navigateToModify(sizeId, filePath) {
				uni.setStorage({
					key: 'photo_info',
					data: {
						'id': sizeId,
						'path': filePath
					},
					success: function() {
						// uni.navigateTo({
						// 	url: '../modify-photo/modify-photo'
						// })
					}
				})
			},
			checkImg(filePath) {
				var that = this;
				that.closeSelectUpload();
				let render = 0;
				const colorObj = this.getColorById(this.colorShadowId);
				const color = colorObj.bgColor
				let result = this.colorShadowId.split('_').pop();
				if (result.length == 3) {
					render = 1
				}

				let specPx = this.photoInfo.pixel.replace('px', '').split('*')
				let widthPixel = specPx[0]
				let heightPixel = specPx[1]
				let setType = parseInt(this.seletedSetType)
				requests.uploadPhotoCheck(that, this.userInfoObj, widthPixel, heightPixel, color, render, setType,
					filePath);
				uni.showLoading({
					title: '证件照正在排队处理中....'
				});
				this.fullscreenShow = true;
				setTimeout(() => {
					uni.hideLoading();
					this.fullscreenShow = false;
					uni.showModal({
						title: '提示',
						content: '是否进入【我的】页面查看生成的证件照!',
						success: (res) => {
							if (res.confirm) {
								uni.switchTab({
									url: '../my/my'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}, 2000);

			},
			getColorById(id) {
				return this.colors.find(s => s.id === id);
			}
		}
	}
</script>

<style lang="scss">
	.content {
		margin: 15rpx;
		padding: 30rpx;
		border-radius: 15rpx;
		background-color: #FFF;

	}

	.warn {
		margin: 20rpx;
		padding: 30rpx;
		border-radius: 15rpx;
		background-color: #FFF;
	}

	.u-button {
		margin: 15rpx 10rpx 15rpx 0;
	}

	.u-popup .dropbox {
		width: 60vw;
		margin: 40rpx 50rpx 40rpx 50rpx;
	}

	.u-popup__content {
		border-radius: 15rpx;
	}

	.u-tabs {
		box-shadow: 0 0 1rpx 1rpx #E5E5E5;
	}

	.color-block {
		margin: 10rpx;
		border: 1rpx solid #E1E1E1;
		border-radius: 10rpx;
	}

	.color-shadow {
		box-shadow: 0 0 5rpx 5rpx #3492C4;
	}
</style>