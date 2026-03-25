export class FilterCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="col-md-4 mb-4">
                <div class="circuit-card h-100 d-flex flex-column" id="filter-${data.id}">
                    <h4 class="circuit-card-title">${data.name}</h4>
                    <p class="text-muted flex-grow-1" style="font-family: 'Open Sans', sans-serif; font-size: 0.9rem;">
                        ${data.description}
                    </p>
                    <div class="formula-display" style="font-size: 0.85rem; padding: 10px;">
                        ${data.formula}
                    </div>
                    <button class="my-btn special mt-3 w-100" id="details-btn-${data.id}">
                        Анализ
                    </button>
                </div>
            </div>
        `;
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        
        const btn = document.getElementById(`details-btn-${data.id}`);
        btn.addEventListener('click', listener);
    }
}