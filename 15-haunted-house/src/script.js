import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import gsap from 'gsap'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

//加载过程处理器
const loadingManager = new THREE.LoadingManager()

//初始化加载器
const textureLoader = new THREE.TextureLoader(loadingManager)

//  门的纹理
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// 墙的纹理
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// 地面的纹理
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
//过滤器
// colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter
// colorTexture.magFilter = THREE.NearestFilter

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

//雾化
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
material.metalness = 0
material.roughness = 0.4
material.side = THREE.DoubleSide

// Objects

//房子
const house = new THREE.Group()
scene.add(house)

//房子的墙壁
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughness: bricksRoughnessTexture
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25
house.add(walls)

//房顶
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI * 0.24
roof.position.y = 3
roof.radius = 4
house.add(roof)

// 门
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)

door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.z = 2 + 0.01
door.position.y = 1
house.add(door)

//灌木丛
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)


//墓碑
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

//创建50个墓碑
for (let i = 0; i < 50; i++) {
    const angle = Math.PI * 2 * Math.random()
    const radius = Math.random() * 6 + 3
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.4, z)
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}

//地面
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    // material
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughness: grassRoughnessTexture
    })
)


floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
//接收影子
floor.receiveShadow = true
scene.add(floor)


//灯光
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)  //颜色 强度
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)

scene.add(moonLight)

//门灯
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)

house.add(doorLight)

// const directionCameraHelper = new THREE.CameraHelper(directLight.shadow.camera)
// directionCameraHelper.visible = false
// scene.add(directionCameraHelper)


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

//鬼魂
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)

scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)

scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

//坐标辅助线
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//调试工具
const gui = new dat.GUI();
// gui.add(mesh.position, 'y', -3, 3, 0.01)
// gui.add(mesh, 'visible')
gui.add(material, 'metalness', 0, 1, 0.0001).name('材质金属度')
gui.add(material, 'roughness', 0, 1, 0.0001).name('材质粗糙度')
gui.add(ambientLight, 'intensity', 0, 1, 0.0001).name('环境光光照强度')
gui.add(moonLight, 'intensity', 0, 1, 0.0001).name('月光灯光照强度')
gui.add(moonLight.position, 'x', 0, 1, 0.0001).name('月光灯x轴')
gui.add(moonLight.position, 'y', 0, 1, 0.0001).name('月光灯y轴')
gui.add(moonLight.position, 'z', 0, 1, 0.0001).name('月光灯z轴')


const aspectRadio = window.innerWidth / window.innerHeight

const camera = new THREE.PerspectiveCamera(75, aspectRadio, 0.1, 100)
camera.position.set(4, 2, 5)

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
moonLight.castShadow = true
door.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

moonLight.shadow.mapSize = new THREE.Vector2(256, 256)
moonLight.shadow.camera.far = 15

doorLight.shadow.mapSize = new THREE.Vector2(256, 256)
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize = new THREE.Vector2(256, 256)
ghost1.shadow.camera.far = 7
ghost2.shadow.mapSize = new THREE.Vector2(256, 256)
ghost2.shadow.camera.far = 7
ghost3.shadow.mapSize = new THREE.Vector2(256, 256)
ghost3.shadow.camera.far = 7
// ghost4.shadow.mapSize = new THREE.Vector2(256, 256)
// ghost4.shadow.camera.far = 7

renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#262837')
// renderer.shadowMap.type=THREE.VSMShadowMap

//Clock
const clock = new THREE.Clock()

//添加动画
const tick = () => {
    //clock
    const elapsedTime = clock.getElapsedTime()

    //鬼魂1
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.set(
        Math.cos(ghost1Angle) * 4,
        Math.sin(elapsedTime * 3),
        Math.sin(ghost1Angle) * 4,
    )

    //鬼魂2
    const ghost2Angle = elapsedTime * 0.32
    ghost2.position.set(
        Math.cos(ghost2Angle) * 5,
        Math.sin(elapsedTime * 4),
        Math.sin(ghost2Angle) * 5
    )

    //鬼魂3
    const ghost3Angle = elapsedTime * 0.18
    ghost3.position.set(
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32)),
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5),
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.25))
    )

    //控制器更新
    controls.update()

    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

