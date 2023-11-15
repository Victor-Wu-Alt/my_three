import EventEmitter from "./EventEmitter";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three'

export default class Resources extends EventEmitter {
	constructor(sources) {
		super()
		this.sources = sources

		this.items = {}
		this.toLoad = this.sources.length
		this.loaded = 0

		this.setLoaders()
		this.startLoading()
	}


	setLoaders() {
		this.loaders = {
			gltfLoader: new GLTFLoader(),
			textureLoader: new THREE.TextureLoader(),
			cubeTextureLoader: new THREE.CubeTextureLoader(),
			dracoLoader: new DRACOLoader()
		}
		this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
	}

	startLoading() {
		for (let source of this.sources) {
			switch (source.type) {
				case 'gltfModel':
					this.loaders.gltfLoader.load(source.path, (file) => {
						this.sourceLoaded(source, file)
					})
					break;
				case 'cubeTexture':
					this.loaders.cubeTextureLoader.load(source.path, (file) => {
						this.sourceLoaded(source, file)
					})
					break;
				case 'texture':
					this.loaders.textureLoader.load(source.path, (file) => {
						this.sourceLoaded(source, file)
					})
					break;
				default:
					break;
			}
		}
	}

	sourceLoaded(source, file) {
		this.items[source.name] = file
		this.loaded++
		if (this.loaded === this.toLoad) {
			this.trigger('ready')
		}
	}
}