import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [viewPassword, setViewPassword] = useState(false);

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill out all fields.")
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        toast.success("Signed In Successfully");
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      toast.error("Something went wrong!");
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='md:min-h-screen mt-20'>
      <div className='px-5 pb-10 pt-4 max-w-md mx-auto shadow-md border border-zinc-500 dark:shadow-zinc-200 rounded-lg'>
        {/* left */}
        {/* <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              {`Rajat's`}
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div> */}
        {/* right */}

        <div className='flex-1 px-2 lg:px-5'>
          <div className="flex flex-col gap-3 my-4 text-center">
            <h3 className="text-3xl font-semibold">Login to your account</h3>
            <p className='text-zinc-500 font-semibold text-sm'>Enter the required fields to continue with your signin.</p>
            <div className="border w-full dark:border-zinc-600" />
          </div>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='Email Address'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <div className="relative">
                <TextInput
                  type={viewPassword ? 'text' : 'password'}
                  placeholder='Password'
                  id='password'
                  onChange={handleChange}
                />
                <div
                  className="absolute top-3 right-4 cursor-pointer text-zinc-500 hover:text-zinc-700 transition-all ease-in duration-150"
                  onClick={() => setViewPassword(!viewPassword)}
                >
                  {
                    viewPassword ? <FaEyeSlash /> : <FaEye />
                  }
                </div>
              </div>
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            {/* <OAuth /> */}
          </form>
          <div className='flex gap-2 text-sm mt-5 justify-center font-medium text-zinc-500'>
            <span>{`Don't`} Have an account?</span>
            <Link to='/sign-up' className='text-blue-500 hover:text-blue-600 hover:underline underline-offset-2 transition-all ease-in duration-150'>
              Sign Up
            </Link>
          </div>
          {/* {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )} */}
        </div>
      </div>
    </div>
  );
}
