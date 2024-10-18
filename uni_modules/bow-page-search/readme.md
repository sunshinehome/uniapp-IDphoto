### BowPageSearch 搜索模板

**使用方法：**

```
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
			<bow-box :options="boxOptions" :finish="finish" @clickedBox="clickedBox"></bow-box>
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
					'驾驶证','教师资格证', 
					'普通话', '会计', '高考报名',
					'签证', '网约车资格证',
					'大学生图像信息采集', '驾驶证电子版(交管12123)'
				],
				boxOptions: [],
				finish: false
            }
        },
        components: {
            bowSearch, bowOption, bowBox
        },
        methods: {
			clickedOption(optionName) {
				this.keyword = optionName;
			},
			clickedBox(option) {
				console.log('clickedBox: ' + option.id);
				// //跳转搜索页面
				// uni.navigateTo({
				// 	url:'../pages/page?id=' + option.id
				// })
			},
			search(keyword) {
				const data = [
					{
						'id': 1,
						'title': '汽车驾驶证',
						'info': '33 x 45mm'
					},
					{
						'id': 2,
						'title': '无人机驾驶证',
					},
					{
						'id': 3,
						'title': '游艇驾驶证',
						'info': '33 x 45mm'
					},
					{
						'id': 4,
						'title': '坦克驾驶证',
					},
					{
						'id': 5,
						'title': '飞机驾驶证',
					}
				]
				this.boxOptions = this.boxOptions.concat(data)
				// 没有数据了
				this.finish = true;
			}
        }
    }
</script>

<style lang="scss">
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
```

