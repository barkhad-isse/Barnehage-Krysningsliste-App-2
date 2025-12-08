import { ArrowLeft, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { Department, Child, useLanguage } from '../App';

type AttendanceListProps = {
  department: Department;
  onSelectChild: (child: Child) => void;
  onBack: () => void;
};

export function AttendanceList({ department, onSelectChild, onBack }: AttendanceListProps) {
  const { t } = useLanguage();
  
  const getStatusBadge = (status: Child['status']) => {
    switch (status) {
      case 'present':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">{t('present')}</span>;
      case 'notArrived':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full">{t('notArrived')}</span>;
      case 'comingLater':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full">{t('comingLater')}</span>;
      case 'pickedUp':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{t('pickedUp')}</span>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white px-6 py-6 shadow-sm">
        <button onClick={onBack} className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5" />
          {t('back')}
        </button>
        <h1 className="text-slate-800">{department.name}</h1>
        <p className="text-slate-600 mt-1">
          {department.children.filter(c => c.status === 'present').length} {t('of')} {department.children.length} {t('present').toLowerCase()}
        </p>
      </div>

      <div className="flex-1 p-6 space-y-3 overflow-y-auto pb-24">
        {department.children.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-2xl p-5 shadow-sm relative"
          >
            {child.parentNotes && (
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <MessageSquare className="w-5 h-5 text-white" fill="currentColor" />
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                {child.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-slate-800">{child.name}</h3>
                <div className="mt-1">
                  {getStatusBadge(child.status)}
                </div>
                {child.dropOffTime && (
                  <div className="flex items-center gap-1 mt-2 text-slate-600">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{t('dropOffTime')}: {child.dropOffTime}</span>
                  </div>
                )}
                {child.pickUpTime && (
                  <div className="flex items-center gap-1 mt-1 text-slate-600">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{t('pickUpTime')}: {child.pickUpTime}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => onSelectChild(child)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('details')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
