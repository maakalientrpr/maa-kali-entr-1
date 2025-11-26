import LoginPage from "@/components/auth/login-form";
import { requireUnauth } from "@/lib/auth-utils";

const page = async () => {
  
  await requireUnauth();
  
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default page;
