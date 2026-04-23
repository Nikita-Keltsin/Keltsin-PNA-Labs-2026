export class FilterCard {
    getHTML(filter) {
        
        const shortDesc = filter.description.length > 50 ? filter.description.substring(0, 50) + "..." : filter.description;
        return `
            <div class="filter-card">
                <img src="${filter.imageUrl}" alt="${filter.name}">
                <div class="card-body">
                    <h3 class="card-title">${filter.name}</h3>
                    <p class="card-desc">${shortDesc}</p>
                    <div class="card-actions">
                        <button class="btn-detail" data-id="${filter.id}">Подробнее</button>
                        <button class="btn-delete" data-id="${filter.id}">Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }
}