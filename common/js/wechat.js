// 删除历史缓存
function wxUnlink(fsm, basepath) {
	fsm.readdir({
		dirPath: basepath, /// 获取文件列表
		success(res) {
			// console.log('获取到的文件' + res)
			res.files.forEach((val) => { // 遍历文件列表里的数据
				// console.log('文件列表' + val)
				fsm.unlink({
					filePath: basepath + '/' + val
				});
			});

		},
		fail(err) {
			// console.log('error: ' + err)
		},
		complete() {}
	})
}

// 判断目录/文件是否存储
function wxAccess(fsm, basepath) {
	return new Promise((resolve, reject) => {
		fsm.access({
			path: basepath,
			success(res) {
				resolve(true)
			},
			fail(res) {
				resolve(false)
			}
		})
	})
}

// 创建目录
function wxMkdir(fsm, basepath) {
	this.wxAccess(
		fsm, basepath).then(res => {
		if (!res) {
			try {
				fsm.mkdirSync(basepath, false)
			} catch (error) {
				console.log('目录创建失败！：' + error)
			}
		}
	});

}

function wxGetCode(that, code) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: that.$baseUrl + '/api/User/GetWxInfo/' + code,
			method: 'GET',
			success: (res) => {
				let data = res.data
				console.log('获取数据：', JSON.stringify(data))
				if (data.code === 200) {
					resolve(data.data)
				} else {
					uni.showToast({
						icon: 'none',
						title: '授权失败！',
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

function wxGetUserInfo(that, userid, nickname, headurl) {
	return new Promise((resolve, reject) => {
		// 定义要发送的数据对象
		const data = {
			userId: userid,
			nickName: nickname,
			headUrl: headurl
		};
		uni.request({
			url: that.$baseUrl + '/api/User/UpdateUserInfo',
			method: 'POST',
			header: {
				'content-type': 'application/json' // 设置请求的 header
			},
			data: data,
			success: (res) => {
				let data = res.data
				if (data.code === 200) {
					resolve(data.data)
					// uni.setStorageSync('userInfo',  data.data)
				} else {
					uni.showToast({
						icon: 'none',
						title: '授权失败！',
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
	wxUnlink,
	wxAccess,
	wxMkdir,
	wxGetCode,
	wxGetUserInfo
}