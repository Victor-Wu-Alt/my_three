import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Face3, Geometry } from 'three/examples/jsm/deprecated/Geometry';

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

//监听窗口大小 resize`
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

//双击全屏
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    }
    else {
        document.exitFullscreen()
    }
})

//初始化场景 
const scene = new THREE.Scene()

//创建一个立方体
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2)

const geometry = new THREE.BufferGeometry()

const count = 50
const positionArray = new Float32Array(count * 3 * 3)
for (let i = 0; i < count * 3 * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 4
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
geometry.setAttribute('position', positionAttribute)
// position[0] = 0
// position[1] = 0
// position[2] = 0

// position[3] = 0
// position[4] = 1
// position[5] = 0

// position[6] = 1
// position[7] = 0
// position[8] = 0
// const geometry = new Geometry()

// for (let i = 0; i < 50; i++) {
//     for (let j = 0; j < 3; j++) {
//         geometry.vertices.push(new THREE.Vector3(
//             (Math.random() - 0.5) * 4, //x
//             (Math.random() - 0.5) * 4, //y
//             (Math.random() - 0.5) * 4 //z
//         ))
//     }

//     const verticesIndex = i * 3
//     geometry.faces.push(new Face3(
//         verticesIndex,
//         verticesIndex + 1,
//         verticesIndex + 2
//     ))
// }
// const vertex1 = new THREE.Vector3(0, 0, 0)
// geometry.wireframe.push(vertex1)
// const vertex2 = new THREE.Vector3(0, 1, 0)
// geometry.wireframe.push(vertex2)
// const vertex3 = new THREE.Vector3(1, 0, 0)
// geometry.wireframe.push(vertex3)

// const face = new Face3(0, 1, 2)
// geometry.faces.push(face)
//材质 
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true
})
//创建网格
const mesh = new THREE.Mesh(geometry, material)
//场景添加网格
scene.add(mesh)

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

