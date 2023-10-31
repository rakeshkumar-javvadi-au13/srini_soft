

// const expreess = require('express')
// const app = expreess()
// const mongoose = require('mongoose')
// const Invoices = require('./model/invoices.model')
// const cors = require("cors");
// app.use(expreess.json());
// app.use(expreess.urlencoded({ extended: true }));
// app.use(cors());

// mongoose.connect('mongodb+srv://javvadirakesh:rakesh123@cluster0.4nphiri.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => { console.log('MongoDB connected') })
//     .catch((err) => { console.log(err) })


// app.get('/', (req, res) => {
//     res.send('----------------------APIs working--------------------')
// })

// // Create a new invoice
// app.post('/invoices', async (req, res) => {
//     try {
//         if (!req.body.receivable || !req.body.payable) {
//             return res.status(400).send('Body cannot be empty');
//         }
//         const invoice = new Invoices(req.body);
//         const savedInvoice = await invoice.save();
//         res.status(200).send(savedInvoice);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// app.post('/invoices/:id/subinvoice', async (req, res) => {
//     try {
//         if (!req.params.id || !req.body.subInvoice) {
//             return res.status(400).send('Body cannot be empty');
//         }
//         const invoice = await Invoices.findById(req.params.id);
//         for (let i = 0; i < req.body.subInvoice.length; i++) {
//             invoice.subInvoice.push(req.body.subInvoice[i]);
//         }
//         const savedInvoice = await invoice.save();
//         res.status(200).send(savedInvoice);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// app.put('/invoices/subinvoice/:id', async (req, res) => {
//     try {
//         if (!req.params.id || !req.body) {
//             return res.status(400).send('Id cannot be empty');
//         }
//         const invoice = await Invoices.findOneAndUpdate(
//             { 'subInvoice._id': req.params.id },
//             { $set: { 'subInvoice.$': req.body } },
//             { new: true }
//         );
//         res.status(200).send(invoice);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// app.delete('/invoices/:id/subinvoice/:subinvoiceId', async (req, res) => {
//     try {
//         console.log("id:",req.params.id,"subid",req.params.subinvoiceId,"body",req.body)
//         if (!req.params.subinvoiceId || !req.params.id) {
//             return res.status(400).send('Id cannot be empty');
//         }
//         const invoice = await Invoices.findById(req.params.id)
//         if (req.body) {

//             if (req.body.text === 'payable') {
//                 const invoice = await Invoices.findOneAndUpdate(
//                     { 'subInvoice._id': req.params.subinvoiceId },
//                     { $unset: { 'subInvoice.$.payable': 1 } },
//                     { new: true }
//                 );
//                 res.status(200).send(invoice);
//             } else if (req.body.text === 'receivable') {
//                 const invoice = await Invoices.findOneAndUpdate(
//                     { 'subInvoice._id': req.params.subinvoiceId },
//                     { $unset: { 'subInvoice.$.receivable': 1 } },
//                     { new: true }
//                 );
//                 res.status(200).send(invoice);
//             }
//         } else {
//             invoice.subInvoice = invoice.subInvoice.filter(
//                 (subInvoice) => subInvoice._id.toString() !== req.params.subinvoiceId
//             )
//             const savedInvoice = await invoice.save();
//             res.status(200).send(savedInvoice);
//         }
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// app.get('/invoices', async (req, res) => {
//     try {
//         const invoices = await Invoices.find();
//         res.status(200).send(invoices);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

// app.get('/invoices/:id', async (req, res) => {
//     try {
//         if (!req.params.id) {
//             return res.status(400).send('Id required');
//         }
//         const invoice = await Invoices.findById(req.params.id);
//         res.status(200).send(invoice);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

// app.put('/invoices/:id', async (req, res) => {
//     try {
//         if (!req.params.id && !req.body) {
//             return res.status(400).send("Id and body cannot be empty");
//         }
//         const invoice = await Invoices.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.status(200).send(invoice);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

// app.delete('/invoices/:id', async (req, res) => {
//     try {
//         if (!req.params.id) {
//             return res.status(400).send("Deleted id required");
//         }
//         const invoice = await Invoices.findByIdAndDelete(req.params.id);
//         res.status(200).send(invoice);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

// app.delete('/invoices/payable/:id', async (req, res) => {
//     try {
//         if (!req.params.id) {
//             return res.status(400).send("Deleted id required");
//         }
//         const invoice = await Invoices.findByIdAndUpdate(req.params.id, { $unset: { payable: 1 } }, { new: true });
//         res.status(200).send(invoice);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })
// app.delete('/invoices/receivable/:id', async (req, res) => {
//     try {
//         if (!req.params.id) {
//             return res.status(400).send("Deleted id required");
//         }
//         const invoice = await Invoices.findByIdAndUpdate(req.params.id, { $unset: { receivable: 1 } }, { new: true });
//         res.status(200).send(invoice);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

// app.listen(3000, () => {
//     console.log(`http://localhost:3000`)
// })


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const invoicesRoutes = require('./routes/invoicesroutes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://javvadirakesh:rakesh123@cluster0.4nphiri.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log(err);
});

app.get('/', (req, res) => {
  res.send('APIs working');
});

app.use('/invoices', invoicesRoutes);

app.listen(3000, () => {
  console.log('http://localhost:3000');
});

