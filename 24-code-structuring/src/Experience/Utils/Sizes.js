import EventEmitter from "./EventEmitter"
export default class Sizes extends EventEmitter {
	constructor() {
		super()
		//初始化
		this.width = window.innerWidth
		this.height = window.innerHeight
		this.pixelRatio = Math.min(window.devicePixelRatio, 2)

		//监听
		window.addEventListener('resize', () => {
			this.width = window.innerWidth
			this.height = window.innerHeight
			this.pixelRatio = Math.min(window.devicePixelRatio, 2)

			this.trigger('resize')
		})
	}
}