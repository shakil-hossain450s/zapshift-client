import PrimaryButton from '../../../components/PrimaryButton';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../../../components/SocialLogin/SocialLogin';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();
  const handleRegister = async (data) => {
    const { email, password } = data;
    try {
      const result = await createUser(email, password);
      console.log(result);
      if (result.user) {
        toast.success('Registration successfully!');
        navigate(from);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className='max-w-sm'>
      <h2 className='text-4xl font-bold mb-3'>Create an account</h2>
      <p>Register with ZapShift</p>
      <form onSubmit={handleSubmit(handleRegister)} className='mt-4 space-y-3'>
        {/* name */}
        <div>
          <label htmlFor='name' className='text-[#0F172AFF]'>Name *</label>
          <input
            type='text'
            {...register('name', {
              required: true,
            })}
            placeholder='Name'
            className='border mt-1 text-[#94A3B8] border-[#94A3B8] px-4 py-2 outline-none block rounded-md w-full'
          />
          {errors.name?.type === 'required' && <p className='text-red-500'>name is required!</p>}
        </div>
        {/* email */}
        <div>
          <label htmlFor='email' className='text-[#0F172AFF]'>Email *</label>
          <input
            type='email'
            {...register('email', {
              required: true,
            })}
            placeholder='Email'
            className='border mt-1 text-[#94A3B8] border-[#94A3B8] px-4 py-2 outline-none block rounded-md w-full'
          />
          {errors.email?.type === 'required' && <p className='text-red-500'>email is required!</p>}
        </div>
        {/* password */}
        <div>
          <label htmlFor='password' className='text-[#0F172AFF]'>Password *</label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: true,
                minLength: 6
              })}
              placeholder='Password'
              className='border tracking-wide mt-1 text-[#94A3B8] border-[#94A3B8] px-4 py-2 outline-none block rounded-md w-full'
            />
            <span onClick={() => setShowPassword(!showPassword)} className='absolute right-3 text-lg top-3 text-[#2b2b2c] hover:text-[#121213] cursor-pointer'>
              {
                showPassword ? <FaEye /> : <FaEyeSlash />
              }
            </span>
          </div>
          {errors.password?.type === 'required' && <p className='text-red-500'>password is required!</p>}
          {errors.password?.type === 'minLength' && <p className='text-red-500'>password must be 6 charecter or long!</p>}
        </div>
        <PrimaryButton widthFull={true}>
          Register
        </PrimaryButton>
        <div className='text-[#71717A]'>
          <p>Already have an account? <Link to="/signin" className='ml-1 text-[#8FA748] hover:underline'>Signin</Link></p>
          <p className='text-center my-3'>Or</p>
          <SocialLogin>
            Register with Google
          </SocialLogin>
        </div>
      </form>
    </section>
  );
};

export default Register;