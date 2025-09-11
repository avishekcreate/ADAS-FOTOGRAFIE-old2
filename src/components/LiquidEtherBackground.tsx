import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LiquidEtherBackgroundProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  resolution?: number;
  autoSpeed?: number;
  autoIntensity?: number;
  className?: string;
}

export const LiquidEtherBackground: React.FC<LiquidEtherBackgroundProps> = ({
  colors = ["#5227FF", "#FF9FFC", "#B19EEF"],
  mouseForce = 20,
  cursorSize = 100,
  resolution = 0.5,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.Camera>();
  const materialRef = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Shader material for fluid effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        colors: { value: colors.map(color => new THREE.Color(color)) },
        mouseForce: { value: mouseForce },
        cursorSize: { value: cursorSize },
        autoSpeed: { value: autoSpeed },
        autoIntensity: { value: autoIntensity }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform vec3 colors[3];
        uniform float mouseForce;
        uniform float cursorSize;
        uniform float autoSpeed;
        uniform float autoIntensity;
        varying vec2 vUv;

        vec3 palette(float t) {
          vec3 a = vec3(0.5, 0.5, 0.5);
          vec3 b = vec3(0.5, 0.5, 0.5);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.263, 0.416, 0.557);
          return a + b * cos(6.28318 * (c * t + d));
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
          vec2 uv0 = uv;
          vec3 finalColor = vec3(0.0);

          for (float i = 0.0; i < 4.0; i++) {
            uv = fract(uv * 1.5) - 0.5;
            
            float d = length(uv) * exp(-length(uv0));
            vec3 col = palette(length(uv0) + i * 0.4 + time * autoSpeed * 0.4);
            
            d = sin(d * 8.0 + time * autoIntensity) / 8.0;
            d = abs(d);
            d = pow(0.01 / d, 1.2);
            
            finalColor += col * d;
          }

          // Mouse interaction
          vec2 mousePos = mouse * resolution;
          float mouseDistance = length(gl_FragCoord.xy - mousePos);
          float mouseEffect = 1.0 - smoothstep(0.0, cursorSize, mouseDistance);
          finalColor += colors[0] * mouseEffect * mouseForce * 0.01;

          gl_FragColor = vec4(finalColor, 0.3);
        }
      `,
      transparent: true
    });

    materialRef.current = material;

    // Create a plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = 1.0 - event.clientY / window.innerHeight;
      material.uniforms.mouse.value.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (material.uniforms) {
        material.uniforms.time.value += 0.016;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      material.uniforms.resolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [colors, mouseForce, cursorSize, resolution, autoSpeed, autoIntensity]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};