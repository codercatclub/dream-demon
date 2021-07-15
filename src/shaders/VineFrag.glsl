varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDist;

uniform float timeMSec;
uniform float growthT;

@import ./Spectral;

void main() {
  if(vDist > growthT) {
    discard;
  }
  float dotl = dot(vNormal, vec3(-1.0,0.0,1.0));

  float shoot = fract(vDist/5.0 - 0.4*timeMSec);
  //vec3 lightCol = 0.1 + (1.0 + 0.5 * sin(timeMSec)) * (1.0 - saturate(0.1*vDist)) * spectral_zucconi(500.0 + 30.0*vDist);
  //vec3 lightCol = spectral_zucconi(500.0 + 30.0*vDist) + 0.1*vDist *vec3(0.1,0.0,1.0);


	vec3 lightPos = vec3(0.5,0.5,0.5);
	vec3 VertexToEye = normalize(cameraPosition - vWorldPos);
	vec3 LightReflect = normalize(reflect(lightPos, vNormal));
	float SpecularFactor = 0.5 + pow(dot(VertexToEye, LightReflect),8.0);


  gl_FragColor = 0.8*vec4(0.7, 0.7, 1.0, 1) + SpecularFactor*vec4(shoot,1.0,1.0,1.0);
}