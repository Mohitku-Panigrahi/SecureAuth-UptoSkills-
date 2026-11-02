import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../components/Notification';

export const OtpVerificationPage = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { pendingEmail, savePendingEmail, login } = useAuth();

  const email = location.state?.email || pendingEmail || '';

  useEffect(() => {
    if (location.state?.notice) {
      setSuccess(location.state.notice);
    }
    if (location.state?.warning) {
      setError(location.state.warning);
    }
  }, [location.state]);

  // Cooldown timer
  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const handleChange = (index, value) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto advance focus
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setDigits(newDigits);

    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fullOtp = digits.join('');

    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    if (!email) {
      setError('Missing email address. Please return to registration or login.');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.verifyEmail({ email, otp: fullOtp });
      if (res.data?.success && res.data?.user) {
        setSuccess('Email verified successfully! Entering your workspace...');
        login(res.data.user);
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending || !email) return;

    setError('');
    setSuccess('');
    setResending(true);

    try {
      const res = await authApi.resendOtp({ email, purpose: 'REGISTRATION' });
      if (res.data?.success) {
        setSuccess(res.data.message || 'A fresh verification code has been dispatched.');
        if (res.data.warning) {
          setError(res.data.warning);
        }
        setCountdown(60);
        setCanResend(false);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  const formatSeconds = (sec) => {
    const s = sec < 10 ? `0${sec}` : sec;
    return `00:${s}`;
  };

  return (
    <div className="min-h-screen bg-peach-glow text-gray-800 flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans relative overflow-x-hidden selection:bg-brand-200 selection:text-brand-700">
      <div className="fixed -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#f8be9a]/40 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-12 right-20 w-80 h-80 rounded-full bg-[#fedcc5]/60 blur-2xl pointer-events-none -z-10"></div>

      <main className="w-full max-w-4xl glass-backdrop-panel rounded-[36px] sm:rounded-[48px] p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden my-auto">
        <div className="relative w-full max-w-xl mx-auto bg-surface-container/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 text-on-surface">
          
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container shadow-sm">
                <span className="material-symbols-outlined text-[22px]">shield_lock</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-base text-on-surface tracking-tight leading-none font-bold">SecureAuth</span>
                <span className="font-code-mono text-[11px] text-outline tracking-wider uppercase mt-1">Guard Core v4.2</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              <span className="font-code-mono text-[11px] text-tertiary tracking-widest uppercase font-semibold">256-BIT ENCRYPTED</span>
            </div>
          </div>

          {/* Icon & Title */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-container/25 via-primary/20 to-tertiary/10 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[32px] text-primary-container">mark_email_read</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[14px] text-tertiary">lock_reset</span>
              </div>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-2">Verify Your Email</h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              We've dispatched an authentication security token to your mailbox.
            </p>

            <div className="mt-3.5 inline-flex items-center flex-wrap justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-lowest shadow-sm border border-white/5">
              <span className="font-code-mono text-xs text-on-surface font-semibold select-all">
                {email || 'no-email-provided'}
              </span>
              <span className="text-outline text-xs">•</span>
              <Link to="/register" className="font-label-md text-xs text-primary hover:text-primary-container transition-colors">
                Change email
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <Notification type="error" message={error} onClose={() => setError('')} />
            </div>
          )}

          {success && (
            <div className="mb-6">
              <Notification type="success" message={success} onClose={() => setSuccess('')} />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="font-label-md text-xs text-on-surface-variant tracking-wide font-medium">Security Verification Code</label>
                <div className="inline-flex items-center gap-1.5 text-outline">
                  <span className="material-symbols-outlined text-[15px]">content_paste</span>
                  <span className="font-body-sm text-xs">Auto-paste ready</span>
                </div>
              </div>

              {/* 6 Digit Inputs */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3.5" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <div key={idx} className="relative">
                    <input
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-full h-14 sm:h-16 text-center font-code-mono text-xl sm:text-2xl font-bold text-on-surface bg-surface-container-lowest rounded-xl shadow-inner border border-white/5 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                    />
                    <div className={`absolute bottom-1.5 left-3 right-3 h-0.5 rounded-full ${digit ? 'bg-primary-container' : 'bg-surface-variant'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-primary-container hover:bg-orange-600 text-white font-semibold text-sm sm:text-base shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i> Validating Code...
                </span>
              ) : (
                <>
                  <span>Verify Email</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                </>
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-center sm:text-left">
              <div className="font-body-sm text-xs text-outline flex items-center gap-1.5">
                <span>Didn't receive the code?</span>
                {!canResend ? (
                  <span className="font-code-mono text-primary font-medium">
                    Resend in <span>{formatSeconds(countdown)}</span>
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    type="button"
                    className="font-label-md text-xs text-primary hover:text-primary-container transition-colors font-semibold cursor-pointer"
                  >
                    {resending ? 'Sending...' : 'Resend code'}
                  </button>
                )}
              </div>

              <Link to="/login" className="font-label-md text-xs text-tertiary hover:underline">
                Use password instead
              </Link>
            </div>
          </form>

          {/* Security Notice Details */}
          <div className="mt-8 pt-6 bg-surface-container-low rounded-2xl p-4 shadow-sm space-y-2.5 border border-white/5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">timer</span>
              <p className="font-body-sm text-xs text-on-surface-variant">
                One-time security passwords expire in <span className="text-on-surface font-semibold">5 minutes</span> post-dispatch.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">mark_email_unread</span>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Spam and promotions tabs may capture priority validation dispatches inadvertently.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 font-label-md text-xs text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Sign in</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-outline font-body-sm text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            Zero-Knowledge Layer
          </span>
          <span>•</span>
          <span>SOC2 Type II Ready</span>
          <span>•</span>
          <span>SHA-256 HMAC Encrypted</span>
        </div>
      </main>
    </div>
  );
};
