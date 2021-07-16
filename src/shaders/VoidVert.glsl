uniform float timeMSec;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vViewPos;
varying vec3 vNormal;

varying float vReflectionFactor;
@import ./PerlinNoise;

#include <skinning_pars_vertex>
#include <fog_pars_vertex>

void main() {
  #include <beginnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>

  #include <begin_vertex>
  #include <skinning_vertex>

  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normalize(objectNormal) );
  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vWorldPos = worldPosition.xyz;
  vec3 I = worldPosition.xyz - cameraPosition;

  float mFresnelBias = 0.1;
  float mFresnelScale = 2.1;
  float mFresnelPower = 2.1;

  float t = 4.0*pow(cnoise(1.0*worldPosition.xyz + 0.75*timeMSec),2.0);
  worldNormal.x += t;
  worldNormal.z += t;

  worldNormal = normalize(worldNormal);
  vNormal = worldNormal;

  //worldPosition.xyz += 0.01*t * worldNormal;
  //mFresnelPower += t;

  vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );

  vec4 mvPosition = viewMatrix * worldPosition;
  vViewPos = mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;

  vUv = uv;

  #include <fog_vertex>
}