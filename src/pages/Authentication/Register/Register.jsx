import PrimaryButton from '../../../components/PrimaryButton';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../../../components/SocialLogin/SocialLogin';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAxiosCommon from '../../../hooks/useAxiosCommon';

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const axiosCommon = useAxiosCommon();

  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleRegister = async (data) => {
    const { email, password, username } = data;

    const defaultAvatar = "https://i.ibb.co/user-icon.png";
    const imageUrl = image ? await uploadToImgBB() : defaultAvatar;

    // console.log(username);
    // return console.log({ username, email, password, imageUrl})
    try {
      setLoading(true);

      const result = await createUser(email, password);
      console.log(result);

      const user = result.user;

      if (user) {
        await updateUserProfile(username, imageUrl);

        const userData = {
          username: user?.displayName,
          email: user?.email,
          photo: user?.photoURL,
          role: 'user',
          provider: 'password'
        }

        const { data } = await axiosCommon.post('/saveUser', userData);

        console.log(data);

        toast.success('Registration successfully!');
        navigate(from);
      }


    } catch (err) {
      console.log(err || 'Registration Failed.');
    } finally {
      setLoading(false);
    }
  }

  const uploadToImgBB = async () => {
    const form = new FormData();
    form.append('image', image);

    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
      form
    );

    return data.data.url;
  }

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImage(image);
    setPreview(URL.createObjectURL(image));
  }

  return (
    <section className='max-w-sm'>
      <h2 className='text-4xl font-bold mb-3'>Create an account</h2>
      <p>Register with ZapShift</p>
      <form onSubmit={handleSubmit(handleRegister)} className='mt-4 space-y-3'>
        {/* image */}
        <div>
          <label className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                className="w-10 h-10 rounded-full object-cover border shadow-md"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shadow text-gray-500">
                <FaUserPlus className="" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        {/* name */}
        <div>
          <label htmlFor='username' className='text-[#0F172AFF]'>Name *</label>
          <input
            type='text'
            {...register('username', {
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
          {!loading ? 'Signin' : <span className="loading loading-spinner loading-md"></span>}
        </PrimaryButton>
        <div className='text-[#71717A]'>
          <p>Already have an account?
            <Link to="/signin" className='ml-1 text-[#8FA748] hover:underline'>
              Sign in
            </Link>
          </p>
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