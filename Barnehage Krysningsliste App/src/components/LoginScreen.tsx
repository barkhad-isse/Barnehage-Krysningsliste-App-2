import { Mail, Lock, Users, User } from 'lucide-react';
import { UserType, useLanguage } from '../App';

type LoginScreenProps = {
  onLogin: (isAdmin?: boolean) => void;
  userType: UserType;
};

export function LoginScreen({ onLogin, userType }: LoginScreenProps) {
  const isStaff = userType === 'staff';
  const { t } = useLanguage();
  
  const handleLogin = () => {
    onLogin();
  };

  return (
    <div className="h-full flex flex-col justify-between p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${isStaff ? 'bg-blue-100' : 'bg-purple-100'} rounded-full mb-6`}>
            {isStaff ? (
              <Users className="w-10 h-10 text-blue-600" />
            ) : (
              <User className="w-10 h-10 text-purple-600" />
            )}
          </div>
          <h1 className="text-slate-800 mb-2">
            {isStaff ? t('staffLogin') : t('parentLogin')}
          </h1>
          <p className="text-slate-600">{t('loginToContinue')}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-slate-700 mb-2">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                id="email"
                placeholder="din@barnehage.no"
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-slate-700 mb-2">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogin}
        className={`w-full h-14 ${isStaff ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-2xl transition-colors shadow-lg`}
      >
        {t('login')}
      </button>
    </div>
  );
}