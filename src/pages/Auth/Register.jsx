import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { NavLink } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { GoogleAuthProvider } from 'firebase/auth';
import GoogleLogin from './GoogleLogin';

const Register = () => {
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const { createUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setRegisterError('');
      setRegisterSuccess('');
      setIsLoading(true);

      // Create user with Firebase
      const result = await createUser(data.email, data.password);
      console.log('User created successfully:', result.user);

      // Handle successful registration here
      // e.g., redirect to dashboard, show success message, etc.
      // ✅ Show success message
      setRegisterSuccess('Account created successfully! Welcome aboard!');

      // Optional: Clear form or redirect after delay
      setTimeout(() => {
        setRegisterSuccess('');
        // navigate('/dashboard'); // Redirect if needed
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);

      // Handle specific Firebase errors
      let errorMessage = 'Registration failed. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }

      setRegisterError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Validation rules
  const validationRules = {
    name: {
      required: 'Full name is required',
      minLength: {
        value: 2,
        message: 'Name must be at least 2 characters long',
      },
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters long',
      },
    },
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="hero bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full min-w-sm max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-4">
              Create An Account
            </h1>
            <p className="text-center text-base-content/70 mb-6">
              Join us today and get started
            </p>

            {/* Global Error Message */}
            {registerError && (
              <div className="alert alert-error mb-4">
                <span className="text-sm">{registerError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  {...register('name', validationRules.name)}
                  className={`input input-bordered bg-base-100 focus:input-primary transition-colors w-full ${
                    errors.name ? 'input-error' : ''
                  }`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error" role="alert">
                      {errors.name.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  {...register('email', validationRules.email)}
                  className={`input input-bordered bg-base-100 focus:input-primary transition-colors w-full ${
                    errors.email ? 'input-error' : ''
                  }`}
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error" role="alert">
                      {errors.email.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', validationRules.password)}
                    className={`input input-bordered bg-base-100 focus:input-primary transition-colors w-full pr-12 ${
                      errors.password ? 'input-error' : ''
                    }`}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error" role="alert">
                      {errors.password.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                {/* ✅ Success Message - Green */}
                {registerSuccess && (
                  <div className="alert alert-success mb-4">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{registerSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
                {/* Login Link */}
                <p className="text-center text-sm text-base-content/70 mt-6">
                  Already have an account?
                  <NavLink
                    to="/login"
                    className="link link-primary font-medium ml-1"
                  >
                    Log In here
                  </NavLink>
                </p>
              </div>
            </form>

            <div className="divider">OR</div>

            {/* Google */}
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
