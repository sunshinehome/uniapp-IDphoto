let _debounceTimeout = null,
	_throttleRunning = false

/**
 * 防抖
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const debounce = (fn, delay=500) => {
	clearTimeout(_debounceTimeout);
	_debounceTimeout = setTimeout(() => {
		fn();
	}, delay);
}
/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const throttle = (fn, delay=500) => {
	if(_throttleRunning){
		return;
	}
	_throttleRunning = true;
	fn();
	setTimeout(() => {
	    _throttleRunning = false;
	}, delay);
}

/**
 * toast
 */
export const showToast = (title = '', param={}) => {
	if(!title) return;
	uni.showToast({
		title,
		duration: param.duration || 1500,
		mask: param.mask || false,
		icon: param.icon || 'none'
	});
}

export const getFormattedDate=(date)=> {
  // 将输入转换为 Date 对象
  const dateObj = new Date(date);

  // 获取年月日时分
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，所以加 1
  const day = dateObj.getDate().toString().padStart(2, '0');
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  // 格式化输出
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedDate;
}