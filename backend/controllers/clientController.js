const Client = require('../models/Client');

exports.getClients = async (req, res, next) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        next(err);
    }
};

exports.getClientById = async (req, res, next) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (err) {
        next(err);
    }
};

exports.createClient = async (req, res, next) => {
    try {
        const client = new Client(req.body);
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        next(err);
    }
};

exports.updateClient = async (req, res, next) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClient) return res.status(404).json({ message: 'Client not found' });
        res.json(updatedClient);
    } catch (err) {
        next(err);
    }
};

exports.deleteClient = async (req, res, next) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) return res.status(404).json({ message: 'Client not found' });
        res.json({ message: 'Client deleted' });
    } catch (err) {
        next(err);
    }
};
