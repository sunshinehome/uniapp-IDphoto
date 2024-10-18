export default {
    props: {
       options: {
       	type: Array,
       	default: () => []
       },
	   finish: {
			type: Boolean,
			default: false
	   }
    }
}