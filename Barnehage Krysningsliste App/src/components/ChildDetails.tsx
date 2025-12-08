import { ArrowLeft, User, MessageSquare, Phone, Mail, Clock, Calendar, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { Child, useLanguage } from '../App';
import { useState } from 'react';

type ChildDetailsProps = {
  child: Child;
  onUpdateStatus: (status: Child['status']) => void;
  onUpdateChild: (child: Child) => void;
  onBack: () => void;
  isStaff: boolean;
  isAdmin?: boolean;
};

export function ChildDetails({ child, onUpdateStatus, onUpdateChild, onBack, isStaff, isAdmin = false }: ChildDetailsProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedChild, setEditedChild] = useState<Child>(child);
  const [staffNotes, setStaffNotes] = useState(child.notes || '');

  const statusOptions: { value: Child['status']; label: string; labelKey: string; color: string }[] = [
    { value: 'present', label: 'Tilstede', labelKey: 'present', color: 'bg-green-600 hover:bg-green-700' },
    { value: 'comingLater', label: 'Kommer senere', labelKey: 'comingLater', color: 'bg-amber-600 hover:bg-amber-700' },
    { value: 'pickedUp', label: 'Hentet', labelKey: 'pickedUp', color: 'bg-blue-600 hover:bg-blue-700' },
  ];

  const handleSave = () => {
    const updatedChild = { ...editedChild, notes: staffNotes };
    onUpdateChild(updatedChild);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedChild(child);
    setStaffNotes(child.notes || '');
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white px-6 py-6 shadow-sm">
        <button onClick={onBack} className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5" />
          {t('back')}
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-slate-800">{t('details')}</h1>
          {isStaff && isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              {t('editInfo')}
            </button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
              >
                <Save className="w-4 h-4" />
                {t('save')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white mb-4">
            <User className="w-12 h-12" />
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedChild.name}
              onChange={(e) => setEditedChild({ ...editedChild, name: e.target.value })}
              className="text-center w-full p-2 border-2 border-blue-400 rounded-lg"
            />
          ) : (
            <h2 className="text-slate-800">{child.name}</h2>
          )}
        </div>

        {child.parentNotes && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-700" />
              <h3 className="text-purple-900">{t('messageFromParent')}</h3>
            </div>
            <p className="text-slate-800 bg-white p-4 rounded-xl border border-purple-200">
              {child.parentNotes}
            </p>
          </div>
        )}

        {/* Child Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-800 mb-4">{t('childInfo')}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-slate-600">{t('birthDate')}</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedChild.birthDate}
                    onChange={(e) => setEditedChild({ ...editedChild, birthDate: e.target.value })}
                    className="w-full p-2 border-2 border-blue-400 rounded-lg mt-1"
                  />
                ) : (
                  <p className="text-slate-800">{child.birthDate}</p>
                )}
              </div>
            </div>
            {(child.allergies || isEditing) && (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <p className="text-slate-600">{t('allergies')}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedChild.allergies || ''}
                      onChange={(e) => setEditedChild({ ...editedChild, allergies: e.target.value })}
                      placeholder={t('allergies')}
                      className="w-full p-2 border-2 border-blue-400 rounded-lg mt-1"
                    />
                  ) : (
                    <p className="text-red-700">{child.allergies}</p>
                  )}
                </div>
              </div>
            )}
            {child.dropOffTime && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-slate-600">{t('dropOffTime')}</p>
                  <p className="text-slate-800">{child.dropOffTime}</p>
                </div>
              </div>
            )}
            {child.pickUpTime && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-slate-600">{t('pickUpTime')}</p>
                  <p className="text-slate-800">{child.pickUpTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information - Only for staff */}
        {isStaff && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-800 mb-4">{t('contactInfo')}</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-900 mb-3">{t('parent')} 1: {child.parent1.name}</p>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editedChild.parent1.name}
                        onChange={(e) => setEditedChild({ 
                          ...editedChild, 
                          parent1: { ...editedChild.parent1, name: e.target.value }
                        })}
                        placeholder={t('name')}
                        className="w-full p-2 border-2 border-blue-400 rounded-lg"
                      />
                      <input
                        type="tel"
                        value={editedChild.parent1.phone}
                        onChange={(e) => setEditedChild({ 
                          ...editedChild, 
                          parent1: { ...editedChild.parent1, phone: e.target.value }
                        })}
                        placeholder={t('phone')}
                        className="w-full p-2 border-2 border-blue-400 rounded-lg"
                      />
                      <input
                        type="email"
                        value={editedChild.parent1.email}
                        onChange={(e) => setEditedChild({ 
                          ...editedChild, 
                          parent1: { ...editedChild.parent1, email: e.target.value }
                        })}
                        placeholder={t('email')}
                        className="w-full p-2 border-2 border-blue-400 rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${child.parent1.phone}`} className="hover:text-blue-600">
                          {child.parent1.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${child.parent1.email}`} className="hover:text-blue-600">
                          {child.parent1.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {(child.parent2 || isEditing) && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-green-900 mb-3">{t('parent')} 2: {child.parent2?.name || ''}</p>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedChild.parent2?.name || ''}
                          onChange={(e) => setEditedChild({ 
                            ...editedChild, 
                            parent2: { 
                              name: e.target.value,
                              phone: editedChild.parent2?.phone || '',
                              email: editedChild.parent2?.email || ''
                            }
                          })}
                          placeholder={t('name')}
                          className="w-full p-2 border-2 border-green-400 rounded-lg"
                        />
                        <input
                          type="tel"
                          value={editedChild.parent2?.phone || ''}
                          onChange={(e) => setEditedChild({ 
                            ...editedChild, 
                            parent2: { 
                              name: editedChild.parent2?.name || '',
                              phone: e.target.value,
                              email: editedChild.parent2?.email || ''
                            }
                          })}
                          placeholder={t('phone')}
                          className="w-full p-2 border-2 border-green-400 rounded-lg"
                        />
                        <input
                          type="email"
                          value={editedChild.parent2?.email || ''}
                          onChange={(e) => setEditedChild({ 
                            ...editedChild, 
                            parent2: { 
                              name: editedChild.parent2?.name || '',
                              phone: editedChild.parent2?.phone || '',
                              email: e.target.value
                            }
                          })}
                          placeholder={t('email')}
                          className="w-full p-2 border-2 border-green-400 rounded-lg"
                        />
                      </div>
                    ) : child.parent2 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${child.parent2.phone}`} className="hover:text-green-600">
                            {child.parent2.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${child.parent2.email}`} className="hover:text-green-600">
                            {child.parent2.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-800 mb-4">{t('status')}</h3>
          <div className="space-y-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdateStatus(option.value)}
                disabled={isEditing}
                className={`w-full h-14 ${option.color} text-white rounded-xl transition-colors ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {isStaff && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-800">{t('staffNotes')}</h3>
              {!isEditing && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  {t('save')}
                </button>
              )}
            </div>
            <textarea
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
              placeholder={t('addNotes')}
              className="w-full h-32 p-4 bg-gray-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
