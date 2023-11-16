uniform vec3 uColor;
uniform sampler2D uTexture;


varying float vRadom;  //因为片段着色器拿不到属性
varying vec2 vUv;  //因为片段着色器拿不到属性
varying float vElevation;

void main(){
    vec4 textureColor=texture2D(uTexture,vUv);
    textureColor.rgb*=vElevation*2.0+0.5;
    gl_FragColor=textureColor;
}