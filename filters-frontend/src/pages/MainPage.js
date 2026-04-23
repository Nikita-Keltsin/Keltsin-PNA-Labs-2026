// файл: src/pages/MainPage.js
import { filtersData } from '../mockData.js';
import { FilterCard } from '../components/FilterCard.js';

export class MainPage {
    constructor(root, navigateFunc) {
        this.root = root;
        this.navigate = navigateFunc;
        this.currentData = [...filtersData];
    }

    render() {
        this.root.innerHTML = '';
        const cardsHTML = this.currentData.map(f => new FilterCard().getHTML(f)).join('');

        const html = `
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center;">
                <button id="home-btn" class="my-btn secondary" style="padding: 0 20px; height: 50px; font-size: 1.2rem;">Сброс (Домой)</button>
                <input type="text" id="search-input" class="result" style="width: 400px; height: 50px; margin: 0; font-size: 1.2rem; text-align: left;" placeholder="Поиск фильтра...">
                <button id="add-btn" class="my-btn execute" style="width: 250px; height: 50px; font-size: 1.2rem; margin: 0;">+ Добавить фильтр</button>
            </div>
            
            <div class="gallery-grid" id="cards-container">
                ${cardsHTML}
            </div>
        `;

        this.root.insertAdjacentHTML('beforeend', html);
        this.addListeners();
    }

    addListeners() {
        // Домой (Сброс)
        document.getElementById('home-btn').addEventListener('click', () => { 
            this.currentData = [...filtersData]; 
            this.render(); 
        });

        // Поиск
        document.getElementById('search-input').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.currentData = filtersData.filter(f => f.name.toLowerCase().includes(query));
            this.render();
            const input = document.getElementById('search-input');
            input.value = query; 
            input.focus();
        });

        // Добавление
        document.getElementById('add-btn').addEventListener('click', () => {
            if (filtersData.length > 0) {
                const newCard = { ...filtersData[0], id: Date.now(), name: "Новый фильтр" };
                filtersData.push(newCard);
                this.currentData = [...filtersData];
                this.render();
            }
        });

        // События на карточках (Делегирование)
        document.getElementById('cards-container').addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            
            // Удаление
            if (e.target.classList.contains('btn-delete')) {
                const index = filtersData.findIndex(f => f.id === id);
                if(index > -1) filtersData.splice(index, 1);
                this.currentData = [...filtersData];
                this.render();
            }
            
            // РЕДАКТИРОВАНИЕ НАЗВАНИЯ
            if (e.target.classList.contains('btn-edit')) {
                const filter = filtersData.find(f => f.id === id);
                const newName = prompt("Введите новое название фильтра:", filter.name);
                if (newName && newName.trim() !== "") {
                    filter.name = newName;
                    this.currentData = [...filtersData];
                    this.render();
                }
            }

            // Подробнее
            if (e.target.classList.contains('btn-detail')) {
                this.navigate('detail', id);
            }
        });
    }
}