import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import gsap from 'gsap'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';



//获取渲染dom
const canvas = document.querySelector('.webgl')

//监听窗口大小 resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const parameters = {
    materialColor: '#ffeded'
}

//初始化场景 
const scene = new THREE.Scene()

//初始化加载器
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// 对象
// const geometry = new THREE.SphereGeometry(0.5, 16, 16)
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap: gradientTexture })

//距离
const objectsDistance = 4

//甜甜圈
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
mesh1.position.y = -objectsDistance * 0
mesh1.position.x = 2
//金字塔
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
mesh2.position.y = -objectsDistance * 1
mesh2.position.x = -2

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
mesh3.position.y = -objectsDistance * 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

//粒子
const count = 500
const positions = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particleMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

//光源
const directinLight = new THREE.DirectionalLight('#ffffff', 1)
directinLight.position.set(1, 1, 0)
scene.add(directinLight)


//光照投射器
const raycaster = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3(- 3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()

//坐标辅助线
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

//调试工具
const gui = new dat.GUI();
gui.addColor(parameters, 'materialColor').name('材质颜色').onChange(() => {
    material.color.set(parameters.materialColor)
    particleMaterial.color.set(parameters.materialColor)
})


const aspectRadio = window.innerWidth / window.innerHeight

//创建一个相机组合
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, aspectRadio, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

//轨道控制器
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true  //减震器

//创建渲染器
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})
renderer.setClearAlpha(1)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//开启阴影贴图
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.shadowMap.type=THREE.VSMShadowMap

//屏幕滚动和相机结合
let scrollDistance = null
let currentSection = 0
const onScroll = () => {
    // 更新相机的位置
    scrollDistance = window.scrollY;
    const newSelection = Math.round(scrollDistance / window.innerHeight)
    if (currentSection != newSelection) {
        currentSection = newSelection
        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        })
    }
}

// 监听滚动事件
window.addEventListener('scroll', onScroll, false);


//监听鼠标
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = event.clientY / window.innerHeight - 0.5
})


//Clock
const clock = new THREE.Clock()
let previousTime = 0
//添加动画
const tick = () => {
    //clock
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //控制器更新
    // controls.update()

    //动画
    camera.position.y = -scrollDistance / window.innerHeight * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 3
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 3

    for (let mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

