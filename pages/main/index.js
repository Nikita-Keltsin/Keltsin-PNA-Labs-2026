import { filterData } from "../../modules/mockData.js";
import { FilterCardComponent } from "../../components/filter-card/index.js";
import { DetailPage } from "../detail/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.collection = [...filterData]; // Наша коллекция (Mock объекты)
    }

    render(searchQuery = "") {
        this.parent.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-6">
                    <input type="text" id="filter-search" class="form-control" placeholder="Поиск по названию..." value="${searchQuery}">
                </div>
                <div class="col-md-6 text-end">
                    <button id="add-card" class="my-btn execute" style="font-size: 1rem; width: auto;">Добавить</button>
                    <button id="remove-card" class="my-btn secondary">Удалить</button>
                </div>
            </div>
            <div id="card-list" class="row"></div>
        `;

        const listContainer = document.getElementById('card-list');
        
        // Фильтрация
        const filtered = this.collection.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.forEach(item => {
            const card = new FilterCardComponent(listContainer);
            card.render(item, () => new DetailPage(this.parent, item).render());
        });

        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById('filter-search').oninput = (e) => {
            this.render(e.target.value);
        };

        // ТРЕБОВАНИЕ: Кнопка добавления (копирует первую карточку)
        document.getElementById('add-card').onclick = () => {
            if (this.collection.length > 0) {
                const newCard = { ...this.collection[0], id: Date.now() };
                this.collection.push(newCard);
                this.render();
            }
        };

        // ТРЕБОВАНИЕ: Кнопка удаления (удаляет последнюю)
        document.getElementById('remove-card').onclick = () => {
            this.collection.pop();
            this.render();
        };
    }
}