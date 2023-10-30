const mongoose = require('mongoose');

const receivableSchema = new mongoose.Schema({
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
    receivable: receivableSchema,
    payable: payableSchema,
    subInvoice: {
        type: [{
            receivable: receivableSchema,
            payable: payableSchema
        }],
        default: [],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Invoices', schema);
