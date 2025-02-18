'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { toast } from 'sonner';
import type React from 'react';
import Link from 'next/link';
import { loginSchema } from './validation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, isLoggedIn, user } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [prnNo, setPrnNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ prnNo?: string; password?: string }>(
    {}
  );

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsed = loginSchema.safeParse({ prnNo, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.format();
      setErrors({
        prnNo: fieldErrors.prnNo?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prnNo, password }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const { name, userId, role, email, lastLogin } = data;
      setUser({ userId, name, email, prnNo, role, lastLogin });
      toast.success(`Logged in as ${data.name} 🎉`);

      router.push(role === 'admin' ? `/admin/${userId}` : '/home');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md rounded-xl px-6 py-8 sm:py-10 shadow-lg bg-neutral-50 dark:bg-neutral-900/60 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800'>
      {isLoggedIn && user ? (
        <div className='text-center'>
          <p className='text-gray-800 dark:text-white/80 mb-4'>
            You are already logged in as {user.name}
          </p>

          <RainbowButton
            onClick={() =>
              router.push(
                user.role === 'admin' ? `/admin/${user.userId}` : '/home'
              )
            }
          >
            Continue to Dashboard
          </RainbowButton>
        </div>
      ) : (
        <>
          <div className='absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-zinc-100 dark:from-zinc-900/70 rounded-xl'></div>
          <div className='bg-neutral-100 border border-zinc-300 dark:border-zinc-800 dark:bg-white/5 backdrop-blur-2xl rounded-full w-16 h-16 relative'>
            <div className='relative'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 40 40'
                className='w-8 h-8 left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 absolute  stroke-[#333537] text-[##d2d4d7]'
              >
                <rect
                  width='28'
                  height='38'
                  x='6'
                  y='1'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  rx='6'
                ></rect>
                <rect
                  width='20'
                  height='38'
                  x='6'
                  y='1'
                  stroke='currentColor'
                  strokeWidth='2'
                  rx='6'
                ></rect>
                <circle
                  cx='21.5'
                  cy='20.5'
                  r='1.5'
                  fill='currentColor'
                ></circle>
              </svg>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 15 13'
                className='absolute w-5 h-5 top-1/2 pt-1 left-1/2 translate-x-1/2 translate-y-full right-[5px] stroke-[#333537] text-[##d2d4d7]'
              >
                <path
                  fill='currentColor'
                  fillRule='evenodd'
                  d='M.5 6.648c0-.433.183-.823.476-1.097L5.608.937a1.5 1.5 0 0 1 2.117 2.126L5.632 5.147h7.321a1.5 1.5 0 1 1 0 3H5.631l2.094 2.085a1.5 1.5 0 1 1-2.117 2.126L.942 7.71A1.5 1.5 0 0 1 .5 6.649'
                  clipRule='evenodd'
                ></path>
              </svg>
            </div>
          </div>
          <div className='text-start mt-7 mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white/80'>
              Welcome to StudyStack
            </h2>
            <span className='text-gray-600 dark:text-gray-400'>
              Login to continue
            </span>
          </div>
          <form onSubmit={handleSubmit} className='mt-10 space-y-6'>
            <div>
              <label
                htmlFor='prn'
                className='block text-sm font-medium text-gray-700 dark:text-white'
              >
                PRN Number
              </label>
              <Input
                id='prn'
                name='prn'
                value={prnNo}
                required
                onChange={(e) => setPrnNo(e.target.value)}
                className='mt-1'
                placeholder='Enter your PRN number'
              />
              {errors.prnNo && (
                <p className='text-red-500 font-semibold ml-1 text-sm mt-1'>
                  {errors.prnNo}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 dark:text-white'
              >
                Password
              </label>
              <div className='relative mt-1'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pr-10'
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 flex items-center pr-3'
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOffIcon className='h-5 w-5 text-gray-400' />
                  ) : (
                    <EyeIcon className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 font-semibold ml-1 text-sm mt-1'>
                  {errors.password}
                </p>
              )}
              <div className='mt-3'>
                <Link
                  href={'/forgot-password'}
                  className='text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline'
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <RainbowButton className='w-full' type='submit' disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </RainbowButton>
          </form>
        </>
      )}
    </div>
  );
}
