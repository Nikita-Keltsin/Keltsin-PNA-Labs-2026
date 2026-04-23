import { filtersData } from '../mockData.js';
import { Header } from '../components/Header.js';
import { FilterCard } from '../components/FilterCard.js';

export class MainPage {
    constructor(root, navigateFunc) {
        this.root = root;
        this.navigate = navigateFunc;
        this.currentData = [...filtersData];
    }

    render() {
        this.root.innerHTML = '';
        const header = new Header().getHTML();
        const cardsHTML = this.currentData.map(f => new FilterCard().getHTML(f)).join('');

        const html = `
            ${header}
            <div class="toolbar">
                <h2>Виды фильтров</h2>
                <input type="text" id="search-input" class="search-bar" placeholder="🔍 Поиск фильтра...">
                <button id="add-btn" class="btn-add">+ Добавить фильтр</button>
            </div>
            <div class="cards-grid" id="cards-container">
                ${cardsHTML}
            </div>
        `;
        this.root.insertAdjacentHTML('beforeend', html);
        this.addListeners();
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => { this.currentData = [...filtersData]; this.render(); });
        
        // Поиск (Фильтрация)
        document.getElementById('search-input').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.currentData = filtersData.filter(f => f.name.toLowerCase().includes(query));
            this.render();
            const input = document.getElementById('search-input');
            input.value = query; input.focus();
        });

        // Добавление
        document.getElementById('add-btn').addEventListener('click', () => {
            if (filtersData.length > 0) {
                const newCard = { ...filtersData[0], id: Date.now(), name: filtersData[0].name + " (Копия)" };
                filtersData.push(newCard);
                this.currentData = [...filtersData];
                this.render();
            }
        });

        // Делегирование (Удаление и Подробнее)
        document.getElementById('cards-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const id = parseInt(e.target.dataset.id);
                const index = filtersData.findIndex(f => f.id === id);
                if(index > -1) filtersData.splice(index, 1);
                this.currentData = [...filtersData];
                this.render();
            }
            if (e.target.classList.contains('btn-detail')) {
                this.navigate('detail', parseInt(e.target.dataset.id));
            }
        });
    }
}