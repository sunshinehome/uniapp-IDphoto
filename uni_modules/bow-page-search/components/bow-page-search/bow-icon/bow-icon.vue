<template>
	<view
	    class="u-icon"
	    @tap="clickHandler"
	    :class="['u-icon--' + labelPos]"
	>
		<image
		    class="u-icon__img"
		    v-if="isImg"
		    :src="name"
		    :mode="imgMode"
		></image>
		<text
		    v-else
		    class="u-icon__icon"
		    :class="uClasses"
		    :hover-class="hoverClass"
			style="font-size: 22px; line-height: 22px; font-weight: normal; top: 0px; color: rgb(144, 147, 153);"
		>{{icon}}</text>
		<!-- 这里进行空字符串判断，如果仅仅是v-if="label"，可能会出现传递0的时候，结果也无法显示 -->
		<text
		    v-if="label !== ''" 
		    class="u-icon__label"
		    :style="{
			color: labelColor,
			fontSize: labelSize,
			marginLeft: labelPos == 'right' ? space : 0,
			marginTop: labelPos == 'bottom' ? space : 0,
			marginRight: labelPos == 'left' ? space : 0,
			marginBottom: labelPos == 'top' ? space : 0,
		}"
		>{{ label }}</text>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	// nvue通过weex的dom模块引入字体，相关文档地址如下：
	// https://weex.apache.org/zh/docs/modules/dom.html#addrule
	const fontUrl = 'https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf'
	const domModule = weex.requireModule('dom')
	domModule.addRule('fontFace', {
		'fontFamily': "uicon-iconfont",
		'src': `url('${fontUrl}')`
	})
	// #endif

	// 引入图标名称，已经对应的unicode
	import icons from './icons.js';
	import props from './props.js';;

	/**
	 * icon 图标
	 * @description 基于字体的图标集，包含了大多数常见场景的图标。
	 * @tutorial https://www.uviewui.com/components/icon.html
	 * @property {String}			name			图标名称，见示例图标集
	 * @property {String}			color			图标颜色,可接受主题色 （默认 color['u-content-color'] ）
	 * @property {String | Number}	size			图标字体大小，单位px （默认 '16px' ）
	 * @property {Boolean}			bold			是否显示粗体 （默认 false ）
	 * @property {String | Number}	index			点击图标的时候传递事件出去的index（用于区分点击了哪一个）
	 * @property {String}			hoverClass		图标按下去的样式类，用法同uni的view组件的hoverClass参数，详情见官网
	 * @property {String}			customPrefix	自定义扩展前缀，方便用户扩展自己的图标库 （默认 'uicon' ）
	 * @property {String | Number}	label			图标右侧的label文字
	 * @property {String}			labelPos		label相对于图标的位置，只能right或bottom （默认 'right' ）
	 * @property {String | Number}	labelSize		label字体大小，单位px （默认 '15px' ）
	 * @property {String}			labelColor		图标右侧的label文字颜色 （ 默认 color['u-content-color'] ）
	 * @property {String | Number}	space			label与图标的距离，单位px （默认 '3px' ）
	 * @property {String}			imgMode			图片的mode
	 * @property {String | Number}	width			显示图片小图标时的宽度
	 * @property {String | Number}	height			显示图片小图标时的高度
	 * @property {String | Number}	top				图标在垂直方向上的定位 用于解决某些情况下，让图标垂直居中的用途  （默认 0 ）
	 * @property {Boolean}			stop			是否阻止事件传播 （默认 false ）
	 * @event {Function} click 点击图标时触发
	 * @event {Function} touchstart 事件触摸时触发
	 */
	export default {
		data() {
			return {

			}
		},
		mixins: [props],
		computed: {
			uClasses() {
				let classes = []
				classes.push(this.customPrefix + '-' + this.name)
				// // uView的自定义图标类名为u-iconfont
				// if (this.customPrefix == 'uicon') {
				// 	classes.push('u-iconfont')
				// } else {
				// 	classes.push(this.customPrefix)
				// }
				// 阿里，头条，百度小程序通过数组绑定类名时，无法直接使用[a, b, c]的形式，否则无法识别
				// 故需将其拆成一个字符串的形式，通过空格隔开各个类名
				//#ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
				classes = classes.join(' ')
				//#endif
				return classes
			},
			// 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
			isImg() {
				return this.name.indexOf('/') !== -1
			},
			// 通过图标名，查找对应的图标
			icon() {
				// 如果内置的图标中找不到对应的图标，就直接返回name值，因为用户可能传入的是unicode代码
				return icons['uicon-' + this.name] || this.name
			}
		},
		methods: {
			clickHandler(e) {
				this.$emit('click', this.index)
				// 是否阻止事件冒泡
				this.stop && this.preventEvent(e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../../static/css/components.scss";
	
	// 变量定义
	$bow-icon-label-line-height:1 !default;

	/* #ifndef APP-NVUE */
	// 非nvue下加载字体
	@font-face {
		font-family: 'uicon-iconfont';
		src: url('https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf') format('truetype');
	}

	/* #endif */

	.u-icon {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;

		&--left {
			flex-direction: row-reverse;
			align-items: center;
		}

		&--right {
			flex-direction: row;
			align-items: center;
		}

		&--top {
			flex-direction: column-reverse;
			justify-content: center;
		}

		&--bottom {
			flex-direction: column;
			justify-content: center;
		}

		&__icon {
			font-family: uicon-iconfont;
			position: relative;
			@include flex;
			align-items: center;

		}

		&__img {
			/* #ifndef APP-NVUE */
			height: auto;
			will-change: transform;
			/* #endif */
		}

		&__label {
			/* #ifndef APP-NVUE */
			line-height: $bow-icon-label-line-height;
			/* #endif */
		}
	}
</style>
