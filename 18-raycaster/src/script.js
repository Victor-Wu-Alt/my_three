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
const geometry = new THREE.SphereGeometry(0.5, 16, 16)
const material = new THREE.MeshBasicMaterial({ color: 'red' })

const object2 = new THREE.Mesh(geometry, material)

const object1 = new THREE.Mesh(geometry, material)
object1.position.x = -2

const object3 = new THREE.Mesh(geometry, material)
object3.position.x = 2
scene.add(object1, object2, object3)


//光照投射器
const raycaster = new THREE.Raycaster()



//坐标辅助线
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

//调试工具
const gui = new dat.GUI();
// gui.add(mesh.position, 'y', -3, 3, 0.01)
// gui.add(mesh, 'visible')

//获取鼠标坐标
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth * 2 - 1
    mouse.y = -e.clientY / window.innerHeight * 2 + 1
})

window.addEventListener('click', (e) => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click object1');
                break;
            case object2:
                console.log('click object2');
                break;
            case object3:
                console.log('click object3');
                break;
        }
    }
})


const aspectRadio = window.innerWidth / window.innerHeight

const camera = new THREE.PerspectiveCamera(75, aspectRadio, 0.1, 100)
camera.position.z = 3
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

let currentIntersect = null

//添加动画
const tick = () => {
    //clock
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    raycaster.setFromCamera(mouse, camera)

    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirecetion = new THREE.Vector3(1, 0, 0)
    // rayDirecetion.normalize()
    // raycaster.set(rayOrigin, rayDirecetion)

    const objects = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objects)

    for (let object of objects) {
        object.material.color.set('#ff0000')
    }

    for (let intersect of intersects) {
        intersect.object.material.color.set('#0094ff')
    }

    if (intersects.length) {
        if (!currentIntersect) {
            console.log('mouse enter');
        }
        currentIntersect = intersects[0]
    }
    else {
        if (currentIntersect) {
            console.log('mouse leave');
        }
        currentIntersect = null
    }
    //控制器更新
    controls.update()

    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

