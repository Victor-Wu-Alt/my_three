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
const particlesTexture = textureLoader.load('/textures/particles/3.png')
//过滤器
// colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter
// colorTexture.magFilter = THREE.NearestFilter

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

//几何体
const particlesGemotry = new THREE.BufferGeometry(1, 32, 32)

//粒子数量
const count = 20000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particlesGemotry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGemotry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
//材质
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: '#f286c4',
    // map: particlesTexture,
    alphaMap: particlesTexture,
    transparent: true,
    // alphaTest: 0.001
    // depthTest: false
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

const particles = new THREE.Points(particlesGemotry, particlesMaterial)
scene.add(particles)



//坐标辅助线
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//调试工具
const gui = new dat.GUI();

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
renderer.shadowMap.enabled = false

//Clock
const clock = new THREE.Clock()

//添加动画
const tick = () => {
    //clock
    const elapsedTime = clock.getElapsedTime()

    // particles.position.x = -0.01 * elapsedTime
    // particles.rotation.y = 0.2 * elapsedTime
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGemotry.attributes.position.array[i3]
        particlesGemotry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGemotry.attributes.position.needsUpdate = true
    //控制器更新
    controls.update()

    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

