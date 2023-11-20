//  uniform mat4 projectionMatrix;  //投影矩阵
//  uniform mat4 viewMatrix;    //视图矩阵（camera的变化）
//  uniform mat4 modelMatrix;  //模型矩阵 （mesh的移动 缩放）
 uniform vec2 uFrequency;
 uniform float uTime;

// attribute vec3 position; 
attribute float aRandom;
// attribute vec2 uv;

varying float vRadom;  //因为片段着色器拿不到属性
varying vec2 vUv;  //因为片段着色器拿不到属性
varying float vElevation;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.0);

    // float elevation=sin(modelPosition.x*uFrequency.x-uTime)*0.1;
    // elevation+=sin(modelPosition.y*uFrequency.y-uTime)*0.1;

    // modelPosition.z+=elevation;

    // modelPosition.z+=aRandom*0.1;
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectPosition=projectionMatrix*viewPosition;

    vUv=uv;
    // vElevation=elevation;

    gl_Position=projectPosition;
}