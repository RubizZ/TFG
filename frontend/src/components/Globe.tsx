import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import airports from "../data/airports.json";
import styles from "./Globe.module.css"

export default function Globe() {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(
            45,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 5);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        );
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Light
        scene.add(new THREE.AmbientLight(0xffffff, 1));

        // Earth
        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 64),
            new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load(
                    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
                )
            })
        );
        scene.add(earth);

        // Airports
        const airportGroup = new THREE.Group();
        scene.add(airportGroup);

        airports.forEach((a: any) => {
            if (!isFinite(a.latitude_deg) || !isFinite(a.longitude_deg)) return;

            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.0025, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0xff6600 })
            );

            const phi = (90 - a.latitude_deg) * (Math.PI / 180);
            const theta = (a.longitude_deg + 180) * (Math.PI / 180);

            mesh.position.set(
                -Math.sin(phi) * Math.cos(theta),
                Math.cos(phi),
                Math.sin(phi) * Math.sin(theta)
            );

            mesh.userData = a;
            airportGroup.add(mesh);
        });

        // Raycaster
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onClick = (e: MouseEvent) => {
            if (!popupRef.current) return;

            mouse.x =
                (e.offsetX / mountRef.current!.clientWidth) * 2 - 1;
            mouse.y =
                -(e.offsetY / mountRef.current!.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(airportGroup.children);

            if (intersects.length > 0) {
                const a = intersects[0].object.userData;
                popupRef.current.style.left = e.offsetX + "px";
                popupRef.current.style.top = e.offsetY + "px";
                popupRef.current.innerHTML = `<b>${a.name} (${a.iata_code})</b>`;
                popupRef.current.style.display = "block";
            } else {
                popupRef.current.style.display = "none";
            }
        };

        renderer.domElement.addEventListener("click", onClick);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.domElement.removeEventListener("click", onClick);
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

  return (
    <div className={styles.globe}>
      <div ref={mountRef} style={{ width: "600px", height: "400px" }} />
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          background: "white",
          padding: "6px",
          borderRadius: "6px",
          border: "1px solid #555",
          display: "none",
          pointerEvents: "none"
        }}
      />
    </div>
  );
}
