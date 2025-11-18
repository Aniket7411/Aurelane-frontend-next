import OrderTracking from "@reactcomponents/pages/OrderTracking";

export const generateStaticParams = async () => {
  return [
    { orderId: 'abc123' },
    { orderId: 'xyz789' },
  ];
};


export default function OrderTrackingPage() {
  return <OrderTracking />;
}

