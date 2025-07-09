import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { NavLink } from 'react-router';
import useAuth from '../../hooks/useAuth';
import GoogleLogin from './GoogleLogin';

const Login = () => {
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoginError('');
      setLoginSuccess('');
      setIsLoading(true);

      // Sign in user with Firebase
      const result = await signIn(data.email, data.password);
      console.log('User signed in successfully:', result.user);

      // Handle successful login here
      // ✅ Show success message
      setLoginSuccess('Login successful! Welcome back!');

      // Optional: Clear form or redirect after delay
      setTimeout(() => {
        setLoginSuccess('');
        // navigate('/dashboard'); // Redirect if needed
      }, 3000);
    } catch (error) {
      console.error('Login failed:', error);

      // Handle specific Firebase errors
      let errorMessage = 'Login failed. Please try again.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }

      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Validation rules
  const validationRules = {
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
              Welcome Back!
            </h1>
            <p className="text-center text-base-content/70 mb-6">
              Please log in to your account
            </p>

            {/* Global Error Message */}
            {loginError && (
              <div className="alert alert-error mb-4">
                <span className="text-sm">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    autoComplete="current-password"
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

              {/* Forgot Password */}
              <div className="form-control">
                <label className="label justify-end">
                  <a
                    href="#"
                    className="label-text-alt link link-hover link-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle forgot password logic
                      console.log('Forgot password clicked');
                    }}
                  >
                    Forgot password?
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                {/* ✅ Success Message - Green */}
                {loginSuccess && (
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
                    <span>{loginSuccess}</span>
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
                      Logging In...
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>

                {/* Sign Up Link */}
                <p className=" text-sm text-base-content/70 mr-3 mt-6">
                  Don't have an account?{' '}
                  <NavLink
                    to={'/register'}
                    className="link link-primary font-medium ml-1"
                  >
                    Register here
                  </NavLink>
                </p>
              </div>
            </form>

            <div className="divider ">OR</div>
            {/* Google Button */}
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
