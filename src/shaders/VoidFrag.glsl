uniform vec3 colorA;
uniform vec3 colorB;
varying vec3 vUv;

varying float vReflectionFactor;
varying vec3 vWorldPos;
uniform float timeMSec;
@import ./PerlinNoise;

vec3 bump3y (vec3 x, vec3 yoffset)
{
	vec3 y = vec3(1.,1.,1.) - x * x;
	y = saturate(y-yoffset);
	return y;
}
vec3 spectral_zucconi (float w)
{
    // w: [400, 700]
	// x: [0,   1]
	float x = saturate((w - 400.0)/ 300.0);

	const vec3 cs = vec3(3.54541723, 2.86670055, 2.29421995);
	const vec3 xs = vec3(0.69548916, 0.49416934, 0.28269708);
	const vec3 ys = vec3(0.02320775, 0.15936245, 0.53520021);

	return bump3y (	cs * (x - xs), ys);
}

void main() {
  //dissolve in action based on y distance from ground

  float t = fract(0.1*timeMSec);
  vec3 noisePos;
  noisePos.y += sin(1.4*timeMSec + 12.2*noisePos.x) + cos(timeMSec + 3.0*noisePos.z);
  float modv = vWorldPos.y + pow(cnoise(3.0*vWorldPos),0.3);

  if(modv > 4.0 * t) {
    discard;
  }

  float col = 1.0 - smoothstep(0.0,0.3,abs(modv-4.0*t));


  float r = 300. + 300. * vReflectionFactor + 200. *col;
  vec3 sp = spectral_zucconi(r);
  gl_FragColor = vec4(sp, 1);
}