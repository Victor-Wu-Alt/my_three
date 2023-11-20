uniform vec3 uColor;
uniform sampler2D uTexture;


varying float vRadom;  //因为片段着色器拿不到属性
varying vec2 vUv;  //因为片段着色器拿不到属性
varying float vElevation;

void main(){
    
    // vec4 textureColor=texture2D(uTexture,vUv);
    // textureColor.rgb*=vElevation*2.0+0.5;

    // float strength=vUv.x;

    // float strength=vUv.y;

    // float strength=1.0-vUv.y;

    // float strength=1.0-vUv.y;

    // float strength=vUv.y*10.0;

    // float strength=mod(vUv.y*10.0,1.0);

    // float strength=mod(vUv.y*10.0,1.0);
    // strength=step(0.5,strength);

    // float strength=mod(vUv.y*10.0,1.0);
    // strength=step(0.9,strength);

    // float strength=mod(vUv.x*10.0,1.0);
    // strength=step(0.9,strength);

    // float strength=step(0.9,mod(vUv.x*10.0,1.0));
    // strength+=step(0.9,mod(vUv.y*10.0,1.0));
    
    // float strength=step(0.9,mod(vUv.x*10.0,1.0));
    // strength*=step(0.9,mod(vUv.y*10.0,1.0));

    // float strength=step(0.4,mod(vUv.x*10.0,1.0));
    // strength*=step(0.8,mod(vUv.y*10.0,1.0));

    float barX=step(0.4,mod(vUv.x*10.0,1.0));
    barX*=step(0.8,mod(vUv.y*10.0,1.0));

    float barY=step(0.8,mod(vUv.x*10.0+0.2,1.0));
    barY*=step(0.4,mod(vUv.y*10.0-0.2,1.0));

    float strength=barX+barY;
    
    gl_FragColor=vec4(vec3(strength),1.0);
}