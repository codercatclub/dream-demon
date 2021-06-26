varying vec3 vNormal;
varying float vDist;
uniform float timeMSec;

uniform float growthT;

void main() {
  if(vDist > growthT) {
    //discard;
  }
  float dotl = dot(vNormal, vec3(-1.0,0.0,1.0));

  float shoot = fract(vDist/5.0 - 0.4*timeMSec);
  vec3 lightCol = 0.1 + (1.0 + 0.5 * sin(timeMSec)) * (1.0 - saturate(0.1*vDist)) * vec3(0.4, 0.5, 0.9);
  gl_FragColor = shoot * dotl*vec4(lightCol, 1);
}