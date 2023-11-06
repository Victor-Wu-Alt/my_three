import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

//获取渲染dom
const canvas = document.querySelector('.webgl')

//初始化场景 
const scene = new THREE.Scene()

//创建一个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1)
//材质 
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
//创建网格
const mesh = new THREE.Mesh(geometry, material)
//场景添加网格
scene.add(mesh)

//创建一个相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set = (0, 0, 3)
camera.position.z = 3
scene.add(camera)

//创建渲染器
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

//Clock
// const clock = new THREE.Clock()

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

gsap.to(mesh.position, { duration: 1, delay: 2, x: 0})

//添加动画
const tick = () => {
    // //clock
    // const elapsedTime = clock.getElapsedTime()
    // //更新动画
    // camera.position.y = Math.sin(elapsedTime)
    // camera.position.x=Math.cos(elapsedTime)
    // camera.lookAt(mesh.position)
    //渲染
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

