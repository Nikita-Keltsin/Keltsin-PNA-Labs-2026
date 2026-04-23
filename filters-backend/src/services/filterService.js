const fileService = require('./fileService');
let dataPath;

const init = (filePath) => { dataPath = filePath; };

const findAll = (nameQuery) => {
    let filters = fileService.readData(dataPath);
    if (nameQuery) filters = filters.filter(f => f.name.toLowerCase().includes(nameQuery.toLowerCase()));
    return filters;
};

const findOne = (id) => fileService.readData(dataPath).find(f => f.id === id);

const create = (data) => {
    const filters = fileService.readData(dataPath);
    const newId = filters.length > 0 ? Math.max(...filters.map(f => f.id)) + 1 : 1;
    const newFilter = { id: newId, ...data };
    filters.push(newFilter);
    fileService.writeData(dataPath, filters);
    return newFilter;
};

const update = (id, data) => {
    const filters = fileService.readData(dataPath);
    const index = filters.findIndex(f => f.id === id);
    if (index === -1) return null;
    filters[index] = { ...filters[index], ...data };
    fileService.writeData(dataPath, filters);
    return filters[index];
};

const remove = (id) => {
    const filters = fileService.readData(dataPath);
    const filtered = filters.filter(f => f.id !== id);
    if (filtered.length === filters.length) return false;
    fileService.writeData(dataPath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };