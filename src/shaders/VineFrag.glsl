varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDist;

uniform float timeMSec;
uniform float growthT;

@import ./Spectral;
varying float vReflectionFactor;
varying float c;
void main() {
  if(vDist > growthT) {
    discard;
  }
  float dotl = dot(vNormal, vec3(-1.0,0.0,1.0));

  float shoot = 0.1*fract(vDist/5.0 - 0.4*timeMSec);
  //vec3 lightCol = 0.1 + (1.0 + 0.5 * sin(timeMSec)) * (1.0 - saturate(0.1*vDist)) * spectral_zucconi(500.0 + 30.0*vDist);
  //vec3 lightCol = spectral_zucconi(500.0 + 30.0*vDist) + 0.1*vDist *vec3(0.1,0.0,1.0);


	vec3 lightPos = vec3(0.5,0.5,0.5);
	vec3 VertexToEye = normalize(cameraPosition - vWorldPos);
	vec3 LightReflect = normalize(reflect(lightPos, vNormal));
	float SpecularFactor = pow(dot(VertexToEye, LightReflect),12.0);

  gl_FragColor = (0.3 + min(0.7,SpecularFactor + vReflectionFactor))*vec4(0.7,0.7,1.0,1.0);
}