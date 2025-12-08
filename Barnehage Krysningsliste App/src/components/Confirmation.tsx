import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../App';

type ConfirmationProps = {
  onBack: () => void;
};

export function Confirmation({ onBack }: ConfirmationProps) {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-green-50 to-white">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-8">
          <CheckCircle2 className="w-20 h-20 text-green-600" />
        </div>
        
        <h1 className="text-slate-800 mb-3">{t('registered')}</h1>
        <p className="text-slate-600 mb-12">
          {t('statusUpdated')}
        </p>

        <button
          onClick={onBack}
          className="w-full max-w-xs h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors shadow-lg"
        >
          {t('backToList')}
        </button>
      </div>
    </div>
  );
}
