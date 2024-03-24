import dynamic from "next/dynamic";

const SignInForm = dynamic(()=>import('@anesok/components/auth/SignInForm'))

const SignInPage = () => (
  <div>
    <SignInForm />
  </div>
);

export default SignInPage;
