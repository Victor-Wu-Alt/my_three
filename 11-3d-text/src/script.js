import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'


//获取渲染dom
const canvas = document.querySelector('.webgl')


//纹理加载器
const textureLoader = new THREE.TextureLoader()
var matcapTexture = textureLoader.load(`/textures/matcaps/8.png`)

//属性创建
const paramaters = {
    color: '#ffffff',
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    },
    changeMaterial: 1
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

// // 双击全屏
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

//字体加载器
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })  //文字纹理
// const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture }) //甜甜圈纹理
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Hello World', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffser: 0,
        bevelSegments: 3
    });
    // textGeometry.computeBoundingBox() //测试边界 方便将文字移动到中间
    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,  //因为有斜角 所以要减去0.02
    //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,  //因为有斜角 所以要减去0.02
    //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // )
    textGeometry.center()
    // material.matcap = matcapTexture
    // material.needsUpdate = true
    // textMaterial.wireframe = true
    const text = new THREE.Mesh(textGeometry, material)
    // text.position.x=(textGeometry.boundingBox.min.x-textGeometry.boundingBox.max.x)/2
    scene.add(text)


    console.time('dounts');

    //添加甜甜圈    
    for (let i = 0; i < 1000; i++) {
        const donutMesh = new THREE.Mesh(donutGeometry, material)
        // 设置每个TorusGeometry的不同位置和大小
        donutMesh.position.x = (Math.random() - 0.5) * 10; // 随机X坐标
        donutMesh.position.y = (Math.random() - 0.5) * 10; // 随机Y坐标
        donutMesh.position.z = (Math.random() - 0.5) * 10; // 随机Z坐标
        const scale = Math.random()// 随机大小
        donutMesh.scale.set(scale, scale, scale);
        //设置旋转角度
        donutMesh.rotation.x = Math.random() * Math.PI
        donutMesh.rotation.y = Math.random() * Math.PI
        scene.add(donutMesh)
    }

    console.timeEnd('dounts');
})


//添加坐标系 
// const axedHelper = new THREE.AxesHelper(2)
// scene.add(axedHelper)

//创建一个立方体
// const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
//材质 
// const material = new THREE.MeshBasicMaterial({ color: paramaters.color })
//创建网格
// const mesh = new THREE.Mesh(geometry, material)
//场景添加网格
// scene.add(mesh)

//调试工具
const gui = new dat.GUI();
// gui.add(mesh.position, 'y', -3, 3, 0.01)
// gui.add(mesh, 'visible')
// gui.add(material, 'wireframe')
// gui.addColor(paramaters, 'color').onChange(() => {
//     material.color.set(paramaters.color)
// })
// gui.add(paramaters, 'spin')
gui.add(paramaters, 'changeMaterial', [1, 2, 3, 4, 5, 6, 7, 8]).name('修改纹理').onChange(
    (e) => {
        matcapTexture = textureLoader.load(`/textures/matcaps/${e}.png`)
        material.matcap = matcapTexture
        material.needsUpdate = true
    }
)
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
// camera.lookAt(mesh.position)
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

