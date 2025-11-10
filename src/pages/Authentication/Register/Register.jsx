import React from 'react';
import PrimaryButton from '../../../components/PrimaryButton';
import { Link } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';

const Register = () => {
  return (
    <section className='max-w-sm'>
      <h2 className='text-4xl font-bold mb-3'>Create an account</h2>
      <p>Register with ZapShift</p>
      <form className='mt-4 space-y-3'>
        {/* name */}
        <div>
          <label htmlFor='name' className='text-[#0F172AFF]'>Name *</label>
          <input
            type='text'
            name='name'
            placeholder='Name'
            className='border mt-1 text-[#94A3B8] border-[#94A3B8] px-4 py-2 outline-none block rounded-md w-full'
          />
        </div>
        {/* email */}
        <div>
          <label htmlFor='email' className='text-[#0F172AFF]'>Email *</label>
          <input
            type='email'
            name='email'
            placeholder='Email'
            className='border mt-1 text-[#94A3B8] border-[#94A3B8] px-4 py-2 outline-none block rounded-md w-full'
          />
        </div>
        {/* password */}
        <div>
          <label htmlFor='password' className='text-[#0F172AFF]'>Password *</label>
          <input
            type='password'
            name='password'
            placeholder='Password'
            className='border mt-1 text-[#94A3B8] border-[#94A3B8] px-4 py-2 outline-none block rounded-md w-full'
          />
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