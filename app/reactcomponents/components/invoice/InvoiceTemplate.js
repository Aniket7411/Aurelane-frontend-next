'use client';

import React from 'react';

const InvoiceTemplate = ({ order }) => {
    const calculateItemTotal = (item) => {
        return (item.price || 0) * (item.quantity || 1);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white p-8 max-w-4xl mx-auto" id="invoice-template">
            {/* Header */}
            <div className="border-b-2 border-emerald-600 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-emerald-600 mb-2">INVOICE</h1>
                        <p className="text-gray-600">Aurelane Gems & Jewellery</p>
                        <p className="text-sm text-gray-500">Premium Gemstones Since 2020</p>
                    </div>
                    <div className="text-right">
                        <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-4xl">💎</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Invoice To:</h3>
                    <p className="text-gray-700 font-medium">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">{order.shippingAddress?.address}</p>
                    <p className="text-gray-600 text-sm">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                        <span className="font-medium">Phone:</span> {order.shippingAddress?.phone}
                    </p>
                    <p className="text-gray-600 text-sm">
                        <span className="font-medium">Email:</span> {order.shippingAddress?.email}
                    </p>
                </div>

                <div className="text-right">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Invoice Number</p>
                        <p className="font-bold text-lg">{order.id || order._id}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Invoice Date</p>
                        <p className="font-semibold">{formatDate(order.createdAt || new Date())}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <p className="font-semibold text-emerald-600">
                            {order.paymentStatus || 'Paid'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-50 border-b-2 border-emerald-600">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Weight</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-3 px-4">
                                    <p className="font-medium text-gray-900">
                                        {item.name || item.gem?.name || 'Item'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.category || item.gem?.category || ''}
                                    </p>
                                </td>
                                <td className="text-center py-3 px-4 text-gray-700">
                                    {item.sizeWeight || item.gem?.sizeWeight || 'N/A'} {item.sizeUnit || item.gem?.sizeUnit || ''}
                                </td>
                                <td className="text-center py-3 px-4 text-gray-700">{item.quantity || 1}</td>
                                <td className="text-right py-3 px-4 text-gray-700">
                                    ₹{(item.price || 0).toLocaleString()}
                                </td>
                                <td className="text-right py-3 px-4 font-medium text-gray-900">
                                    ₹{calculateItemTotal(item).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
                <div className="w-80">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₹{(order.subtotal || order.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                            {order.shipping === 0 ? 'Free' : `₹${(order.shipping || 0).toLocaleString()}`}
                        </span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200 text-emerald-600">
                            <span>Discount:</span>
                            <span className="font-medium">-₹{order.discount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between py-3 border-t-2 border-emerald-600 mt-2">
                        <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-emerald-600">
                            ₹{(order.totalAmount || 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="text-sm font-medium capitalize">{order.paymentMethod || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {order.orderNotes && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Order Notes:</h3>
                    <p className="text-gray-600 text-sm">{order.orderNotes}</p>
                </div>
            )}

            {/* Footer */}
            <div className="border-t-2 border-gray-200 pt-6 mt-8">
                <div className="grid grid-cols-3 gap-6 text-sm text-gray-600">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
                        <p>Email: support@aurelane.com</p>
                        <p>Phone: +91 123 456 7890</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                        <p>123 Gem Street, Jewelry District</p>
                        <p>Mumbai, Maharashtra - 400001</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Website</h4>
                        <p>www.aurelane.com</p>
                        <p className="text-emerald-600">Premium Gemstones</p>
                    </div>
                </div>
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Thank you for your business! All gemstones are certified and come with authenticity guarantee.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        For any queries, please contact our customer support.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceTemplate;

