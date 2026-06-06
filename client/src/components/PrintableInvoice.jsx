import React from 'react';

const PrintableInvoice = React.forwardRef(({ invoice, order, customer }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white" style={{ width: '800px', margin: '0 auto' }}>
      {/* Company Header */}
      <div className="text-center border-b pb-4 mb-4">
        <h1 className="text-3xl font-bold text-blue-600">NAGLINK LOGISTICS</h1>
        <p className="text-gray-600">123 Transport Avenue, Harare, Zimbabwe</p>
        <p className="text-gray-600">Email: info@naglink.com | Phone: +263 123 456 789</p>
      </div>

      {/* Invoice Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">INVOICE</h2>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between mb-6">
        <div>
          <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Invoice Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span className="text-green-600">{invoice.status.toUpperCase()}</span></p>
        </div>
        <div>
          <p><strong>Order ID:</strong> {order.orderNumber || `#${order.id}`}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Bill To:</h3>
        <p>{customer.companyName || customer.username}</p>
        <p>{customer.address || 'N/A'}</p>
        <p>Email: {customer.email}</p>
        <p>Phone: {customer.phone}</p>
      </div>

      {/* Shipment Details */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Shipment Details:</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-semibold">Pickup Location:</td>
              <td className="py-2">{order.pickupLocation}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">Delivery Location:</td>
              <td className="py-2">{order.deliveryLocation}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">Goods Description:</td>
              <td className="py-2">{order.goodsDescription}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">Weight:</td>
              <td className="py-2">{order.weight} kg</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Summary */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Payment Summary:</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-right">Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Transportation Services</td>
              <td className="py-2 text-right">${invoice.amount}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-bold">Total</td>
              <td className="py-2 text-right font-bold">${invoice.amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Instructions */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Payment Instructions:</h3>
        <p>Bank: NAGLINK Bank</p>
        <p>Account Name: NAGLINK Logistics</p>
        <p>Account Number: 1234567890</p>
        <p>Reference: {invoice.invoiceNumber}</p>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        <p>Thank you for choosing NAGLINK Logistics!</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </div>
  );
});

export default PrintableInvoice;