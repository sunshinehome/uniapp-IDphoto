<template>
	<view>
		<bow-row
			justify="start"
			gutter="1"
			style="flex-wrap: wrap;"
		>
			<template v-for="(option, index) in options">
				<bow-col
					 :key="index"
					:span="option.length/1"
					v-if="option.length < 3"
					textAlign="center"
					@click="clickedOption(option)">
					{{ option }}
				</bow-col>
				<bow-col
					:span="option.length/1.5"
					v-else-if="option.length >= 3 && option.length < 5" 
					textAlign="center"
					@click="clickedOption(option)">
					{{ option }}
				</bow-col>
				<bow-col
					:span="option.length/1.8"
					v-else-if="option.length >= 5 && option.length < 10" 
					textAlign="center"
					@click="clickedOption(option)">
					{{ option }}
				</bow-col>
				<bow-col
					:span="option.length/2.3"
					v-else-if="option.length >= 10" 
					textAlign="center"
					@click="clickedOption(option)">
					{{ option }}
				</bow-col>
			</template>
		</bow-row>
	</view>
</template>

<script>
	import props from './props.js';
	import bowRow from '../bow-row/bow-row.vue'
	import bowCol from '../bow-col/bow-col.vue';
	
	export default {
		mixins: [props],
		components: {
			bowRow, bowCol
		},
		data() {
			return {
			}
		},
		methods: {
			clickedOption (option){
				this.$emit('clickedOption', option);
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
