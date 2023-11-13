import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import gsap from 'gsap'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import CANNON from 'cannon'


//调试工具
const gui = new dat.GUI();

const debugObject = {}
debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}

debugObject.reset = () => {
    objectsToUpdate.map((item) => {
        item.body.removeEventListener('collide', playHitSound)
        world.removeBody(item.body)
        scene.remove(item.mesh)
    })
}
gui.add(debugObject, 'createSphere').name('创建球体')
gui.add(debugObject, 'createBox').name('创建立方体')
gui.add(debugObject, 'reset').name('重置')
//加载过程处理器
const loadingManager = new THREE.LoadingManager()

//初始化加载器
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

//创建一个物理世界
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

//材质
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,  //摩擦
        restitution: 0.7  //反弹
    }
)

// world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// //球体
// const sphereShape = new CANNON.Sphere(0.5)
// const shpereBody = new CANNON.Body({
//     mass: 1, //质量
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
// })


// //施加力
// shpereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(shpereBody)

//地面 
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({
    mass: 0,
    shape: planeShape,
})
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(planeBody)


//创建一个声音
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }

}

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
// const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const planeGeometry = new THREE.PlaneGeometry(10, 10)

// //球体
// const sphere = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5
// }))

// sphere.position.y = 0.5
//地面
const plane = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
}))

plane.rotation.x = -Math.PI * 0.5
// sphere.castShadow = true
plane.receiveShadow = true

// scene.add(sphere, plane)
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


//创建需要更新的对象数组
const objectsToUpdate = []
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
//创建球体
const createSphere = (radius, position) => {
    //网格
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )

    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    //cannon
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

createSphere(0.5, { x: 0, y: 3, z: 0 })

//创建立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
//创建球体
const createBox = (width, height, depth, position) => {
    //网格
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    )

    mesh.castShadow = true
    mesh.scale.set(width, height, depth)
    mesh.position.copy(position)
    scene.add(mesh)

    //cannon
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

//Clock
const clock = new THREE.Clock()
let oldElapsedTime = 0

//添加动画
const tick = () => {
    //clock
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    //更新物理世界

    // shpereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), shpereBody.position)
    world.step(1 / 60, deltaTime, 3)
    // sphere.position.x = shpereBody.position.x
    // sphere.position.y = shpereBody.position.y
    // sphere.position.z = shpereBody.position.z

    // sphere.position.copy(shpereBody.position)
    objectsToUpdate.map((item) => {
        item.mesh.position.copy(item.body.position)
        item.mesh.quaternion.copy(item.body.quaternion)
    })

    //控制器更新
    controls.update()

    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

