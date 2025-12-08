import { ArrowLeft, Globe } from 'lucide-react';
import { useLanguage } from '../App';
import type { Language } from '../App';

type SettingsProps = {
  onClose: () => void;
};

export function Settings({ onClose }: SettingsProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white px-6 py-6 shadow-sm">
        <button onClick={onClose} className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5" />
          {t('back')}
        </button>
        <h1 className="text-slate-800">{t('settings')}</h1>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <h3 className="text-slate-800">{t('language')}</h3>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setLanguage('no')}
              className={`w-full h-14 rounded-xl transition-colors flex items-center justify-center ${
                language === 'no' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t('norwegian')}
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`w-full h-14 rounded-xl transition-colors flex items-center justify-center ${
                language === 'en' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t('english')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-800 mb-3">{t('information')}</h3>
          <div className="space-y-2 text-slate-600">
            <p>• Barnehage Krysningsliste v1.0</p>
            <p>• {language === 'no' ? 'Designet for mobilbruk' : 'Designed for mobile use'}</p>
            <p>• {language === 'no' ? 'Enkel kryssing for foreldre og ansatte' : 'Easy check-in for parents and staff'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
