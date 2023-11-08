import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import gsap from 'gsap'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
// import imageSource from '../static/textures/door/color.jpg'
// import {SRGBColorSpace} from 'three/src/constants.d.ts'


//纹理
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.onload = () => {
//     texture.needsUpdate = true
//     console.log(texture);
// }
// image.src = '/textures/door/color.jpg'

//加载过程处理器
const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = () => {
//     console.log('start');
// }
// loadingManager.onLoad = () => {
//     console.log('load');
// }
// loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
//     console.log('progress');
// };

// loadingManager.onError = (url) => {
//     console.log('error' + url);
// };

//初始化加载器
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
const colorTexture = textureLoader.load('/textures/door/color.jpg')
// const colorTexture = textureLoader.load('/textures/minecraft.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
const earthTexture = textureLoader.load('/textures/earth.jpg')
const grassTexture = textureLoader.load('/textures/grass.jpg')
const ballTexture = textureLoader.load('/textures/ball.jpg')


// colorTexture.colorSpace = THREE.SRGBColorSpace
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5


//过滤器
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

//获取渲染dom
const canvas = document.querySelector('.webgl')

//属性创建
const paramaters = {
    color: '#00ffff',
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
}

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

//创建一个立方体
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
// console.log(geometry.attributes.uv);
//材质 
// const material = new THREE.MeshBasicMaterial()
// material.map = colorTexture
// material.color = new THREE.Color(0x00ffff)
// material.wireframe = true
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = alphaTexture
// material.side=THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.map = normalTexture
// material.wireframe = true
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial()

// const material=new THREE.MeshLambertMaterial()

// const material=new THREE.MeshPhongMaterial()
// material.shininess=100
// material.specular=new THREE.Color(0x00ffff)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false


// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// material.map = colorTexture
// material.aoMap = ambientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = heightTexture
// material.displacementScale = 0.05
// material.metalnessMap = matcapTexture
// material.roughnessMap = roughnessTexture
// material.normalMap = normalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = alphaTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 0.4
// material.envMap = environmentMapTexture
material.side = THREE.DoubleSide
// material.wireframe=true

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshStandardMaterial({ map: ballTexture })
)
sphere.position.set = (2, 2, -1)
//投射影子
sphere.castShadow = true

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(0.75, 0.75, 0.75),
//     material
// )

// const torus = new THREE.Mesh(
//     new THREE.TorusGeometry(0.3, 0.2, 32, 64),
//     material
// )
// torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    // material
    new THREE.MeshBasicMaterial({
        map: grassTexture
    })
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
//接收影子
plane.receiveShadow = true

// scene.add(sphere, cube, torus, plane)

//阴影和球体同步 
const sphereShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({
    alphaMap: simpleShadow,
    color: 0x01395a,
    transparent: true
}))

sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.1

scene.add(sphere, sphereShadow, plane)



//灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)  //颜色 强度
scene.add(ambientLight)

const directLight = new THREE.DirectionalLight(0xffffff, 0.3)
directLight.position.set(2, 2, -1)
directLight.castShadow = true
directLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
directLight.shadow.camera.near = 1
directLight.shadow.camera.far = 6
directLight.shadow.camera.top = 2
directLight.shadow.camera.right = 2
directLight.shadow.camera.bottom = -2
directLight.shadow.camera.left = -2
directLight.shadow.radius = 10
scene.add(directLight)

const directionCameraHelper = new THREE.CameraHelper(directLight.shadow.camera)
directionCameraHelper.visible = false
scene.add(directionCameraHelper)


const spotLight = new THREE.SpotLight(0xffffff, 0.3, 6, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = true
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
scene.add(spotLight)
scene.add(spotLight.target)


const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)
pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5
scene.add(pointLight)

const pointCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointCameraHelper.visible = false
scene.add(pointCameraHelper)

//加载阴影纹理

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
// scene.add(hemisphereLight)

// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.set(2, 3, 4)
// scene.add(pointLight)

// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
// rectAreaLight.position.set(-1.5, 0, 1.5)
// rectAreaLight.lookAt(new THREE.Vector3())
// scene.add(rectAreaLight)

// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.25, 1)
// spotLight.position.set(0, 2, 3)
// scene.add(spotLight)

// spotLight.target.position.x = -0.75
// scene.add(spotLight.target)

// //灯光辅助 
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directLight, 1)
// scene.add(directionalLightHelper)

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

// window.requestAnimationFrame(() => {
//     spotLightHelper.update()
// })


// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)
// window.requestAnimationFrame(() => {
//     rectAreaLightHelper.position.copy(rectAreaLight.position)
//     rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
//     rectAreaLightHelper.update()
// })

// const r=new THREE.RectAreaLightHelper()

// //坐标辅助线
// const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

//调试工具
const gui = new dat.GUI();
// gui.add(mesh.position, 'y', -3, 3, 0.01)
// gui.add(mesh, 'visible')
gui.add(material, 'metalness', 0, 1, 0.0001).name('材质金属度')
gui.add(material, 'roughness', 0, 1, 0.0001).name('材质粗糙度')
// gui.add(material, 'aoMapIntensity', 0, 10, 0.0001)
// gui.add(material, 'displacementScale', 0, 10, 0.0001)
gui.add(ambientLight, 'intensity', 0, 1, 0.0001).name('环境光光照强度')
// gui.add(directLight, 'intensity', 0, 1, 0.0001).name('直射光光照强度')
gui.add(spotLight, 'intensity', 0, 1, 0.0001).name('聚光灯光照强度')
gui.add(sphere.position, 'x', 0.1, 10, 0.0001).name('球体x轴')
gui.add(sphere.position, 'y', 0.1, 10, 0.0001).name('球体y轴')
gui.add(sphere.position, 'z', 0.1, 10, 0.0001).name('球体z轴')

// gui.addColor(paramaters, 'color').onChange(() => {
//     material.color.set(paramaters.color)
// })
// gui.add(paramaters, 'spin')
// gui.add(mesh.position,'z',-3,3,0.01)
// gui.add(mesh.position,'x',-3,3,0.01)


const aspectRadio = window.innerWidth / window.innerHeight
//创建一个相机
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRadio,
//     1 * aspectRadio,
//     -1,
//     1,
//     0.1,
//     1000);

const camera = new THREE.PerspectiveCamera(75, aspectRadio, 0.1, 1000)
// camera.position.set = (0, 0, 3)
// camera.position.z = 3
camera.position.set(2, 2, 2)
// camera.lookAt(mesh.position)
scene.add(camera)

//轨道控制器
const controls = new OrbitControls(camera, canvas)
// controls.enabled=false
controls.enableDamping = true  //减震器

//创建渲染器
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//开启阴影贴图
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.shadowMap.type=THREE.VSMShadowMap

//Clock
const clock = new THREE.Clock()

//添加动画
const tick = () => {
    //clock
    const elapsedTime = clock.getElapsedTime()

    // 更新动画
    // sphere.rotation.y = 0.1 * elapsedTime
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = 1 - sphere.position.y
    // cube.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.15 * elapsedTime
    // cube.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime
    //更新动画
    // camera.position.y = Math.sin(elapsedTime)
    // mesh.rotation.y = elapsedTime

    //修改相机位置 
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    // camera.position.y = cursor.y * 5
    // camera.lookAt(mesh.position) 

    //控制器更新
    controls.update()

    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

