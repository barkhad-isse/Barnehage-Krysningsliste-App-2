import { User, LogIn, LogOut, Clock, MessageSquare, Send, Settings as SettingsIcon } from 'lucide-react';
import { Child, useLanguage } from '../App';
import { useState } from 'react';

type ParentViewProps = {
  child: Child;
  onUpdateStatus: (status: Child['status']) => void;
  onSendNote: (note: string) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
};

export function ParentView({ child, onUpdateStatus, onSendNote, onLogout, onOpenSettings }: ParentViewProps) {
  const { t } = useLanguage();
  const isCheckedIn = child.status === 'present';
  const [noteText, setNoteText] = useState('');

  const handleSendNote = () => {
    if (noteText.trim()) {
      onSendNote(noteText);
      setNoteText('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white px-6 py-8 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-slate-800">{t('myChild')}</h1>
          <div className="flex gap-2">
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-slate-600 mt-1">{t('checkInOut')}</p>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg">
            <User className="w-16 h-16" />
          </div>
          <h2 className="text-slate-800 mb-3">{child.name}</h2>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full mb-8">
            {isCheckedIn ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-slate-700">{t('present')} {child.dropOffTime && `(${child.dropOffTime})`}</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-slate-400 rounded-full" />
                <span className="text-slate-700">{t('notArrived')}</span>
              </>
            )}
          </div>

          <div className="space-y-3">
            {!isCheckedIn ? (
              <button
                onClick={() => onUpdateStatus('present')}
                className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-colors shadow-md flex items-center justify-center gap-3"
              >
                <LogIn className="w-6 h-6" />
                <span>{t('checkIn')}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onUpdateStatus('pickedUp')}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors shadow-md flex items-center justify-center gap-3"
                >
                  <LogOut className="w-6 h-6" />
                  <span>{t('checkOut')}</span>
                </button>
                <button
                  onClick={() => onUpdateStatus('comingLater')}
                  className="w-full h-14 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  <span>{t('comingLater')}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <h3 className="text-slate-800">{t('sendMessage')}</h3>
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t('messagePlaceholder')}
            className="w-full h-32 p-4 bg-gray-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none mb-3"
          />
          <button
            onClick={handleSendNote}
            disabled={!noteText.trim()}
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {t('send')}
          </button>
          {child.parentNotes && (
            <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-slate-600">
                <strong className="text-purple-700">{t('yourLastMessage')}</strong>
              </p>
              <p className="text-slate-700 mt-1">{child.parentNotes}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-800 mb-3">{t('information')}</h3>
          <div className="space-y-2 text-slate-600">
            <p>• {t('information')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}