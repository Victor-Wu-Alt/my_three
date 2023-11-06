import './style.css'
import * as THREE from 'three'
//获取渲染dom
const canvas = document.querySelector('.webgl')

//初始化场景 
const scene = new THREE.Scene()

//创建一个组合
const group = new THREE.Group()
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1
scene.add(group)
// //创建一个立方体
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// //材质 
// const material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
// //创建网格
// const mesh = new THREE.Mesh(geometry, material)
// //mesh位置设置
// mesh.position.set(0.7, -0.6, 1)
// //mesh的缩放
// mesh.scale.set(2, 0.5, 0.5)
// //mesh的旋转
// mesh.rotation.y = Math.PI * 0.25
// //场景添加网格
// group.add(mesh)

//创建立方体集合
const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x00ffff })
)

group.add(cube1)

const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xff00ff })
)
cube2.position.x = 2
group.add(cube2)

const cube3 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xffff00 })
)
cube3.position.x = -2
group.add(cube3)

//创建一个相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set = (0, 0, 3)
camera.position.z = 3
scene.add(camera)

// //创建坐标辅助器
// const axesHelper = new THREE.AxesHelper(2)
// group.add(axesHelper)

//创建渲染器
const renderer = new THREE.WebGLRenderer({
	canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.render(scene, camera)