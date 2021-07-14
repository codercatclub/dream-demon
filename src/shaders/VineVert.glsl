uniform float timeMSec;

attribute float _dist;
attribute uint _idx;

varying vec3 vNormal;
varying float vDist;
varying vec3 vWorldPos;

@import ./PerlinNoise;


void main(){
  float t = float(_idx);
  float c  = t/500.0;

  vNormal = normal;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);

  float curvep = 14.0 * pow(0.01*_dist,2.0);
  vDist = _dist;
  worldPos.x += curvep * 0.2 * cos(c + timeMSec + 10.0 * worldPos.y);
  worldPos.z += curvep * 0.2 * sin(c + timeMSec + 10.0 * worldPos.x);

  float j = 0.2*curvep * (jagged(2.0*worldPos.x + timeMSec)-0.5);
  worldPos.x += 50.0*pow(j,3.0);

  vWorldPos = worldPos.xyz;
  vec4 modelViewPosition = viewMatrix * worldPos;
  gl_Position = projectionMatrix * modelViewPosition;
}