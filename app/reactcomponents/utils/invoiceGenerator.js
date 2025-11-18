'use client';

// Optional: PDF generation (requires html2canvas and jspdf)
// If these packages are not installed, use generateInvoiceHTML instead
export const generateInvoicePDF = async (order) => {
    try {
        // Dynamically import packages to avoid build errors if not installed
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).default;

        // Create a temporary container for the invoice
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '800px';
        document.body.appendChild(tempContainer);

        // Import and render the invoice template
        const { default: InvoiceTemplate } = await import('../components/invoice/InvoiceTemplate');
        const React = await import('react');
        const ReactDOM = await import('react-dom/client');

        const root = ReactDOM.createRoot(tempContainer);
        root.render(React.createElement(InvoiceTemplate, { order }));

        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate PDF
        const canvas = await html2canvas(tempContainer.firstChild, {
            scale: 2,
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Invoice_${order.id || order._id}.pdf`);

        // Cleanup
        root.unmount();
        document.body.removeChild(tempContainer);

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        // Fallback to HTML print
        console.log('Falling back to HTML print method...');
        throw error;
    }
};

// Alternative: Generate invoice HTML for backend
export const generateInvoiceHTML = (order) => {
    const calculateItemTotal = (item) => (item.price || 0) * (item.quantity || 1);
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${order.id || order._id}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            border-bottom: 3px solid #059669;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
        }
        .logo { font-size: 32px; font-weight: bold; color: #059669; }
        .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f0fdf4; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #059669; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .grand-total { font-size: 20px; font-weight: bold; color: #059669; border-top: 2px solid #059669; padding-top: 12px; margin-top: 8px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div>
                <div class="logo">INVOICE</div>
                <p>Aurelane Gems & Jewellery</p>
                <p style="font-size: 12px; color: #6b7280;">Premium Gemstones Since 2020</p>
            </div>
            <div style="text-align: right;">
                <p><strong>Invoice #:</strong> ${order.id || order._id}</p>
                <p><strong>Date:</strong> ${formatDate(order.createdAt || new Date())}</p>
                <p><strong>Status:</strong> <span style="color: #059669;">Paid</span></p>
            </div>
        </div>

        <div class="invoice-details">
            <div>
                <h3>Bill To:</h3>
                <p><strong>${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}</strong></p>
                <p>${order.shippingAddress?.address}</p>
                <p>${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}</p>
                <p>Phone: ${order.shippingAddress?.phone}</p>
                <p>Email: ${order.shippingAddress?.email}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items?.map(item => `
                <tr>
                    <td>
                        <strong>${item.name || item.gem?.name || 'Item'}</strong><br>
                        <small style="color: #6b7280;">${item.category || item.gem?.category || ''}</small>
                    </td>
                    <td style="text-align: center;">${item.quantity || 1}</td>
                    <td style="text-align: right;">₹${(item.price || 0).toLocaleString()}</td>
                    <td style="text-align: right;"><strong>₹${calculateItemTotal(item).toLocaleString()}</strong></td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${(order.subtotal || order.totalAmount || 0).toLocaleString()}</span>
            </div>
            <div class="total-row">
                <span>Shipping:</span>
                <span>${order.shipping === 0 ? 'Free' : `₹${(order.shipping || 0).toLocaleString()}`}</span>
            </div>
            ${order.discount > 0 ? `
            <div class="total-row" style="color: #059669;">
                <span>Discount:</span>
                <span>-₹${order.discount.toLocaleString()}</span>
            </div>
            ` : ''}
            <div class="total-row grand-total">
                <span>Total Amount:</span>
                <span>₹${(order.totalAmount || 0).toLocaleString()}</span>
            </div>
        </div>

        ${order.orderNotes ? `
        <div style="margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px;">
            <strong>Order Notes:</strong>
            <p style="margin: 5px 0 0 0;">${order.orderNotes}</p>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>Contact:</strong> support@aurelane.com | +91 123 456 7890</p>
            <p><strong>Address:</strong> 123 Gem Street, Jewelry District, Mumbai - 400001</p>
            <p style="margin-top: 15px;">Thank you for your business! All gemstones are certified and come with authenticity guarantee.</p>
        </div>
    </div>
</body>
</html>
    `;
};

