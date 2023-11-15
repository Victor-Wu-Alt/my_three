// import './style.css'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Experience from './Experience/Experience';

const experience = new Experience(document.querySelector('.webgl'))

// //加载过程处理器
// const loadingManager = new THREE.LoadingManager()

// //初始化纹理加载器
// const textureLoader = new THREE.TextureLoader(loadingManager)
// const cubeTextureLoader = new THREE.CubeTextureLoader()

// const environmentMap = cubeTextureLoader.load([
//     '/textures/environmentMaps/1/px.jpg',
//     '/textures/environmentMaps/1/nx.jpg',
//     '/textures/environmentMaps/1/py.jpg',
//     '/textures/environmentMaps/1/ny.jpg',
//     '/textures/environmentMaps/1/pz.jpg',
//     '/textures/environmentMaps/1/nz.jpg',
// ])
// environmentMap.encoding = THREE.sRGBEncoding

// //初始化场景 
// const scene = new THREE.Scene()
// // scene.background = environmentMap
// scene.environment = environmentMap

// //动画混合器
// let mixer = null

// //初始化模型加载器
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')
// const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)
// gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
//     if (gltf.animations[0]) {
//         mixer = new THREE.AnimationMixer(gltf.scene)
//         const action = mixer.clipAction(gltf.animations[0])
//         action.play()
//         // gltf.scene.scale.set(20, 20, 20)
//         // gltf.scene.position.set(-2, -60, -5)

//         gltf.scene.scale.set(0.02, 0.02, 0.02)
//         // gltf.scene.position.set(0, -4, 0)
//         // gltf.scene.rotation.y = Math.PI * 0.5
//     }
//     else {
//         gltf.scene.scale.set(10, 10, 10)
//         gltf.scene.position.set(0, -4, 0)
//         gltf.scene.rotation.y = Math.PI * 0.5
//     }
//     gui.add(gltf.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('模型旋转角度')
//     scene.add(gltf.scene)
//     updateAllMaterials()

// })


// //更新所有的材质
// const updateAllMaterials = () => {
//     scene.traverse((child) => {
//         if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
//             // child.material.envMap = environmentMap
//             child.material.envMapIntensity = debugObject.envMapIntensity
//             child.material.needsUpdate = true
//             child.castShadow = true
//             child.receiveShadow = true
//         }
//     })
// }


// //获取渲染dom
// const canvas = document.querySelector('.webgl')

// //监听鼠标
// const cursor = {
//     x: 0,
//     y: 0
// }

// window.addEventListener('mousemove', (e) => {
//     cursor.x = e.clientX / window.innerWidth - 0.5  //(-0.5,0.5)
//     cursor.y = -(e.clientY / window.innerHeight - 0.5) //(-0.5,0.5)
// })

// //监听窗口大小 resize
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })




// // 对象
// // 地面
// const floorColorTexture = textureLoader.load('textures/dirt/color.jpg')
// floorColorTexture.encoding = THREE.sRGBEncoding
// floorColorTexture.repeat.set(1.5, 1.5)
// floorColorTexture.wrapS = THREE.RepeatWrapping
// floorColorTexture.wrapT = THREE.RepeatWrapping

// const floorNormalTexture = textureLoader.load('textures/dirt/normal.jpg')
// floorNormalTexture.repeat.set(1.5, 1.5)
// floorNormalTexture.wrapS = THREE.RepeatWrapping
// floorNormalTexture.wrapT = THREE.RepeatWrapping

// const floorGeometry = new THREE.CircleGeometry(5, 64)
// const floorMaterial = new THREE.MeshStandardMaterial({
//     map: floorColorTexture,
//     normalMap: floorNormalTexture
// })
// const floor = new THREE.Mesh(floorGeometry, floorMaterial)
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)


// //添加光源
// // const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
// // scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.shadow.normalBias = 0.01
// directionalLight.position.set(0.25, 3, -2.25)

// // const directCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLight)

// //光照投射器
// const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(- 3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()


// //坐标辅助线
// // const axesHelper = new THREE.AxesHelper(5)
// // scene.add(axesHelper)

// //调试工具
// const gui = new dat.GUI({ width: 325 });
// const debugObject = {
//     envMapIntensity: 5
// }
// gui.add(directionalLight, 'intensity', 0, 10, 0.001).name('直射光光照强度')
// gui.add(directionalLight.position, 'x', 0, 5, 0.001).name('直射光光照X轴')
// gui.add(directionalLight.position, 'y', 0, 5, 0.001).name('直射光光照Y轴')
// gui.add(directionalLight.position, 'z', 0, 5, 0.001).name('直射光光照Z轴')
// gui.add(debugObject, 'envMapIntensity', 0, 10, 0.001).name('环境图强度').onChange(() => {
//     updateAllMaterials()
// })

// //获取鼠标坐标
// const mouse = new THREE.Vector2()
// window.addEventListener('mousemove', (e) => {
//     mouse.x = e.clientX / window.innerWidth * 2 - 1
//     mouse.y = -e.clientY / window.innerHeight * 2 + 1
// })

// window.addEventListener('click', (e) => {

// })


// const aspectRadio = window.innerWidth / window.innerHeight

// const camera = new THREE.PerspectiveCamera(75, aspectRadio, 0.1, 100)
// camera.position.set(- 3, 3, 3)
// scene.add(camera)

// //轨道控制器
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true  //减震器

// //创建渲染器
// const renderer = new THREE.WebGLRenderer({
//     canvas,
//     antialias: true //抗锯齿
// })
// renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// //开启阴影贴图
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.physicallyCorrectLights = true
// renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 2

// gui.add(renderer, 'toneMapping', {
//     NO: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilnic: THREE.ACESFilmicToneMapping
// }).name('色调映射(hdr->ldr)').onFinishChange(() => {
//     renderer.toneMapping = Number(renderer.toneMapping)
//     updateAllMaterials()
// })

// gui.add(renderer, 'toneMappingExposure', 0, 10, 0.001).name('色调映射曝光')
// //Clock
// const clock = new THREE.Clock()
// let oldElapsedTime = 0

// //添加动画
// const tick = () => {
//     //clock
//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - oldElapsedTime
//     oldElapsedTime = elapsedTime

//     //动画效果
//     if (mixer) {
//         mixer.update(deltaTime)
//     }

//     //控制器更新
//     controls.update()

//     //渲染
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }

// tick()

