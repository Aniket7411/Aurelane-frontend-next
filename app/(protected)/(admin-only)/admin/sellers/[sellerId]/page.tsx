import SellerDetails from "@reactcomponents/components/admin/sellerdetail";

export const generateStaticParams = async () => {
  return [
    { sellerId: 'abc123' },
    { sellerId: 'xyz789' },
  ];
};

export default function SellerDetailsPage() {
  return <SellerDetails />;
}

