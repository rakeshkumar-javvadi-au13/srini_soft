const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoices.controller');

// Create a new invoice
router.post('/', invoicesController.createInvoice);

// Add sub-invoice to an existing invoice
router.post('/:id/subinvoice', invoicesController.addSubInvoice);

// Update a sub-invoice
router.put('/subinvoice/:id', invoicesController.updateSubInvoice);

// Delete a sub-invoice
router.delete('/:id/subinvoice/:subinvoiceId', invoicesController.deleteSubInvoice);

// Retrieve all invoices
router.get('/', invoicesController.getAllInvoices);

// Retrieve a specific invoice by ID
router.get('/:id', invoicesController.getInvoiceById);

// Update an invoice by ID
router.put('/:id', invoicesController.updateInvoice);

// Delete an invoice by ID
router.delete('/:id', invoicesController.deleteInvoice);

// Delete payable from an invoice by ID
router.delete('/payable/:id', invoicesController.deletePayableFromInvoice);

// Delete receivable from an invoice by ID
router.delete('/receivable/:id', invoicesController.deleteReceivableFromInvoice);

module.exports = router;
