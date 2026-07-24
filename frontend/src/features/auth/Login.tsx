/**
 * @file Login.tsx
 * @description React Login Page utilizing react-hook-form and Zod validation schemas.
 * 
 * PURPOSE:
 * Implements login functionality for CodePulse AI workspace accounts.
 * 
 * ROLE IN FRONTEND:
 * Mounted under `/auth/login`. Automatically authenticates sessions, saves JWTs,
 * and redirects to the landing dashboard or original route.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { AlertCircle, CheckCircle2, Mail, Lock } from 'lucide-react';

const formSchema = z.object({
  email: z
    .string()
    .email('Invalid email address format')
    .trim(),
  password: z
    .string()
    .min(1, 'Password cannot be empty'),
});

type FormValues = z.infer<typeof formSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Identify redirect path if user was intercepted
  const redirectPath = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setErrorMsg(null);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <>
      <CardHeader className="border-b-0 pb-2 px-0 pt-0">
        <CardTitle className="text-xl font-bold text-white text-center w-full">
          Welcome Back
        </CardTitle>
        <p className="text-xs text-gray-400 text-center w-full mt-1">
          Access your productivity dashboard
        </p>
      </CardHeader>

      <CardContent className="px-0 py-4 space-y-4">
        {/* Error Alert Display */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert Display */}
        {isSuccess && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Successfully authenticated. Entering workspace...</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Address
            </label>
            <input
              type="email"
              placeholder="lead@codepulse.ai"
              {...register('email')}
              className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            {errors.email && (
              <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" /> Password
              </label>
              <a href="#" className="text-[10px] text-brand-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            {errors.password && (
              <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-xs font-semibold py-2.5 mt-2" isLoading={isSubmitting}>
            Log In to Platform
          </Button>
        </form>

        <div className="pt-4 border-t border-dark-border text-center">
          <p className="text-[11px] text-gray-400">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-brand-400 hover:underline hover:text-brand-300 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </CardContent>
    </>
  );
};

export default Login;
