<template>
    <view class="content">
       <bow-search
		placeholder="搜索规格名称、尺寸"
		v-model="keyword"
		:showAction="false"
		@change="search"
		clearable
		></bow-search>
		<view class="seacrhList" v-if="keyword && options.length">
			<bow-box :options="boxOptions" :finish="finish"  @clickedBox="clickedBox"></bow-box>
		</view>

		<view class="option" v-if="!keyword && options.length">
			<text>常用尺寸</text>
			<bow-option :keyword="keyword" :options="options" @clickedOption="clickedOption"></bow-option>
		</view>
    </view>

</template>

<script>
	import bowSearch from '@/uni_modules/bow-page-search/components/bow-page-search/bow-search/bow-search.vue';
	import bowOption from '@/uni_modules/bow-page-search/components/bow-page-search/bow-option/bow-option.vue';
	import bowBox from '@/uni_modules/bow-page-search/components/bow-page-search/bow-box/bow-box.vue';

    export default {
        data() {
            return {
				keyword: '',
				options: [
					'教师资格证', '四六级', '高考报名',
					'普通话', '会计', '高考报名',
					'签证', '成人自考', '网约车资格证',
					'大学生图像信息采集', '驾驶证电子版(交管12123)'
				],
				boxOptions: [],
				finish: false
            }
        },
        components: {
            bowSearch, bowOption, bowBox
        },
		onLoad() {
			this.keyword = this.$mp.query.keyword
		},
        methods: {
			clickedOption(option) {
				this.keyword = option;
				
			},
			clickedBox(option) {
				//跳转搜索页面
				uni.navigateTo({
					url:'../create-photo/create-photo?id=' + option.id
				})
			},
			search(keyword) {
				this.boxOptions = []
				for (const key in this.$allPhotoSize) {
					const photoSize = this.$allPhotoSize[key]
					if (photoSize.title.includes(keyword) || photoSize.keyword.includes(keyword)) {
						this.boxOptions.push({
							'id': photoSize.id,
							'title': photoSize.title,
							'info': photoSize.spec
						})
					}
				}
				// this.boxOptions = this.boxOptions.concat(result)
				this.finish = true;
			}
        }
    }
</script>

<style lang="scss">
page{
		background-color: #FFFFFF;
	}
	
.content {
		display: flex;
		flex-direction: column;
	}

.bow-search {
	margin: 25rpx;
}

.option  {
	margin-top: 25rpx;
	margin-left: 25rpx;
}

.option text {
	font-size: 35rpx;
}
</style>