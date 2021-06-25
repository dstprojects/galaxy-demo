import * as THREE from 'three'
import { extend } from '@react-three/fiber'


export default class GalaxyMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 30 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        
        attribute float aScale;
        attribute vec3 aRandomness;
        
        varying vec3 vColor;
        
        void main(){
            /*
            * Position
            */
        
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
            // Spin 
            float angle = atan(modelPosition.x, modelPosition.z);
            float distanceToCenter = length(modelPosition.xz);
            float angleOffset = (1.0 / (distanceToCenter) ) * uTime * 0.2;
            angle += angleOffset;
            modelPosition.x = cos(angle) * (distanceToCenter + 2.0);
            modelPosition.z = sin(angle) * (distanceToCenter + 2.0);
        
            // Randomness
            modelPosition.xyz += aRandomness ;
        
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
        
        
            /*
            * Size
            */
        
            gl_PointSize = uSize * aScale;
            gl_PointSize *= ( 1.0 / - viewPosition.z );
        
            /*
            *
            */
            vColor = color;
        }
      `,
      fragmentShader: `

        varying vec3 vColor;

        void main(){
                
            // Ligth point
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 10.0);
        
            // Final color
            vec3 color = mix( vec3(0.0), vColor, strength );
        
            gl_FragColor = vec4(color,1.0);
        
        }

      `,
    })
  }

  get time() {
    return this.uniforms.uTime.value
  }

  set time(v) {
    this.uniforms.uTime.value = v
  }
}

extend({ GalaxyMaterial })
