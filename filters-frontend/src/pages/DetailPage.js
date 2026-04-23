// файл: src/pages/DetailPage.js
import { filtersData } from '../mockData.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class DetailPage {
    constructor(root, navigateFunc, id) {
        this.root = root;
        this.navigate = navigateFunc;
        this.filter = filtersData.find(f => f.id === id);
    }

    calculateDCOffset(signalArray) {
        if (signalArray.length === 0) return "Сигнал отсутствует!";
        let sum = 0;
        for (let i = 0; i < signalArray.length; i++) sum += signalArray[i];
        return (sum / signalArray.length).toFixed(2);
    }

    mergeConfigurations(...objects) {
        const result = {};
        for (const obj of objects) {
            for (const key in obj) {
                if (Object.hasOwn(obj, key) && !(key in result)) result[key] = obj[key];
            }
        }
        return result;
    }

    render() {
        this.root.innerHTML = '';

        if (!this.filter) return;

        const html = `
            <button id="home-btn" class="my-btn secondary" style="padding: 0 20px; height: 50px; font-size: 1.2rem; margin-bottom: 20px;">&larr; Вернуться назад</button>
            
            <div class="filter-card" style="max-width: 900px; padding: 40px;">
                <div class="result" style="white-space: normal; height: auto; font-size: 2rem; padding: 20px;">${this.filter.name}</div>
                
                <!-- ЖЕСТКО ЗАДАЕМ ВЫСОТУ ДЛЯ 3D МОДЕЛИ -->
                <h3 style="color:#1b5c87; margin-top: 20px;">3D Модель (Audio DSP):</h3>
                <div id="model-container" style="width: 100%; height: 450px; background: #e0e0e8; border-radius: 12px; border: 2px solid #2c3e50; margin-bottom: 20px; overflow: hidden;"></div>
                
                <p style="text-align:justify; font-size:1.3rem; line-height: 1.6;">${this.filter.description}</p>
                
                <hr style="width:100%; border: 1px solid #ccc; margin: 30px 0;">
                
                <h3 style="color:#276221">Аналитика сигнала (ДЗ)</h3>
                <button id="run-analytics-btn" class="my-btn execute" style="width: 300px; height: 60px; font-size: 1.3rem;">Запустить расчеты</button>
                
                <div id="analytics-result" class="result" style="font-size: 1.2rem; height: auto; padding: 20px; margin-top: 20px; text-align: left; white-space: pre-wrap;">Ожидание...</div>
            </div>
        `;

        this.root.insertAdjacentHTML('beforeend', html);
        this.addListeners();
        
        // Маленькая задержка перед рендером 3D, чтобы DOM точно обновился
        setTimeout(() => this.initThreeJS(), 100);
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => this.navigate('main'));
        
        document.getElementById('run-analytics-btn').addEventListener('click', () => {
            const resDiv = document.getElementById('analytics-result');
            resDiv.innerHTML = "Считаем...\n";

            const inputSignal = [23, 78, 90, 567, 231];
            const userConfig = { type: this.filter.type, cutoff: 1000 };
            const defaultConfig = { cutoff: 500, gain: 1.5, status: "Active" };

            const dcOffset = this.calculateDCOffset(inputSignal);
            const finalConfig = this.mergeConfigurations(userConfig, defaultConfig);

            let stabilityLevel = 0;
            let steps = 0;
            do {
                stabilityLevel += Math.random() * 30; 
                steps++;
            } while (stabilityLevel < 100);

            resDiv.innerHTML = `
<b>1. Постоянная составляющая сигнала:</b> ${dcOffset} (Функция №1.8)
<b>2. Итоговая конфигурация фильтра:</b> ${JSON.stringify(finalConfig)} (Функция №3.1)
<b>3. Стабилизация фильтра (do-while):</b> Достигнута за ${steps} шагов.
            `;
        });
    }

    initThreeJS() {
        const container = document.getElementById('model-container');
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#e0e0e8'); 

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 5); 

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        const loader = new GLTFLoader();
        // РАБОЧАЯ 3D МОДЕЛЬ АУДИО УСТРОЙСТВА
        loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(80, 80, 80); 
            model.position.set(0, 0, 0);
            scene.add(model);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
    }
}