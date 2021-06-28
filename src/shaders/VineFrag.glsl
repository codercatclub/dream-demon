varying vec3 vNormal;
varying float vDist;
uniform float timeMSec;

uniform float growthT;

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
  if(vDist > growthT) {
    //discard;
  }
  float dotl = dot(vNormal, vec3(-1.0,0.0,1.0));

  float shoot = fract(vDist/5.0 - 0.4*timeMSec);
  //vec3 lightCol = 0.1 + (1.0 + 0.5 * sin(timeMSec)) * (1.0 - saturate(0.1*vDist)) * spectral_zucconi(500.0 + 30.0*vDist);
  vec3 lightCol = vec3(0.0,0.0,0.0);
  gl_FragColor = shoot * dotl*vec4(lightCol, 1);
}