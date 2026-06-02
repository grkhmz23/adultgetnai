export class GradientShaderLib {
  static vertexShader(): string {
    return `
varying vec2 vUv;
varying float vDistort;
uniform float uTime;
uniform float uDistortion;
uniform float uFrequency;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p, float time, float frequency, float distortion) {
    float value = 0.0;
    float amplitude = 0.5;
    float octaves = 4.0;
    for (float i = 0.0; i < octaves; i++) {
        value += amplitude * snoise(p * frequency + time);
        p += distortion;
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return value;
}

void main() {
    vUv = uv;
    float noise = fbm(position, uTime * 0.15, uFrequency, uDistortion);
    vec3 newPosition = position + normal * (noise * 0.4);
    vDistort = noise;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;
  }

  static fragmentShader(): string {
    return `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vDistort;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

float smoothStep(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

void main() {
    float distort = vDistort * 0.6;
    vec2 uv = vUv;
    vec2 mouseInfluence = (uMouse - uv) * 0.2;
    float mixValue = smoothStep(0.0, 1.0, length(mouseInfluence) + distort);
    float timeShift = sin(uTime * 0.08) * 0.05;
    mixValue += timeShift;
    mixValue = clamp(mixValue, 0.0, 1.0);
    vec3 color;
    if (mixValue < 0.25) {
        color = mix(color1, color2, smoothStep(0.0, 0.25, mixValue));
    } else if (mixValue < 0.5) {
        color = mix(color2, color3, smoothStep(0.25, 0.5, mixValue));
    } else if (mixValue < 0.75) {
        color = mix(color3, color4, smoothStep(0.5, 0.75, mixValue));
    } else {
        color = mix(color4, color5, smoothStep(0.75, 1.0, mixValue));
    }
    color += distort * 0.2;
    gl_FragColor = vec4(color, 0.85);
}
`;
  }
}
