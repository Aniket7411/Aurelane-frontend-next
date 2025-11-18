import VerifyEmail from "@reactcomponents/components/auth/VerifyEmail";

export const generateStaticParams = async () => {
  return [
    { token: 'abc123' },
    { token: 'xyz789' },
  ];
};


export default function VerifyEmailPage() {
  return <VerifyEmail />;
}

