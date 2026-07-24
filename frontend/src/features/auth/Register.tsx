/**
 * @file Register.tsx
 * @description React Registration Page featuring input validations via react-hook-form & Zod.
 * 
 * PURPOSE:
 * Provides user registration form UI for CodePulse AI.
 * 
 * ROLE IN FRONTEND:
 * Mounted under `/auth/register`. Redirects to the dashboard upon successful account creation.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { AlertCircle, CheckCircle2, User, Mail, Lock, Shield } from 'lucide-react';

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(50, 'Full name cannot exceed 50 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address format')
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z
    .string(),
  role: z.enum(['DEVELOPER', 'LEAD', 'ADMIN']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

export const Register: React.FC = () => {
  const { register: registerSession } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'DEVELOPER',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setErrorMsg(null);
    try {
      await registerSession({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration. Please try again.');
    }
  };

  return (
    <>
      <CardHeader className="border-b-0 pb-2 px-0 pt-0">
        <CardTitle className="text-xl font-bold text-white text-center w-full">
          Create Account
        </CardTitle>
        <p className="text-xs text-gray-400 text-center w-full mt-1">
          Join the developer productivity workspace
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
            <span>Registration successful! Redirecting to dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
            </label>
            <input
              type="text"
              placeholder="Sarah Connor"
              {...register('fullName')}
              className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            {errors.fullName && (
              <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Address
            </label>
            <input
              type="email"
              placeholder="sarah@codepulse.ai"
              {...register('email')}
              className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            {errors.email && (
              <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.email.message}</p>
            )}
          </div>

          {/* Role selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-gray-400" /> Platform Role
            </label>
            <select
              {...register('role')}
              className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            >
              <option value="DEVELOPER">Developer (Workspace tracking)</option>
              <option value="LEAD">Engineering Lead (Team analytics)</option>
              <option value="ADMIN">Administrator (Platform operations)</option>
            </select>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" /> Password
            </label>
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" /> Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className="w-full bg-dark-bg/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            {errors.confirmPassword && (
              <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-xs font-semibold py-2.5 mt-2" isLoading={isSubmitting}>
            Register Workspace Account
          </Button>
        </form>

        <div className="pt-4 border-t border-dark-border text-center">
          <p className="text-[11px] text-gray-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-brand-400 hover:underline hover:text-brand-300 transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </CardContent>
    </>
  );
};

export default Register;
