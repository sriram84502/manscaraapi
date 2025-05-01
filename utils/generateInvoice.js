const PDFDocument = require('pdfkit');

const generateInvoice = (order, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.fontSize(20).text('Manscara - Order Invoice', { align: 'center' }).moveDown();

    doc
      .fontSize(12)
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .text(`Customer: ${user.firstName} ${user.lastName}`)
      .text(`Email: ${user.email}`)
      .moveDown();

    const address = order.shippingAddress;
    doc
      .text('Shipping Address:')
      .text(`${address.firstName} ${address.lastName}`)
      .text(`${address.address}, ${address.city}`)
      .text(`${address.region} - ${address.postalCode}`)
      .text(`${address.country}`)
      .text(`Phone: ${address.phone}`)
      .moveDown();

    doc.fontSize(14).text('Items:', { underline: true }).moveDown(0.5);

    order.items.forEach(item => {
      doc
        .fontSize(12)
        .text(`${item.quantity} x ${item.name} @ ₹${item.price} = ₹${(item.price * item.quantity).toFixed(2)}`);
    });

    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Subtotal: ₹${order.subtotal.toFixed(2)}`)
      .text(`Tax: ₹${order.tax.toFixed(2)}`)
      .text(`Shipping: ₹${order.shippingCost.toFixed(2)}`)
      .text(`Discount: ₹${order.discountAmount.toFixed(2)}`)
      .text(`Total: ₹${order.total.toFixed(2)}`);

    doc.end();
  });
};

module.exports = generateInvoice;