uniform vec3 colorA;
uniform vec3 colorB;
varying vec3 vUv;

varying float vReflectionFactor;
varying vec3 vViewPos;
varying vec3 vWorldPos;
varying vec3 vNormal;
uniform float timeMSec;

uniform float dissolveT;

@import ./PerlinNoise;
@import ./Spectral;

#include <common>
struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
#include <fog_pars_fragment>

float punctualLightIntensityToIrradianceFactor( float lightDistance, float cutoffDistance, float decayExponent ) {
#if defined ( PHYSICALLY_CORRECT_LIGHTS )
	// based upon Frostbite 3 Moving to Physically-based Rendering
	// page 32, equation 26: E[window1]
	// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
	// this is intended to be used on spot and point lights who are represented as luminous intensity
	// but who must be converted to luminous irradiance for surface lighting calculation
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
#else
	if( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
		return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
	}
	return 1.0;
#endif
}

void main() {
  //dissolve in action based on y distance from ground

  vec3 noisePos;
  noisePos.y += sin(1.4*timeMSec + 12.2*noisePos.x) + cos(timeMSec + 3.0*noisePos.z);
  float modv = vWorldPos.y + pow(abs(cnoise(3.0*vWorldPos)),0.3);

  if(modv > 4.0 * dissolveT) {
    discard;
  }

  vec3 lightColor = vec3(0.0,0.0,0.0);
  #if ( NUM_POINT_LIGHTS > 0 )
	PointLight pointLight;
  float lightDistance = 0.0;
  float dotNL;
  vec3 lightDir;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
    pointLight = pointLights[i];
    lightDir  = pointLight.position - vViewPos;
    lightDistance = length( lightDir );
    dotNL = saturate( dot( vNormal, normalize(lightDir) ) );
		lightColor += dotNL * pointLight.color * punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
	}
	#pragma unroll_loop_end
  #endif

  
  float col = 1.0 - smoothstep(0.0,0.3,abs(modv-4.0*dissolveT));

  float r = 300. + 300. * vReflectionFactor + 200. *col;
  vec3 sp =  saturate(spectral_zucconi(r));
  gl_FragColor = vec4(2.0*sp * lightColor, 1);

  #include <fog_fragment>
}