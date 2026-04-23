import { filtersData } from '../mockData.js';
import { Header } from '../components/Header.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class DetailPage {
    constructor(root, navigateFunc, id) {
        this.root = root;
        this.navigate = navigateFunc;
        this.filter = filtersData.find(f => f.id === id);
    }

    // --- ФУНКЦИИ ИЗ ДОМАШКИ ---
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
    // --------------------------

    render() {
        this.root.innerHTML = '';
        const header = new Header().getHTML();

        if (!this.filter) return;

        const html = `
            ${header}
            <div style="padding: 0 40px; max-width: 1200px; margin: 0 auto;">
                <h1 style="color: #3b4b96;">${this.filter.name}</h1>
                <p style="font-size: 1.2rem; color: #555;">${this.filter.description}</p>
                <p><strong>Тип фильтра:</strong> ${this.filter.type}</p>
                
                <h2 style="margin-top: 30px;">3D Модель (Audio DSP)</h2>
                <div id="model-container"></div>
                
                <h2 style="margin-top: 30px;">Аналитика сигнала (Домашнее задание)</h2>
                <button id="run-analytics" class="btn-detail" style="font-size: 1.1rem; padding: 10px 20px;">Произвести расчеты</button>
                <div id="analytics-result" style="background: white; padding: 20px; border: 1px solid #ddd; margin-top: 15px; border-radius: 8px; white-space: pre-wrap;">
                    Нажмите кнопку для запуска симуляции...
                </div>
            </div>
        `;

        this.root.insertAdjacentHTML('beforeend', html);
        this.addListeners();
        this.initThreeJS();
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => this.navigate('main'));
        
        document.getElementById('run-analytics').addEventListener('click', () => {
            const resDiv = document.getElementById('analytics-result');
            
            const inputSignal = [23, 78, 90, 567, 231]; // Коллекция (Массив)
            const userConfig = { type: this.filter.type, cutoff: 1000 }; // Объект
            const defaultConfig = { cutoff: 500, gain: 1.5, status: "Active" };

            const dcOffset = this.calculateDCOffset(inputSignal);
            const finalConfig = this.mergeConfigurations(userConfig, defaultConfig);

            // Цикл с постусловием не по счетчику
            let stabilityLevel = 0;
            let isStable = false;
            let steps = 0;
            do {
                stabilityLevel += Math.random() * 30; 
                steps++;
                if (stabilityLevel >= 100) isStable = true;
            } while (!isStable);

            // Строка (Шаблонная строка)
            resDiv.innerHTML = `
<b>1. Постоянная составляющая сигнала:</b> ${dcOffset} (Функция №1.8)
<b>2. Итоговая конфигурация фильтра:</b> ${JSON.stringify(finalConfig)} (Функция №3.1)
<b>3. Процесс стабилизации (цикл do-while):</b> Фильтр стабилизировался за ${steps} шагов.
            `;
        });
    }

    initThreeJS() {
        const container = document.getElementById('model-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#f8f9fa');

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 5); // Камера смотрит прямо

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        const loader = new GLTFLoader();
        // РАБОЧАЯ МОДЕЛЬ "АУДИО МАГНИТОФОН / ФИЛЬТР"
        loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(100, 100, 100); // Увеличиваем масштаб магнитофона
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