import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import useAxiosCommon from "../../hooks/useAxiosCommon";

const SocialLogin = ({ children }) => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosCommon = useAxiosCommon();

  const from = location.state?.from?.pathname || '/';

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      console.log(result);
      const user = result.user;
      

      if (user) {

        const userData = {
          username: user?.displayName,
          email: user?.email,
          photo: user?.photoURL,
          role: 'user',
          provider: 'google'
        }

        const { data } = await axiosCommon.post('/saveUser', userData);
        console.log(data);

        toast.success('Logged in successfully');
        navigate(from);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.stack);
    }
  }
  return (
    <button onClick={handleGoogleSignIn} className="btn bg-[#E9ECF1] hover:-translate-y-0.5 transition-all duration-300 text-black border-[#e5e5e5] w-full">
      <svg aria-label="Google logo" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#E9ECF1"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
      {children}
    </button>
  );
};

export default SocialLogin;