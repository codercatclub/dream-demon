uniform float timeMSec;

attribute float _curveu;

varying vec3 vNormal;

void main() {
  vNormal = normal;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  float curvep = pow(_curveu, 4.0);
  worldPos.x += curvep * 0.2 * cos(timeMSec + 10.0 * worldPos.y);
  worldPos.z += curvep * 0.2 * sin(timeMSec + 10.0 * worldPos.x);
  vec4 modelViewPosition = viewMatrix * worldPos;
  gl_Position = projectionMatrix * modelViewPosition;
}