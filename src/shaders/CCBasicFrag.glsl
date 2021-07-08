#define STANDARD
#ifdef PHYSICAL
	#define REFLECTIVITY
	#define CLEARCOAT
	#define TRANSMISSION
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef TRANSMISSION
	uniform float transmission;
#endif
#ifdef REFLECTIVITY
	uniform float reflectivity;
#endif
#ifdef CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <transmissionmap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>


uniform float timeMSec;
uniform float mFresnelScale;
varying vec3 vWorldPos;

varying float vReflectionFactor;

@import ./PerlinNoise;
@import ./Spectral;

void main() {

	//add some global effect 
	float t = 8.0 - 8.0 * fract(0.1*timeMSec) - 3.0;
	//t = -3.0;
	vec3 nPos = vWorldPos;
	//nPos.z += 4.0*timeMSec;
	float jaggedn = pow(jagged(10.0*vWorldPos.x + vWorldPos.z + timeMSec),2.0);
	float cNoise = cnoise(nPos);
	float vNoise = 3.0*cNoise + sin(vWorldPos.x) + 0.05*jaggedn;


	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#ifdef TRANSMISSION
		float totalTransmission = transmission;
	#endif
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>

	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <transmissionmap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#ifdef TRANSMISSION
		diffuseColor.a *= mix( saturate( 1. - totalTransmission + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) ), 1.0, metalness );
	#endif

	outgoingLight += outgoingLight * vReflectionFactor * (1.0 - min(abs(vWorldPos.z + vNoise - t)/0.3, 1.0));
	float closenessToFresnelRim = (1.0 - min(abs(vReflectionFactor - mFresnelScale-0.6)/0.05, 1.0));
	outgoingLight += outgoingLight * closenessToFresnelRim;
	float dotl = dot(vNormal, vec3(0.0,1.0,1.0));
	
	vec3 lightPos = vec3(0.5,0.5,0.5);
	vec3 VertexToEye = normalize(cameraPosition - vWorldPos);
	vec3 LightReflect = normalize(reflect(lightPos, normal));
	float SpecularFactor = pow(abs(dot(VertexToEye, LightReflect)),23.0);

	float effectProg = dotl*smoothstep(t-0.3,t,vWorldPos.z + vNoise);
	outgoingLight *= (1.0 - effectProg);
	outgoingLight.b *= 1.0 + 0.9 * effectProg;
	outgoingLight.r *= 1.0 - 0.3 * effectProg;

	outgoingLight.rgb += vNoise * 0.02*SpecularFactor * effectProg * vec3(0.7,0.7,1.0);

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}