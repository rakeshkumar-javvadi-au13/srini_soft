const Invoices = require('../model/invoices.model');

exports.createInvoice = async (req, res) => {
  try {
    if (!req.body.receivable || !req.body.payable) {
      return res.status(400).send('Body cannot be empty');
    }
    const invoice = new Invoices(req.body);
    const savedInvoice = await invoice.save();
    res.status(200).send(savedInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addSubInvoice = async (req, res) => {
  try {
    if (!req.params.id || !req.body.subInvoice) {
      return res.status(400).send('ID and subInvoice data required');
    }
    const invoice = await Invoices.findById(req.params.id);
    for (let i = 0; i < req.body.subInvoice.length; i++) {
      invoice.subInvoice.push(req.body.subInvoice[i]);
    }
    const savedInvoice = await invoice.save();
    res.status(200).send(savedInvoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateSubInvoice = async (req, res) => {
  try {
    if (!req.params.id || !req.body) {
      return res.status(400).send('ID and data required');
    }
    const invoice = await Invoices.findOneAndUpdate(
      { 'subInvoice._id': req.params.id },
      { $set: { 'subInvoice.$': req.body } },
      { new: true }
    );
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteSubInvoice = async (req, res) => {
  try {
    if (!req.params.subinvoiceId || !req.params.id) {
      return res.status(400).send('ID and subinvoiceId required');
    }
    const invoice = await Invoices.findById(req.params.id);

    if (req.body) {
      if (req.body.text === 'payable') {
        const invoice = await Invoices.findOneAndUpdate(
          { 'subInvoice._id': req.params.subinvoiceId },
          { $unset: { 'subInvoice.$.payable': 1 } },
          { new: true }
        );
        res.status(200).send(invoice);
      } else if (req.body.text === 'receivable') {
        const invoice = await Invoices.findOneAndUpdate(
          { 'subInvoice._id': req.params.subinvoiceId },
          { $unset: { 'subInvoice.$.receivable': 1 } },
          { new: true }
        );
        res.status(200).send(invoice);
      }
    } else {
      invoice.subInvoice = invoice.subInvoice.filter(
        (subInvoice) => subInvoice._id.toString() !== req.params.subinvoiceId
      );
      const savedInvoice = await invoice.save();
      res.status(200).send(savedInvoice);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoices.find();
    res.status(200).send(invoices);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send('ID required');
    }
    const invoice = await Invoices.findById(req.params.id);
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    if (!req.params.id && !req.body) {
      return res.status(400).send('ID and body cannot be empty');
    }
    const invoice = await Invoices.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send('Deleted ID required');
    }
    const invoice = await Invoices.findByIdAndDelete(req.params.id);
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deletePayableFromInvoice = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send('Deleted ID required');
    }
    const invoice = await Invoices.findByIdAndUpdate(req.params.id, { $unset: { payable: 1 } }, { new: true });
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteReceivableFromInvoice = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send('Deleted ID required');
    }
    const invoice = await Invoices.findByIdAndUpdate(req.params.id, { $unset: { receivable: 1 } }, { new: true });
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
};
