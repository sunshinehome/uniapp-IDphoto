<template>
	<view
	    class="bow-row"
		ref="bow-row"
	    :style="[rowStyle]"
	    @tap="clickHandler"
	>
		<slot />
	</view>
</template>

<script>
	import props from './props.js';
	/**
	 * Row 栅格系统中的行
	 * @description 通过基础的 12 分栏，迅速简便地创建布局 
	 * @tutorial https://www.uviewui.com/components/layout.html
	 * @property {String | Number}	gutter		栅格间隔，左右各为此值的一半，单位px  (默认 0 )
	 * @property {String}			justify		水平排列方式(微信小程序暂不支持) 可选值为`start`(或`flex-start`)、`end`(或`flex-end`)、`center`、`around`(或`space-around`)、`between`(或`space-between`)  (默认 'start' )
	 * @property {String}			align		垂直排列方式 (默认 'center' )
	 * 
	 * @event {Function} click row被点击
	 * @example <bow-row justify="space-between" customStyle="margin-bottom: 10px"></bow-row>
	 */
	export default {
		mixins: [props],
		data() {
			return {
				
			}
		},
		computed: {
			uJustify() {
				if (this.justify == 'end' || this.justify == 'start') return 'flex-' + this.justify
				else if (this.justify == 'around' || this.justify == 'between') return 'space-' + this.justify
				else return this.justify
			},
			uAlignItem() {
				if (this.align == 'top') return 'flex-start'
				if (this.align == 'bottom') return 'flex-end'
				else return this.align
			},
			rowStyle() {
				const style = {
					alignItems: this.uAlignItem,
					justifyContent: this.uJustify
				}
				// 通过给bow-row左右两边的负外边距，消除u-col在有gutter时，第一个和最后一个元素的左内边距和右内边距造成的影响
				if(this.gutter) {
					style.marginLeft = -Number(this.gutter)/2 + 'px'
					style.marginRight = -Number(this.gutter)/2 + 'px'
				}
				return style;
			}
		},
		methods: {
			clickHandler(e) {
				this.$emit('click')
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../../static/css/components.scss';

	.bow-row {
		@include flex;
		flex-wrap: wrap;
	}
</style>
