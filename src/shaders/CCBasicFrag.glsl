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
uniform float darknessProg;
uniform vec2 resolution;
varying vec3 vWorldPos;

varying float vReflectionFactor;

@import ./PerlinNoise;
@import ./Spectral;

void main() {

	//add some global effect 
	float startPos = 9.8;
	float t = startPos - (startPos + 3.0) * darknessProg;
	vec3 nPos = vWorldPos;

	float jaggedn = pow(jagged(10.0*vWorldPos.x + vWorldPos.z + darknessProg),2.0);
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
	float closenessToT = 1.0 - min(abs(vWorldPos.z + vNoise - t)/0.3, 1.0);
	outgoingLight += 4.0 * outgoingLight * closenessToT;
	float dotl = dot(vNormal, vec3(0.0,1.0,1.0));
	
	vec3 lightPos = vec3(0.5,0.5,0.5);
	vec3 VertexToEye = normalize(cameraPosition - vWorldPos);
	vec3 modNormal = normal;
	modNormal.x = vNoise + sin(0.5*timeMSec);
	modNormal.y = 0.2 * modNormal.y + vNoise - sin(vWorldPos.x + 0.75*timeMSec);
	modNormal.z = vNoise - cos(vWorldPos.z + 0.65*timeMSec);
	vec3 LightReflect = normalize(reflect(lightPos, normalize(modNormal)));
	float SpecularFactor = pow(abs(dot(VertexToEye, LightReflect)),25.0);

	float showLightCol = mix(1.0, dotl, closenessToT);
	float effectProg = showLightCol*smoothstep(t-0.3,t,vWorldPos.z + vNoise);
	outgoingLight *= (1.0 - effectProg);

	outgoingLight.rgb += vNoise * 0.2*SpecularFactor * effectProg * smoothstep(0.7, 1.0, darknessProg) * vec3(0.7,0.7,1.0);

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

	vec2 screenPos = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution;
	float vignetteAmount = min(1.0,2.0*pow(1.0 - length(0.5*screenPos),3.0));
	
	gl_FragColor.rgb *= vignetteAmount;
}