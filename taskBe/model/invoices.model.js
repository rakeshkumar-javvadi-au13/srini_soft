const mongoose = require('mongoose');

const receviableSchema = new mongoose.Schema({
    rateName: { type: String, default: '' },
    invoiceDescription: { type: String, default: '' },
    rate: { type: Number, default: 0 },
    unit: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
});

const payableSchema = new mongoose.Schema({
    payableDescription: { type: String, default: '' },
    rate: { type: Number, default: 0 },
    unit: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    truck: { type: Number, default: 0 },
    PT_date: { type: Date, default: Date.now },
});

const schema = new mongoose.Schema({
    receviable: receviableSchema,
    payable: payableSchema,
    subInvoice: {
        type: [{
            receviable: receviableSchema,
            payable: payableSchema
        }],
        default: [],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Invoices', schema);
