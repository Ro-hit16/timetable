
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';  // Import your auth hook
// import { useAuth } from '../../context/AuthContext';
// import { Eye, EyeOff } from 'lucide-react';

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     user_name: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();  // Get login from AuthContext

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setFormData({
//       name: '',
//       email: '',
//       user_name: '',
//       password: '',
//       confirmPassword: '',
//     });
//     setErrorMessage('');
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');

//     if (!isLogin && formData.password !== formData.confirmPassword) {
//       setErrorMessage('Passwords do not match');
//       return;
//     }

//     try {
//       setLoading(true);

//       if (isLogin) {
//         // Call login from context
//         const result = await login({
//           user_name: formData.user_name.trim(),
//           password: formData.password,
//         });

//         if (result.success) {
//           navigate('/dashboard');  // Redirect on successful login
//         } else {
//           setErrorMessage(result.error || 'Login failed');
//         }
//       } else {
//         // Register flow (you can keep your axios register call here)
//         const payload = {
//           name: formData.name.trim(),
//           email: formData.email.trim(),
//           user_name: formData.user_name.trim(),
//           password: formData.password,
//         };

//         // Example axios call for registration
//         const response = await fetch('/api/auth/register', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           // After registration, maybe auto switch to login or navigate
//           setIsLogin(true);
//           setErrorMessage('Registration successful. Please login.');
//           setFormData({
//             name: '',
//             email: '',
//             user_name: '',
//             password: '',
//             confirmPassword: '',
//           });
//         } else {
//           setErrorMessage(data.message || 'Registration failed');
//         }
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.message ||
//           error.message ||
//           'Something went wrong. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">
//           {isLogin ? 'Login' : 'Register'}
//         </h2>

//         {errorMessage && (
//           <div className="text-red-600 text-sm text-center mb-4">{errorMessage}</div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <>
//               <div>
//                 <label className="block mb-1 font-medium">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   autoComplete="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="pl-3 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your full name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="pl-3 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </>
//           )}
//           <div>
//             <label className="block mb-1 font-medium">
//               {isLogin ? 'Username' : 'Choose a Username'}
//             </label>
//             <input
//               type="text"
//               name="user_name"
//               autoComplete="username"
//               value={formData.user_name}
//               onChange={handleChange}
//               className="pl-3 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               placeholder="Enter your username"
//               required
//             />
//           </div>
//           <div className="relative">
//             <label className="block mb-1 font-medium">Password</label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               autoComplete={isLogin ? 'current-password' : 'new-password'}
//               value={formData.password}
//               onChange={handleChange}
//               className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               placeholder="Enter your password"
//               required
//             />
//             <span
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//               onClick={() => setShowPassword((prev) => !prev)}
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </span>
//           </div>
//           {!isLogin && (
//             <div className="relative">
//               <label className="block mb-1 font-medium">Confirm Password</label>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="confirmPassword"
//                 autoComplete="new-password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Confirm your password"
//                 required
//               />
//             </div>
//           )}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg transition text-white ${
//               loading
//                 ? 'bg-purple-400 cursor-not-allowed'
//                 : 'bg-purple-600 hover:bg-purple-700'
//             }`}
//           >
//             {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
//           </button>
//         </form>
//         <p className="text-center mt-4">
//           {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//           <button
//             onClick={toggleForm}
//             className="text-purple-600 hover:underline font-semibold"
//           >
//             {isLogin ? 'Register' : 'Login'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user_name: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setFormData({
      name: '',
      email: '',
      user_name: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      if (isLogin) {
        const result = await login({
          user_name: formData.user_name.trim(),
          password: formData.password
        });
        if (result.success) navigate('/dashboard');
        else setErrorMessage(result.error || 'Login failed');
      } else {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          user_name: formData.user_name.trim(),
          password: formData.password
        };
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setIsLogin(true);
          setErrorMessage('Registration successful. Please login.');
        } else {
          setErrorMessage(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // === GOOGLE HANDLER ===
  const handleGoogleLogin = () => {
    // TODO: integrate your Google OAuth endpoint
    window.location.href = '/api/auth/google';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url('https://img.freepik.com/free-vector/abstract-digital-grid-vector-black-background_53876-111550.jpg')` }}
    >
      <div className="backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white drop-shadow mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {errorMessage && (
          <div className="text-red-200 text-sm text-center mb-4">{errorMessage}</div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white/90 hover:bg-white text-gray-700 font-medium py-2 rounded-lg flex items-center justify-center mb-4"
        >
          <FcGoogle size={22} className="mr-2" />
          Continue with Google
        </button>

        <div className="flex items-center mb-4">
          <div className="flex-1 h-px bg-white/40"></div>
          <p className="px-2 text-xs text-white">OR</p>
          <div className="flex-1 h-px bg-white/40"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          {!isLogin && (
            <>
              <div>
                <label className="text-sm">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full bg-white/30 text-white p-2 mt-1 rounded focus:outline-none" required />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full bg-white/30 text-white p-2 mt-1 rounded focus:outline-none" required />
              </div>
            </>
          )}
          <div>
            <label className="text-sm">{isLogin ? 'Username' : 'Choose Username'}</label>
            <input type="text" name="user_name" value={formData.user_name} onChange={handleChange}
              className="w-full bg-white/30 text-white p-2 mt-1 rounded focus:outline-none" required />
          </div>
          <div className="relative">
            <label className="text-sm">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/30 text-white p-2 mt-1 rounded focus:outline-none"
              required
            />
            <span className="absolute top-9 right-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff color="white" /> : <Eye color="white" />}
            </span>
          </div>
          {!isLogin && (
            <div>
              <label className="text-sm">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-white/30 text-white p-2 mt-1 rounded focus:outline-none"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold ${
              loading ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            } text-white flex items-center justify-center`}
          >
            {loading && <Loader2 className="animate-spin mr-2" size={18}/>}
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white/80">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleForm} className="text-white font-medium hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
     </div>
  );
 };

 export default AuthPage;
 