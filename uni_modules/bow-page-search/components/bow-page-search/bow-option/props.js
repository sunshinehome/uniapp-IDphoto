export default {
    props: {
		keyword: {
			type: String,
			default: ''
		},
		options: {
			type: Array,
			default: () => []
		},
		optionMethod: {
			type: Function,
			default: function() {
				return function() {}
			}
		}
    }
}
