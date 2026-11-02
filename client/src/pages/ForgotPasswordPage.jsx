import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { Notification } from '../components/Notification';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await authApi.forgotPassword({ email });
      if (res.data?.success) {
        setInfo(res.data.message || 'Recovery code dispatched.');
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit recovery code.');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.verifyResetOtp({ email, otp });
      if (res.data?.success) {
        setInfo(res.data.message || 'Code verified. Set a new password.');
        setStep(3);
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired recovery code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.resetPassword({
        email,
        otp,
        newPassword,
        confirmNewPassword
      });

      if (res.data?.success) {
        setStep(4);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const stepsMetadata = [
    { num: 1, title: 'Identity Dispatch', desc: 'Enter registered enterprise email' },
    { num: 2, title: 'Token Verification', desc: 'Enter 6-digit recovery token' },
    { num: 3, title: 'Key Overwrite', desc: 'Enter new cryptographic password' },
    { num: 4, title: 'Protocol Complete', desc: 'Authentication access restored' }
  ];

  return (
    <div className="min-h-screen bg-peach-glow text-gray-800 flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans relative overflow-x-hidden selection:bg-brand-200 selection:text-brand-700">
      <div className="fixed -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#f8be9a]/40 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-12 right-20 w-80 h-80 rounded-full bg-[#fedcc5]/60 blur-2xl pointer-events-none -z-10"></div>

      <main className="w-full max-w-5xl glass-backdrop-panel rounded-[36px] sm:rounded-[48px] p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden my-auto">
        <div className="relative w-full overflow-hidden rounded-[32px] bg-surface-container-low/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl border border-white/10 text-on-surface">
          
          <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
            
            {/* Left Column: Trust Architecture & Progression Stepper */}
            <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 self-start bg-surface-container px-3.5 py-1.5 rounded-full border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span className="font-label-sm text-[11px] text-tertiary uppercase tracking-wider font-semibold">256-Bit Encrypted Recovery</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-md text-white">
                    <span className="material-symbols-outlined text-xl">lock_reset</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest block">SecureAuth Guard</span>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface tracking-tight">Identity Vault</h2>
                  </div>
                </div>

                <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-2">
                  Reset Account Credentials
                </h1>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Follow the zero-trust recovery workflow to safely authenticate and overwrite your encrypted account access key.
                </p>
              </div>

              {/* 4-Step Stepper Timeline */}
              <div className="p-4 rounded-2xl bg-surface-container/60 backdrop-blur-md border border-white/5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="font-label-sm text-xs text-primary uppercase font-semibold tracking-wider">Authentication Protocol</span>
                  <span className="font-code-mono text-xs text-on-surface-variant">Phase 0{step} / 04</span>
                </div>

                <div className="space-y-2">
                  {stepsMetadata.map((s) => {
                    const isCurrent = step === s.num;
                    const isDone = step > s.num;
                    return (
                      <div
                        key={s.num}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-surface-container-high/90 shadow-sm border border-primary/30'
                            : 'opacity-70'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-code-mono text-xs font-bold ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-primary-container text-white'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          {isDone ? '✓' : s.num}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold ${isCurrent ? 'text-on-surface' : 'text-on-surface-variant'}`}>{s.title}</p>
                          <p className="text-[11px] text-on-surface-variant/70 truncate">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Step Forms */}
            <div className="w-full lg:w-7/12 flex flex-col justify-center bg-surface-container/70 rounded-2xl p-6 sm:p-8 border border-white/5">
              
              {error && (
                <div className="mb-5">
                  <Notification type="error" message={error} onClose={() => setError('')} />
                </div>
              )}

              {info && (
                <div className="mb-5">
                  <Notification type="info" message={info} onClose={() => setInfo('')} />
                </div>
              )}

              {/* STEP 1: Email Input */}
              {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Step 1: Enter Your Email</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      We'll check your account status and dispatch a single-use verification token.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="resetEmail">Email Address</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">mail</span>
                      <input
                        id="resetEmail"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="username@gmail.com"
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 outline-none border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary-container hover:bg-orange-600 text-white font-semibold rounded-xl shadow-btn hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> Generating Token...</span>
                    ) : (
                      <>
                        <span>Send Recovery Code</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: OTP Verification */}
              {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Step 2: Enter Verification Code</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Enter the 6-digit security code sent to <span className="font-semibold text-primary">{email}</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="recoveryOtp">6-Digit Code</label>
                    <input
                      id="recoveryOtp"
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="842091"
                      className="w-full h-12 text-center font-code-mono text-2xl tracking-widest font-bold rounded-xl bg-surface-container-highest text-on-surface border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-outline hover:text-on-surface underline transition-colors cursor-pointer"
                    >
                      Change email
                    </button>
                    <button
                      type="button"
                      onClick={handleEmailSubmit}
                      disabled={loading}
                      className="text-primary hover:text-primary-container font-medium cursor-pointer"
                    >
                      Resend code
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary-container hover:bg-orange-600 text-white font-semibold rounded-xl shadow-btn hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> Verifying Code...</span>
                    ) : (
                      <>
                        <span>Validate Code</span>
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 3: Enter New Password */}
              {step === 3 && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Step 3: Set New Password</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Choose a secure new passphrase to update your account credential hash.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="newPassword">New Password</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">lock</span>
                      <input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 chars, 1 uppercase, 1 digit"
                        className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 outline-none border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-on-surface-variant hover:text-on-surface transition-colors p-1"
                      >
                        <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-xs`}></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" htmlFor="confirmNewPassword">Confirm New Password</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">verified_user</span>
                      <input
                        id="confirmNewPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-highest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 outline-none border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary-container hover:bg-orange-600 text-white font-semibold rounded-xl shadow-btn hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70 mt-2"
                  >
                    {loading ? (
                      <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> Overwriting Password Hash...</span>
                    ) : (
                      <>
                        <span>Reset Password & Complete</span>
                        <span className="material-symbols-outlined text-[18px]">key</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 4: Success Completion */}
              {step === 4 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                    <span className="material-symbols-outlined text-[36px]">check_circle</span>
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface">Password Reset Successful!</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                    Your password hash has been cryptographically updated in MongoDB and previous recovery tokens have been invalidated.
                  </p>
                  <div className="pt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-container hover:bg-orange-600 text-white font-semibold rounded-xl shadow-btn transition-all text-sm"
                    >
                      <span>Proceed to Login</span>
                      <span className="material-symbols-outlined text-[18px]">login</span>
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-xs text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Return to Sign In</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
