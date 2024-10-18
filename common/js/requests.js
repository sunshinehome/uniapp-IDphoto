function uploadPhoto(that, userInfoObj, width, height, filePath) {
	// console.log('上传照片： ' +  filePath)
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: that.$baseUrl + '/api/Upload/UploadOpenImg', //图片上传接口
			filePath: filePath,
			name: 'file',
			// header:{
			// 	'content-type':"multipart/form-data",
			// },
			formData: {
				userId: userInfoObj.userId,
				width: width,
				height: height
			},
			success: (res) => {
				if (res.statusCode === 200) {
					//请求成功
					resolve(JSON.parse(res.data));
				} else if (res.statusCode === 401) {
					uni.showToast({
						icon: 'none',
						title: "未登录或登录状态已超时",
						duration: 1500
					});
					resolve(new Error("未登录或登录状态已超时"));
				} else if (res.statusCode === 405) {
					uni.showToast({
						icon: 'none',
						title: "请求方法错误",
						duration: 1500
					});
					resolve(new Error("请求方法错误"));
				} else {
					uni.showToast({
						icon: 'none',
						title: "请求错误" + res.statusCode,
						duration: 1500
					});
					resolve(new Error("请求错误" + res.statusCode));
				}
			},
			fail: (err) => {
				console.log("err:", err.errMsg);
				uni.showToast({
					icon: 'none',
					title: '系统异常：文件上传失败！',
					duration: 1500
				});
				reject(err);
			}
		});
	})
}

function downloadPhoto(that, url) {
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url: url, //仅为示例，并非真实的资源
			success: (res) => {
				if (res.statusCode === 200) {
					// 下载后的临时文件路径
					resolve(res.tempFilePath);
				}
			},
			fail: (err) => {
				console.log("err:", err.errMsg);
				uni.showToast({
					icon: 'none',
					title: '系统异常：文件加载失败！',
					duration: 1500
				});
				reject(err);
			}
		});
	})
}



function generateBackgroudImg(that, color, imgurl) {
	let result
	console.log('color', color)
	uni.request({
		url: that.$baseUrl + '/api/Photo/generateBg',
		method: 'POST',
		data: {
			color: color,
			outputImageDir: imgurl
		},
		success: (res) => {
			let data = res.data
			console.log('获取数据：', JSON.stringify(data))
			if (data.code === 200) {
				result = data.data
			} else {
				uni.showToast({
					icon: 'none',
					title: '生成失败！',
					duration: 1500
				});
			}
		},
		fail: (err) => {
			console.error(err)
		},
	});
	return result
}

/**
 * 
 */
function uploadPhotoCheck(that, userInfoObj, width, height, color, render, setType, filePath) {
	console.log('上传照片： ', userInfoObj)
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: that.$baseUrl + '/api/Upload/UploadCheckImg', //图片上传接口
			filePath: filePath,
			name: 'file',
			formData: {
				userId: userInfoObj.userId,
				color: color,
				width: width,
				height: height,
				render: render,
				kb: 50,
				setType: setType,
			},
			success: (res) => {
				if (res.statusCode === 200) {
					//请求成功
					resolve(JSON.parse(res.data));
				} else if (res.statusCode === 401) {
					uni.showToast({
						icon: 'none',
						title: "未登录或登录状态已超时",
						duration: 1500
					});
					resolve(new Error("未登录或登录状态已超时"));
				} else if (res.statusCode === 405) {
					uni.showToast({
						icon: 'none',
						title: "请求方法错误",
						duration: 1500
					});
					resolve(new Error("请求方法错误"));
				} else {
					uni.showToast({
						icon: 'none',
						title: "请求错误" + res.statusCode,
						duration: 1500
					});
					resolve(new Error("请求错误" + res.statusCode));
				}
			},
			fail: (err) => {
				console.log("err:", err.errMsg);
				uni.showToast({
					icon: 'none',
					title: '系统异常：文件上传失败！',
					duration: 1500
				});
				reject(err);
			}
		});
	})
}

function getPhotoList(that, type, userInfoObj, pageNo, pageSize) {
	const data = {
		"type": type,
		"userId": userInfoObj.userId,
		"pageNo": pageNo,
		"pageSize": pageSize,
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: that.$baseUrl + '/api/Photo/getPhotoList',
			method: 'POST',
			data: data,
			success: (res) => {
				let data = res.data
				if (data.code === 200) {
					resolve(data.data);
				} else {
					uni.showToast({
						icon: 'none',
						title: '数据拉取失败！',
						duration: 1500
					});
				}
			},
			fail: (err) => {
				console.error(err)
			},
		});
	})
}
/**
 * Post通用请求接口，提供请求参数和地址
 * data 请求 json数据
 * url 请求地址
 */
function currentPostRequest(that, data, url) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: that.$baseUrl + url,
			method: 'POST',
			data: data,
			success: (res) => {
				let data = res.data
				if (data.code === 200) {
					resolve(data.data);
				} else {
					uni.showToast({
						icon: 'none',
						title: '数据拉取失败！',
						duration: 1500
					});
				}
			},
			fail: (err) => {
				console.error(err)
			},
		});
	})
}
/**
 * Get通用请求接口，提供请求参数和地址
 * data 请求 json数据
 * url 请求地址
 */
function currentGetRequest(that, data, url) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: that.$baseUrl + url,
			method: 'GET',
			data: data,
			success: (res) => {
				let data = res.data
				if (data.code === 200) {
					resolve(data.data);
				} else {
					uni.showToast({
						icon: 'none',
						title: '数据拉取失败！',
						duration: 1500
					});
				}
			},
			fail: (err) => {
				console.error(err)
			},
		});
	})
}
export default {
	uploadPhoto,
	downloadPhoto,
	generateBackgroudImg,
	uploadPhotoCheck,
	getPhotoList,
	currentPostRequest,
	currentGetRequest,
}