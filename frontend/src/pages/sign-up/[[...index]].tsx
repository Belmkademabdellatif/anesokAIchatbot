import dynamic from "next/dynamic";

const SignUpForm = dynamic(()=>import('@anesok/components/auth/SignUpForm'))

const SignUpPage = () => (
  <div>
    <SignUpForm/>
  </div>
);

export default SignUpPage;
