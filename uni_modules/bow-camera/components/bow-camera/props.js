export default {
    props: {
	   authCamera: {
			type: Boolean,
			default: true
	   },
	   quality: {
			type: String,
			default: 'high'
	   },
	   compress: {
		   type: Number,
		   default: 90
	   },
	   devicePosition: {
			type: String,
			default: 'front'
	   }
    }
}
