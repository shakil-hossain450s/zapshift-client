import React, { useState } from 'react';
import PrimaryButton from '../../../components/PrimaryButton';
import SocialLogin from '../../../components/SocialLogin/SocialLogin';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const Signin = () => {
  const { signInUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleSignIn = async(data) => {
    const {email, password} = data;
    try{
      const result = await signInUser(email, password);
      // console.log(result);
      if(result?.user){
        toast.success('Logged in successfully!');
        navigate("/");
      }
    }catch(err){
      // console.log(err);
      toast.error(err.stack);
    }
  }

  return (
    <section className='max-w-sm'>
      <h2 className='text-4xl font-bold mb-3'>Welcome Back</h2>
      <p>Signin with ZapShift</p>
      <form onSubmit={handleSubmit(handleSignIn)} className='mt-4 space-y-3'>
        {/* email */}
        <div>
          <label htmlFor='email' className='text-[#0F172AFF]'>Email *</label>
          <input
            type='email'
            {...register('email', {
              required: true
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
          {errors.password?.type === 'minLength' && <p className='text-red-500'>password must be 6 charecter or longer!</p>}
        </div>
        <PrimaryButton widthFull={true}>
          Sign In
        </PrimaryButton>
        <div className='text-[#71717A]'>
          <p>Already have an account? <Link to="/register" className='ml-1 text-[#8FA748] hover:underline'>Register</Link></p>
          <p className='text-center my-3'>Or</p>
          <SocialLogin>
            Login with Google
          </SocialLogin>
        </div>
      </form>
    </section>
  );
};

export default Signin;