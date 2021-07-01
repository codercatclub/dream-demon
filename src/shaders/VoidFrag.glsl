uniform vec3 colorA;
uniform vec3 colorB;
varying vec3 vUv;

varying float vReflectionFactor;
varying vec3 vWorldPos;
varying vec3 vNormal;
uniform float timeMSec;

uniform float dissolveT;

@import ./PerlinNoise;
@import ./Spectral;

#include <fog_pars_fragment>

void main() {
  //dissolve in action based on y distance from ground

  vec3 noisePos;
  noisePos.y += sin(1.4*timeMSec + 12.2*noisePos.x) + cos(timeMSec + 3.0*noisePos.z);
  float modv = vWorldPos.y + pow(cnoise(3.0*vWorldPos),0.3);

  if(modv > 4.0 * dissolveT) {
    discard;
  }
  float col = 1.0 - smoothstep(0.0,0.3,abs(modv-4.0*dissolveT));

  float r = 300. + 300. * vReflectionFactor + 200. *col;
  vec3 sp =  saturate(spectral_zucconi(r));
  gl_FragColor = vec4(sp, 1);

  #include <fog_fragment>
}