const filterService = require('../services/filterService');

const getAll = (req, res) => res.json(filterService.findAll(req.query.name));
const getById = (req, res) => {
    const filter = filterService.findOne(parseInt(req.params.id));
    filter ? res.json(filter) : res.status(404).json({ error: 'Фильтр не найден' });
};
const create = (req, res) => res.status(201).json(filterService.create(req.body));
const update = (req, res) => {
    const updated = filterService.update(parseInt(req.params.id), req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Не найдено' });
};
const remove = (req, res) => {
    filterService.remove(parseInt(req.params.id)) ? res.status(204).send() : res.status(404).json({ error: 'Не найдено' });
};

module.exports = { getAll, getById, create, update, remove };