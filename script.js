/**
 * 3D Portfolio - Three.js Scene
 * Animated 3D model with particles and interactive effects
 */
// ===== Initialize Three.js Scene =====
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
// ===== Create Main 3D Object - Icosahedron with Wireframe =====
const geometry = new THREE.IcosahedronGeometry(2, 1);
const material = new THREE.MeshBasicMaterial({
    color: 0xff0040,
    wireframe: true,
    transparent: true,
    opacity: 0.8
});
const icosahedron = new THREE.Mesh(geometry, material);
scene.add(icosahedron);
// ===== Create Inner Glowing Sphere =====
const innerGeometry = new THREE.IcosahedronGeometry(1.5, 1);
const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0xff3366,
    wireframe: true,
    transparent: true,
    opacity: 0.4
});
const innerIcosahedron = new THREE.Mesh(innerGeometry, innerMaterial);
scene.add(innerIcosahedron);
// ===== Create Outer Ring =====
const ringGeometry = new THREE.TorusGeometry(3.5, 0.05, 16, 100);
const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0040,
    transparent: true,
    opacity: 0.6
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
scene.add(ring);
// ===== Create Second Ring =====
const ring2Geometry = new THREE.TorusGeometry(4, 0.03, 16, 100);
const ring2Material = new THREE.MeshBasicMaterial({
    color: 0xff4d00,
    transparent: true,
    opacity: 0.4
});
const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
ring2.rotation.x = Math.PI / 3;
ring2.rotation.y = Math.PI / 4;
scene.add(ring2);
// ===== Create Particle System =====
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xff0040,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
// ===== Create Floating Cubes =====
const cubes = [];
for (let i = 0; i < 15; i++) {
    const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0040,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = (Math.random() - 0.5) * 15;
    cube.position.y = (Math.random() - 0.5) * 15;
    cube.position.z = (Math.random() - 0.5) * 10 - 5;
    cube.userData = {
        rotationSpeed: Math.random() * 0.02 + 0.01,
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatOffset: Math.random() * Math.PI * 2
    };
    scene.add(cube);
    cubes.push(cube);
}
// ===== Camera Position =====
camera.position.z = 8;
// ===== Mouse Movement Tracking =====
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});
// ===== Animation Loop =====
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    // Smooth camera movement following mouse
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.3;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    // Rotate main icosahedron
    icosahedron.rotation.x += 0.003;
    icosahedron.rotation.y += 0.005;
    // Counter-rotate inner icosahedron
    innerIcosahedron.rotation.x -= 0.005;
    innerIcosahedron.rotation.y -= 0.003;
    // Rotate rings
    ring.rotation.z += 0.002;
    ring2.rotation.z -= 0.003;
    ring2.rotation.x += 0.001;
    // Animate particles
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    // Animate floating cubes
    cubes.forEach((cube, index) => {
        cube.rotation.x += cube.userData.rotationSpeed;
        cube.rotation.y += cube.userData.rotationSpeed * 0.7;
        cube.position.y += Math.sin(elapsedTime * cube.userData.floatSpeed + cube.userData.floatOffset) * 0.002;
    });
    // Pulse effect on main object
    const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
    icosahedron.scale.set(scale, scale, scale);
    renderer.render(scene, camera);
}
animate();
// ===== Window Resize Handler =====
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// ===== Create Floating Particles in DOM =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}
createParticles();
// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});
// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);
// Animate elements on scroll
document.querySelectorAll('.skill-item, .project-card, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});