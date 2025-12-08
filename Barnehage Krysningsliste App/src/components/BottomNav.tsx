import { Home, Settings as SettingsIcon, User, Users } from 'lucide-react';
import { useLanguage } from '../App';

type BottomNavProps = {
  userType: 'staff' | 'parent';
  currentScreen: string;
  onNavigate: (destination: 'home' | 'settings') => void;
};

export function BottomNav({ userType, currentScreen, onNavigate }: BottomNavProps) {
  const { t } = useLanguage();

  const isActive = (screen: string) => {
    if (screen === 'home') {
      return userType === 'staff' 
        ? currentScreen === 'departments' || currentScreen === 'attendance'
        : currentScreen === 'parentView';
    }
    return currentScreen === screen;
  };

  return (
    <div className="bg-white border-t border-slate-200 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
            isActive('home')
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          {userType === 'staff' ? (
            <Users className="w-6 h-6" />
          ) : (
            <User className="w-6 h-6" />
          )}
          <span className="text-xs">
            {userType === 'staff' ? t('departments') : t('myChild')}
          </span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
            isActive('settings')
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <SettingsIcon className="w-6 h-6" />
          <span className="text-xs">{t('settings')}</span>
        </button>
      </div>
    </div>
  );
}
