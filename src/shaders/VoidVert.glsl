uniform float timeMSec;

varying vec3 vUv;
varying vec3 vWorldPos;
varying float vReflectionFactor;
@import ./PerlinNoise;


void main() {
  vUv = position;

  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPosition.xyz;
  vec3 I = worldPosition.xyz - cameraPosition;

  float mFresnelBias = 0.1;
  float mFresnelScale = 2.1;
  float mFresnelPower = 2.1;

  float t = 4.0*pow(cnoise(1.0*worldPosition.xyz + 0.75*timeMSec),2.0);
  worldNormal.x += t;
  worldNormal.z += t;

  worldNormal = normalize(worldNormal);

  //worldPosition.xyz += 0.01*t * worldNormal;
  //mFresnelPower += t;

  vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );

  vec4 modelViewPosition = viewMatrix * worldPosition;
  gl_Position = projectionMatrix * modelViewPosition;
}