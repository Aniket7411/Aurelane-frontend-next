import ResetPassword from "@reactcomponents/components/auth/ResetPassword";

export const generateStaticParams = async () => {
  return [
    { token: 'abc123' },
    { token: 'xyz789' },
  ];
};


export default function ResetPasswordTokenPage() {
  return <ResetPassword />;
}

