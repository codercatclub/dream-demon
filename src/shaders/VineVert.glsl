uniform float timeMSec;

attribute float _dist;

varying vec3 vNormal;
varying float vDist;
float jagged(float xx){         
    float x0=floor(xx);
    float x1=x0+1.;
    float v0 = fract(sin (x0*.014686)*31718.927+x0);
    float v1 = fract(sin (x1*.014686)*31718.927+x1);          

    return (v0*(1.-fract(xx))+v1*(fract(xx)))*2.-1.*sin(xx);
}
void main(){

  vNormal = normal;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);

  float curvep = 14.0 * pow(0.01*_dist,2.0);
  vDist = _dist;
  worldPos.x += curvep * 0.2 * cos(timeMSec + 10.0 * worldPos.y);
  worldPos.z += curvep * 0.2 * sin(timeMSec + 10.0 * worldPos.x);

  float j = 0.2*curvep * (jagged(2.0*worldPos.x + timeMSec)-0.5);
  worldPos.x += 50.0*pow(j,3.0);
  //worldPos.z += j;

  vec4 modelViewPosition = viewMatrix * worldPos;
  gl_Position = projectionMatrix * modelViewPosition;
}