import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { calculateSignalMean, calculateSignalEnergy } from "../../modules/signalUtils.js";

export class DetailPage {
    constructor(parent, filterItem) {
        this.parent = parent;
        this.item = filterItem;
    }

    render() {
        this.parent.innerHTML = `
            <div class="circuit-card">
                <h2 class="title"><span class="dark-blue">${this.item.name}</span></h2>
                <div class="row">
                    <div class="col-md-6">
                        <div id="three-container" style="width: 100%; height: 300px; background: #eee; border-radius: 15px;"></div>
                    </div>
                    <div class="col-md-6">
                        <h4>Характеристики</h4>
                        <p>${this.item.description}</p>
                        <div class="formula-display">Анализ тестового импульса:</div>
                        <ul class="list-group list-group-flush" style="font-family: monospace;">
                            <li class="list-group-item">Среднее (Mean): ${calculateSignalMean(this.item.testSamples).toFixed(4)}</li>
                            <li class="list-group-item">Энергия (Energy): ${calculateSignalEnergy(this.item.testSamples).toFixed(2)}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        this.initThree();
    }

    initThree() {
        const container = document.getElementById('three-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f2f5);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5).normalize();
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        // Загрузка модели по теме (например, электронный чип или осциллограф)
        // Если файла .glb нет под рукой, создаем "заглушку" в виде куба
        const loader = new GLTFLoader();
        const geometry = new THREE.BoxGeometry(2, 0.5, 2);
        const material = new THREE.MeshPhongMaterial({ color: 0x276221 });
        const chip = new THREE.Mesh(geometry, material);
        scene.add(chip);

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            chip.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }
}