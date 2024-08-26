const Message = require('../models/messageModels');

// Create
exports.createMessage = async (req, res) => {
    try {
        const { email, objet, message } = req.body;
        const newMessage = new Message({ email, objet, message });
        await newMessage.save();
        res.status(201).json({ success: true, data: newMessage });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get ALL
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get 
exports.getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }
        res.status(200).json({ success: true, data: message });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update
exports.updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, objet, message } = req.body;
        const updatedMessage = await Message.findByIdAndUpdate(id, { email, objet, message }, { new: true, runValidators: true });
        if (!updatedMessage) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }
        res.status(200).json({ success: true, data: updatedMessage });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Supprimer 
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = await Message.findByIdAndDelete(id);
        if (!deletedMessage) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
