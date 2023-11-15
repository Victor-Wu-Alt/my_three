import EventEmitter from "./EventEmitter";
export default class Time extends EventEmitter {
	constructor() {
		super()
		//初始化时间
		this.start = Date.now()
		this.current = this.start
		this.elapsed = 0
		this.delta = 16

		//动画
		window.requestAnimationFrame(() => {
			this.tick()
		})
	}
	tick() {
		const currentTime = Date.now()
		this.delta = currentTime - this.current
		this.current = currentTime
		this.elapsed = this.current - this.start

		this.trigger('tick')

		window.requestAnimationFrame(() => {
			this.tick()
		})
	}
}