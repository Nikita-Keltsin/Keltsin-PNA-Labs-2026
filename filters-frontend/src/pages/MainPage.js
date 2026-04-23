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
            <!-- ТУЛБАР: Домой слева, Поиск по центру, Добавить справа -->
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 50px; margin-bottom: 20px;">
                <button id="home-btn" class="my-btn secondary" style="padding: 0 20px; height: 45px; font-size: 1.1rem; width: auto;">Сброс</button>
                
                <!-- Узкий и длинный поиск -->
                <input type="text" id="search-input" class="result" style="width: 50vw; height: 45px; min-height: 45px; margin: 0; font-size: 1.2rem; text-align: left; padding: 0 15px;" placeholder="Поиск фильтра...">
                
                <button id="add-btn" class="my-btn execute" style="width: auto; padding: 0 20px; height: 45px; font-size: 1.1rem; margin: 0;">+ Добавить фильтр</button>
            </div>
            
            <div class="gallery-grid" id="cards-container">
                ${cardsHTML}
            </div>
        `;

        this.root.insertAdjacentHTML('beforeend', html);
        this.addListeners();
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => { 
            this.currentData = [...filtersData]; 
            this.render(); 
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.currentData = filtersData.filter(f => f.name.toLowerCase().includes(query));
            this.render();
            const input = document.getElementById('search-input');
            input.value = query; 
            input.focus();
        });

        document.getElementById('add-btn').addEventListener('click', () => {
            if (filtersData.length > 0) {
                const newCard = { ...filtersData[0], id: Date.now(), name: "Новый фильтр" };
                filtersData.push(newCard);
                this.currentData = [...filtersData];
                this.render();
            }
        });

        document.getElementById('cards-container').addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            
            if (e.target.classList.contains('btn-delete')) {
                const index = filtersData.findIndex(f => f.id === id);
                if(index > -1) filtersData.splice(index, 1);
                this.currentData = [...filtersData];
                this.render();
            }
            
            if (e.target.classList.contains('btn-edit')) {
                const filter = filtersData.find(f => f.id === id);
                const newName = prompt("Введите новое название фильтра:", filter.name);
                if (newName && newName.trim() !== "") {
                    filter.name = newName;
                    this.currentData = [...filtersData];
                    this.render();
                }
            }

            if (e.target.classList.contains('btn-detail')) {
                this.navigate('detail', id);
            }
        });
    }
}