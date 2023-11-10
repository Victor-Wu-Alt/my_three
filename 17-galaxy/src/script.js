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

//参数对象
const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3, //幂函数
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
}

//初始化
let galaxyGeometry = null
let galaxyMaterial = null
let points = null

//星体
const generateGalaxy = () => {

    //销毁之前元素
    if (points) {
        galaxyGeometry.dispose()
        galaxyMaterial.dispose()
        scene.remove(points)
    }
    //初始化几何体
    galaxyGeometry = new THREE.BufferGeometry()
    //位置集合
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        const radius = parameters.radius * Math.random()
        const spinAngle = radius * parameters.spin
        const branchAngle = i % parameters.branches / parameters.branches * 2 * Math.PI

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX  //X轴
        positions[i3 + 1] = randomY //Y轴
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ //Z轴


        const colorInside = new THREE.Color(parameters.insideColor)
        const colorOutside = new THREE.Color(parameters.outsideColor)

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)
        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }


    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    //材质
    galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        // color: '#0094ff'
    })


    points = new THREE.Points(galaxyGeometry, galaxyMaterial)
    scene.add(points)
}


generateGalaxy()

//坐标辅助线
const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

//调试工具
const gui = new dat.GUI();
gui.add(parameters, 'count', 100, 1000000, 100).name('粒子数量').onFinishChange(() => {
    generateGalaxy()
})
gui.add(parameters, 'size', 0.01, 0.1, 0.001).name('粒子大小').onFinishChange(() => {
    generateGalaxy()
})
gui.add(parameters, 'radius', 0.01, 20, 0.001).name('星体半径').onFinishChange(() => {
    generateGalaxy()
})
gui.add(parameters, 'branches', 2, 20, 1).name('星体分支').onFinishChange(() => {
    generateGalaxy()
})
gui.add(parameters, 'spin', -5, 5, 0.001).name('星体旋转').onFinishChange(() => {
    generateGalaxy()
})
gui.add(parameters, 'randomness', 0, 2, 0.001).name('随机性').onFinishChange(() => {
    generateGalaxy()
})
gui.add(parameters, 'randomnessPower', 1, 9, 0.001).name('幂').onFinishChange(() => {
    generateGalaxy()
})
gui.addColor(parameters, 'insideColor',).name('中心颜色').onFinishChange(() => {
    generateGalaxy()
})
gui.addColor(parameters, 'outsideColor',).name('外围颜色').onFinishChange(() => {
    generateGalaxy()
})

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

    //控制器更新
    controls.update()

    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

