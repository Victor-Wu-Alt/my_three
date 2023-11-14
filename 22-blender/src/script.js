import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
// import gsap from 'gsap'
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
// import CANNON from 'cannon'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

//调试工具
const gui = new dat.GUI();

//加载过程处理器
const loadingManager = new THREE.LoadingManager()

//初始化纹理加载器
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader()

//动画混合器
let mixer = null

//初始化模型加载器
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/models/Dragon/glTF/Dragon.gltf', (gltf) => {
    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()
    scene.add(gltf.scene)
})


//获取渲染dom
const canvas = document.querySelector('.webgl')

//监听鼠标
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / window.innerWidth - 0.5  //(-0.5,0.5)
    cursor.y = -(e.clientY / window.innerHeight - 0.5) //(-0.5,0.5)
})

//监听窗口大小 resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})


//初始化场景 
const scene = new THREE.Scene()

// 对象
const planeGeometry = new THREE.PlaneGeometry(10, 10)
//地面
const plane = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMapIntensity: 0.5
}))

plane.rotation.x = -Math.PI * 0.5
plane.receiveShadow = true
scene.add(plane)


//添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

//光照投射器
const raycaster = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3(- 3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()


//坐标辅助线
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)


//获取鼠标坐标
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth * 2 - 1
    mouse.y = -e.clientY / window.innerHeight * 2 + 1
})

window.addEventListener('click', (e) => {

})


const aspectRadio = window.innerWidth / window.innerHeight

const camera = new THREE.PerspectiveCamera(75, aspectRadio, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

//轨道控制器
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true  //减震器

//创建渲染器
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//开启阴影贴图
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.shadowMap.type=THREE.VSMShadowMap



//Clock
const clock = new THREE.Clock()
let oldElapsedTime = 0

//添加动画
const tick = () => {
    //clock
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    //动画效果
    if (mixer) {
        mixer.update(deltaTime)
    }

    //控制器更新
    controls.update()

    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

