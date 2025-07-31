// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { toast } from 'react-toastify';
// import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const result = await login(formData);
//       if (result.success) {
//         toast.success('Login successful!');
//         navigate('/dashboard');
//       } else {
//         toast.error(result.error);
//       }
//     } catch (error) {
//       toast.error('An error occurred during login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="bg-white rounded-2xl shadow-2xl p-8">
//           {/* Header */}
//           <div className="text-center">
//             <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
//               <Lock className="h-8 w-8 text-white" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">
//               Welcome Back
//             </h2>
//             <p className="text-gray-600">
//               Sign in to your timetable management account
//             </p>
//           </div>

//           {/* Form */}
//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               {/* Email Field */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Remember me and Forgot password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>
//               <div className="text-sm">
//                 <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                   Forgot password?
//                 </a>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//               >
//                 {loading ? (
//                   <div className="spinner w-5 h-5"></div>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </div>
//           </form>

//           {/* Footer */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{' '}
//               <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                 Contact administrator
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import React, { useState } from 'react';
// import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const AuthPage = () => {
//   const [tab, setTab] = useState('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login, register } = useAuth();

//   const [loginData, setLoginData] = useState({ email: '', password: '' });
//   const [signupData, setSignupData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleInputChange = (e, formSetter) => {
//     formSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const result = await login(loginData);
//       if (result.success) {
//         toast.success('Login successful!');
//         navigate('/');
//       } else {
//         toast.error(result.error || 'Login failed');
//       }
//     } catch (err) {
//       toast.error('Login error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (signupData.password !== signupData.confirmPassword) {
//       toast.error("Passwords don't match");
//       return;
//     }
//     setLoading(true);
//     try {
//       const result = await register(signupData);
//       if (result.success) {
//         toast.success('Account created! Please login.');
//         setTab('login');
//       } else {
//         toast.error(result.error || 'Signup failed');
//       }
//     } catch (err) {
//       toast.error('Signup error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <div className="flex justify-center mb-6 space-x-4">
//           <button
//             onClick={() => setTab('login')}
//             className={`px-4 py-2 font-medium rounded-lg ${tab === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setTab('signup')}
//             className={`px-4 py-2 font-medium rounded-lg ${tab === 'signup' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
//           >
//             Sign Up
//           </button>
//         </div>

//         {tab === 'login' ? (
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={loginData.email}
//                   onChange={(e) => handleInputChange(e, setLoginData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={loginData.password}
//                   onChange={(e) => handleInputChange(e, setLoginData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
//                   {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleSignup} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={signupData.name}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Your full name"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={signupData.email}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={signupData.password}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Create a password"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={signupData.confirmPassword}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Repeat your password"
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             >
//               {loading ? 'Signing up...' : 'Sign Up'}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthPage;


// import React, { useState } from 'react';
// import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const AuthPage = () => {
//   const [tab, setTab] = useState('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login, register } = useAuth();

//   const [loginData, setLoginData] = useState({ email: '', password: '' });
//   const [signupData, setSignupData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleInputChange = (e, formSetter) => {
//     formSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const result = await login(loginData);
//       if (result.success) {
//         toast.success('Login successful!');
//         navigate('/');
//       } else {
//         toast.error(result.error || 'Login failed');
//       }
//     } catch (err) {
//       toast.error('Login error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (signupData.password !== signupData.confirmPassword) {
//       toast.error("Passwords don't match");
//       return;
//     }
//     setLoading(true);
//     try {
//       const payload = {
//   name: signupData.name,
//   user_name: signupData.name.toLowerCase().replace(/\s+/g, '_'),
//   email: signupData.email,
//   password: signupData.password,
//   role: 'admin'
// };

//       const result = await register(payload);
//       if (result.success) {
//         toast.success('Account created! Please login.');
//         setTab('login');
//       } else {
//         toast.error(result.error || 'Signup failed');
//       }
//     } catch (err) {
//       toast.error('Signup error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <div className="flex justify-center mb-6 space-x-4">
//           <button
//             onClick={() => setTab('login')}
//             className={`px-4 py-2 font-medium rounded-lg ${tab === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setTab('signup')}
//             className={`px-4 py-2 font-medium rounded-lg ${tab === 'signup' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
//           >
//             Sign Up
//           </button>
//         </div>

//         {tab === 'login' ? (
//           <form onSubmit={handleLogin} className="space-y-4">
//             {/* LOGIN FORM */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={loginData.email}
//                   onChange={(e) => handleInputChange(e, setLoginData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={loginData.password}
//                   onChange={(e) => handleInputChange(e, setLoginData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
//                   {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleSignup} className="space-y-4">
//             {/* SIGNUP FORM */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={signupData.name}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Your full name"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={signupData.email}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={signupData.password}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Create a password"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={signupData.confirmPassword}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Repeat your password"
//                   required
//                 />
//               </div>
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             >
//               {loading ? 'Signing up...' : 'Sign Up'}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthPage;



// Login.jsx (AuthPage)
// import React, { useState } from 'react';
// import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const AuthPage = () => {
//   const [tab, setTab] = useState('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login, register } = useAuth();

//   const [loginData, setLoginData] = useState({ user_name: '', password: '' });
//   const [signupData, setSignupData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleInputChange = (e, formSetter) => {
//     formSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const result = await login(loginData);
//       if (result.success) {
//         toast.success('Login successful!');
//         navigate('/');
//       } else {
//         toast.error(result.error || 'Login failed');
//       }
//     } catch (err) {
//       toast.error('Login error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (signupData.password !== signupData.confirmPassword) {
//       toast.error("Passwords don't match");
//       return;
//     }
//     setLoading(true);
//     try {
//       const payload = {
//         name: signupData.name,
//         user_name: signupData.name.toLowerCase().replace(/\s+/g, '_'),
//         email: signupData.email,
//         password: signupData.password,
//         role: 'admin'
//       };

//       const result = await register(payload);
//       if (result.success) {
//         toast.success('Account created! Please login.');
//         setTab('login');
//       } else {
//         toast.error(result.error || 'Signup failed');
//       }
//     } catch (err) {
//       toast.error('Signup error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <div className="flex justify-center mb-6 space-x-4">
//           <button
//             onClick={() => setTab('login')}
//             className={`px-4 py-2 font-medium rounded-lg ${tab === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setTab('signup')}
//             className={`px-4 py-2 font-medium rounded-lg ${tab === 'signup' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
//           >
//             Sign Up
//           </button>
//         </div>

//         {tab === 'login' ? (
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="user_name"
//                   value={loginData.user_name}
//                   onChange={(e) => handleInputChange(e, setLoginData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter username"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={loginData.password}
//                   onChange={(e) => handleInputChange(e, setLoginData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
//                   {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleSignup} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={signupData.name}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Your full name"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={signupData.email}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={signupData.password}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Create a password"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={signupData.confirmPassword}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Repeat your password"
//                   required
//                 />
//               </div>
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             >
//               {loading ? 'Signing up...' : 'Sign Up'}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
// import React, { useState } from 'react';
// import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const AuthPage = () => {
//   const [tab, setTab] = useState('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login, register } = useAuth();

//   const [loginData, setLoginData] = useState({ user_name: '', password: '' });
//   const [signupData, setSignupData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleInputChange = (e, formSetter) => {
//     formSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const result = await login(loginData);
//       if (result.success) {
//         toast.success('Login successful!');
//         navigate('/');
//       } else {
//         console.error('Login failed:', result);
//         toast.error(result?.error || 'Login failed');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       toast.error(err?.response?.data?.message || 'Login error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (signupData.password !== signupData.confirmPassword) {
//       toast.error("Passwords don't match");
//       return;
//     }
//     setLoading(true);
//     try {
//       const payload = {
//         name: signupData.name,
//         user_name: signupData.name.toLowerCase().replace(/\s+/g, '_'),
//         email: signupData.email,
//         password: signupData.password,
//         role: 'admin'
//       };

//       const result = await register(payload);
//       if (result.success) {
//         toast.success('Account created! Please login.');
//         setTab('login');
//       } else {
//         console.error('Signup failed:', result);
//         toast.error(result?.error || 'Signup failed');
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       toast.error(err?.response?.data?.message || 'Signup error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <div className="flex justify-center mb-6 space-x-4">
//           <button
//             onClick={() => setTab('login')}
//             className={`px-4 py-2 font-medium rounded-lg ${tab === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setTab('signup')}
//             className={`px-4 py-2 font-medium rounded-lg ${tab === 'signup' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
//           >
//             Sign Up
//           </button>
//         </div>

//         {tab === 'login' ? (
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="user_name"
//                   value={loginData.user_name}
//                   onChange={(e) => handleInputChange(e, setLoginData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter username"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={loginData.password}
//                   onChange={(e) => handleInputChange(e, setLoginData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
//                   {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleSignup} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={signupData.name}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Your full name"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={signupData.email}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={signupData.password}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Create a password"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={signupData.confirmPassword}
//                   onChange={(e) => handleInputChange(e, setSignupData)}
//                   className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Repeat your password"
//                   required
//                 />
//               </div>
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             >
//               {loading ? 'Signing up...' : 'Sign Up'}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';  // Import your auth hook
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

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
  const { login } = useAuth();  // Get login from AuthContext

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      user_name: '',
      password: '',
      confirmPassword: '',
    });
    setErrorMessage('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        // Call login from context
        const result = await login({
          user_name: formData.user_name.trim(),
          password: formData.password,
        });

        if (result.success) {
          navigate('/dashboard');  // Redirect on successful login
        } else {
          setErrorMessage(result.error || 'Login failed');
        }
      } else {
        // Register flow (you can keep your axios register call here)
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          user_name: formData.user_name.trim(),
          password: formData.password,
        };

        // Example axios call for registration
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          // After registration, maybe auto switch to login or navigate
          setIsLogin(true);
          setErrorMessage('Registration successful. Please login.');
          setFormData({
            name: '',
            email: '',
            user_name: '',
            password: '',
            confirmPassword: '',
          });
        } else {
          setErrorMessage(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {errorMessage && (
          <div className="text-red-600 text-sm text-center mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-3 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-3 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block mb-1 font-medium">
              {isLogin ? 'Username' : 'Choose a Username'}
            </label>
            <input
              type="text"
              name="user_name"
              autoComplete="username"
              value={formData.user_name}
              onChange={handleChange}
              className="pl-3 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="relative">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {!isLogin && (
            <div className="relative">
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 pr-10 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg transition text-white ${
              loading
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={toggleForm}
            className="text-purple-600 hover:underline font-semibold"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
