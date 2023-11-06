import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import gsap from 'gsap'

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

//双击全屏
// window.addEventListener('dblclick', () => {
//     if (!document.fullscreenElement) {
//         canvas.requestFullscreen()
//     }
//     else {
//         document.exitFullscreen()
//     }
// })

//初始化场景 
const scene = new THREE.Scene()

//创建一个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
//材质 
const material = new THREE.MeshBasicMaterial({ color: paramaters.color })
//创建网格
const mesh = new THREE.Mesh(geometry, material)
//场景添加网格
scene.add(mesh)

//调试工具
const gui = new dat.GUI({closed:true});
gui.add(mesh.position, 'y', -3, 3, 0.01)
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')
gui.addColor(paramaters, 'color').onChange(() => {
    material.color.set(paramaters.color)
})
gui.add(paramaters, 'spin')
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
camera.position.z = 3
// camera.position.set(2, 2, 2)
camera.lookAt(mesh.position)
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

//Clock
const clock = new THREE.Clock()

//添加动画
const tick = () => {
    //clock
    const elapsedTime = clock.getElapsedTime()
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

