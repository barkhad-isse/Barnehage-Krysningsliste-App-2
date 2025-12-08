import { useState, createContext, useContext } from 'react';
import { UserTypeSelection } from './components/UserTypeSelection';
import { LoginScreen } from './components/LoginScreen';
import { DepartmentList } from './components/DepartmentList';
import { AttendanceList } from './components/AttendanceList';
import { ChildDetails } from './components/ChildDetails';
import { ParentView } from './components/ParentView';
import { Confirmation } from './components/Confirmation';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';

export type Screen = 'userType' | 'login' | 'departments' | 'attendance' | 'childDetails' | 'parentView' | 'confirmation' | 'settings';
export type UserType = 'staff' | 'parent' | null;
export type Language = 'no' | 'en';

export type ParentContact = {
  name: string;
  phone: string;
  email: string;
};

export type Child = {
  id: number;
  name: string;
  birthDate: string;
  allergies?: string;
  status: 'present' | 'notArrived' | 'comingLater' | 'pickedUp';
  notes?: string;
  parentNotes?: string;
  parent1: ParentContact;
  parent2?: ParentContact;
  dropOffTime?: string;
  pickUpTime?: string;
};

export type Department = {
  id: number;
  name: string;
  children: Child[];
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  no: {
    departments: 'Avdelinger',
    selectDepartment: 'Velg en avdeling',
    logout: 'Logg ut',
    myChild: 'Mitt barn',
    checkInOut: 'Registrer inn- og utkryssing',
    present: 'Tilstede',
    notArrived: 'Ikke kommet',
    comingLater: 'Kommer senere',
    pickedUp: 'Hentet',
    checkIn: 'Kryss inn',
    checkOut: 'Kryss ut',
    sendMessage: 'Send beskjed til barnehagen',
    messagePlaceholder: "F.eks. 'Emma har vondt i halsen i dag' eller 'Husk solkrem'",
    send: 'Send beskjed',
    yourLastMessage: 'Din siste beskjed:',
    information: 'Informasjon',
    details: 'Detaljer',
    back: 'Tilbake',
    messageFromParent: 'Beskjed fra forelder',
    status: 'Status',
    staffNotes: 'Notater fra personalet',
    addNotes: 'Legg til notater her...',
    settings: 'Innstillinger',
    language: 'Språk',
    norwegian: 'Norsk',
    english: 'English',
    contactInfo: 'Kontaktinformasjon',
    parent: 'Forelder',
    phone: 'Telefon',
    email: 'E-post',
    childInfo: 'Barneinformasjon',
    birthDate: 'Fødselsdato',
    allergies: 'Allergier',
    dropOffTime: 'Levert',
    pickUpTime: 'Hentet',
    editInfo: 'Rediger informasjon',
    save: 'Lagre',
    cancel: 'Avbryt',
    name: 'Navn',
    registered: 'Registrert!',
    statusUpdated: 'Statusen er oppdatert',
    backToList: 'Tilbake til liste',
    of: 'av',
    staffLogin: 'Innlogging for ansatt',
    parentLogin: 'Innlogging for forelder',
    loginToContinue: 'Logg inn for å fortsette',
    password: 'Passord',
    login: 'Logg inn',
    loginAsAdmin: 'Logg inn som administrator',
    adminCanEdit: 'Administratorer kan redigere all barneinformasjon',
  },
  en: {
    departments: 'Departments',
    selectDepartment: 'Select a department',
    logout: 'Log out',
    myChild: 'My child',
    checkInOut: 'Register check-in and check-out',
    present: 'Present',
    notArrived: 'Not arrived',
    comingLater: 'Coming later',
    pickedUp: 'Picked up',
    checkIn: 'Check in',
    checkOut: 'Check out',
    sendMessage: 'Send message to kindergarten',
    messagePlaceholder: "E.g. 'Emma has a sore throat today' or 'Remember sunscreen'",
    send: 'Send message',
    yourLastMessage: 'Your last message:',
    information: 'Information',
    details: 'Details',
    back: 'Back',
    messageFromParent: 'Message from parent',
    status: 'Status',
    staffNotes: 'Staff notes',
    addNotes: 'Add notes here...',
    settings: 'Settings',
    language: 'Language',
    norwegian: 'Norsk',
    english: 'English',
    contactInfo: 'Contact information',
    parent: 'Parent',
    phone: 'Phone',
    email: 'Email',
    childInfo: 'Child information',
    birthDate: 'Birth date',
    allergies: 'Allergies',
    dropOffTime: 'Dropped off',
    pickUpTime: 'Picked up',
    editInfo: 'Edit information',
    save: 'Save',
    cancel: 'Cancel',
    name: 'Name',
    registered: 'Registered!',
    statusUpdated: 'Status has been updated',
    backToList: 'Back to list',
    of: 'of',
    staffLogin: 'Staff login',
    parentLogin: 'Parent login',
    loginToContinue: 'Log in to continue',
    password: 'Password',
    login: 'Log in',
    loginAsAdmin: 'Log in as administrator',
    adminCanEdit: 'Administrators can edit all child information',
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('userType');
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [language, setLanguage] = useState<Language>('no');
  const [isAdmin, setIsAdmin] = useState(false);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['no']] || key;
  };

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: 'Blåbær',
      children: [
        { 
          id: 1, 
          name: 'Emma Hansen', 
          birthDate: '2020-05-15',
          allergies: 'Nøtter',
          status: 'present',
          parent1: { name: 'Anne Hansen', phone: '+47 123 45 678', email: 'anne.hansen@email.com' },
          parent2: { name: 'Per Hansen', phone: '+47 234 56 789', email: 'per.hansen@email.com' },
          dropOffTime: '08:15',
        },
        { 
          id: 2, 
          name: 'Noah Andersen', 
          birthDate: '2021-03-22',
          status: 'notArrived',
          parent1: { name: 'Kari Andersen', phone: '+47 345 67 890', email: 'kari.andersen@email.com' },
        },
        { 
          id: 3, 
          name: 'Olivia Berg', 
          birthDate: '2020-11-08',
          allergies: 'Gluten',
          status: 'present',
          parent1: { name: 'Thomas Berg', phone: '+47 456 78 901', email: 'thomas.berg@email.com' },
          parent2: { name: 'Maria Berg', phone: '+47 567 89 012', email: 'maria.berg@email.com' },
          dropOffTime: '07:45',
        },
        { 
          id: 4, 
          name: 'Lucas Johansen', 
          birthDate: '2021-01-30',
          status: 'notArrived',
          parent1: { name: 'Lars Johansen', phone: '+47 678 90 123', email: 'lars.johansen@email.com' },
        },
        { 
          id: 5, 
          name: 'Sofie Nielsen', 
          birthDate: '2020-07-19',
          status: 'present',
          parent1: { name: 'Nina Nielsen', phone: '+47 789 01 234', email: 'nina.nielsen@email.com' },
          dropOffTime: '08:30',
        },
      ]
    },
    {
      id: 2,
      name: 'Jordbær',
      children: [
        { 
          id: 6, 
          name: 'William Larsen', 
          birthDate: '2019-12-05',
          status: 'present',
          parent1: { name: 'Ole Larsen', phone: '+47 890 12 345', email: 'ole.larsen@email.com' },
          dropOffTime: '08:00',
        },
        { 
          id: 7, 
          name: 'Ella Pedersen', 
          birthDate: '2020-09-14',
          status: 'notArrived',
          parent1: { name: 'Siri Pedersen', phone: '+47 901 23 456', email: 'siri.pedersen@email.com' },
        },
        { 
          id: 8, 
          name: 'Oliver Kristiansen', 
          birthDate: '2019-10-27',
          allergies: 'Laktose',
          status: 'present',
          parent1: { name: 'Jan Kristiansen', phone: '+47 012 34 567', email: 'jan.kristiansen@email.com' },
          dropOffTime: '07:50',
        },
      ]
    },
    {
      id: 3,
      name: 'Solstrålen',
      children: [
        { 
          id: 9, 
          name: 'Maja Olsen', 
          birthDate: '2019-06-11',
          status: 'present',
          parent1: { name: 'Eva Olsen', phone: '+47 123 45 679', email: 'eva.olsen@email.com' },
          dropOffTime: '08:20',
        },
        { 
          id: 10, 
          name: 'Filip Hermansen', 
          birthDate: '2020-02-18',
          status: 'notArrived',
          parent1: { name: 'Morten Hermansen', phone: '+47 234 56 780', email: 'morten.hermansen@email.com' },
        },
        { 
          id: 11, 
          name: 'Ingrid Svendsen', 
          birthDate: '2019-08-25',
          status: 'present',
          parent1: { name: 'Lise Svendsen', phone: '+47 345 67 891', email: 'lise.svendsen@email.com' },
          dropOffTime: '08:10',
        },
        { 
          id: 12, 
          name: 'Henrik Moen', 
          birthDate: '2020-04-03',
          status: 'notArrived',
          parent1: { name: 'Geir Moen', phone: '+47 456 78 902', email: 'geir.moen@email.com' },
        },
      ]
    }
  ]);

  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    setCurrentScreen('login');
  };

  const handleLogin = (adminStatus?: boolean) => {
    if (userType === 'staff') {
      setIsAdmin(adminStatus || false);
      setCurrentScreen('departments');
    } else if (userType === 'parent') {
      setIsAdmin(false);
      // For demo purposes, we'll show Emma Hansen as the parent's child
      const child = departments[0].children[0];
      setSelectedChild(child);
      setCurrentScreen('parentView');
    }
  };

  const handleSelectDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setCurrentScreen('attendance');
  };

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
    setCurrentScreen('childDetails');
  };

  const handleUpdateChildStatus = (status: Child['status']) => {
    const currentTime = new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
    
    if (selectedChild && selectedDepartment) {
      // Update in departments state
      const updatedDepartments = departments.map(dept => 
        dept.id === selectedDepartment.id 
          ? {
              ...dept,
              children: dept.children.map(child =>
                child.id === selectedChild.id 
                  ? { 
                      ...child, 
                      status,
                      dropOffTime: status === 'present' && !child.dropOffTime ? currentTime : child.dropOffTime,
                      pickUpTime: status === 'pickedUp' ? currentTime : child.pickUpTime,
                    } 
                  : child
              )
            }
          : dept
      );
      setDepartments(updatedDepartments);
      
      const updatedChildren = selectedDepartment.children.map(child =>
        child.id === selectedChild.id 
          ? { 
              ...child, 
              status,
              dropOffTime: status === 'present' && !child.dropOffTime ? currentTime : child.dropOffTime,
              pickUpTime: status === 'pickedUp' ? currentTime : child.pickUpTime,
            } 
          : child
      );
      setSelectedDepartment({ ...selectedDepartment, children: updatedChildren });
      setCurrentScreen('confirmation');
    } else if (selectedChild && userType === 'parent') {
      // Parent view - update child status in global departments
      const updatedDepartments = departments.map(dept => ({
        ...dept,
        children: dept.children.map(child =>
          child.id === selectedChild.id 
            ? { 
                ...child, 
                status,
                dropOffTime: status === 'present' && !child.dropOffTime ? currentTime : child.dropOffTime,
                pickUpTime: status === 'pickedUp' ? currentTime : child.pickUpTime,
              } 
            : child
        )
      }));
      setDepartments(updatedDepartments);
      setSelectedChild({ 
        ...selectedChild, 
        status,
        dropOffTime: status === 'present' && !selectedChild.dropOffTime ? currentTime : selectedChild.dropOffTime,
        pickUpTime: status === 'pickedUp' ? currentTime : selectedChild.pickUpTime,
      });
      setCurrentScreen('confirmation');
    }
  };

  const handleBackToList = () => {
    if (userType === 'parent') {
      setCurrentScreen('parentView');
    } else {
      setCurrentScreen('attendance');
    }
  };

  const handleBackToDepartments = () => {
    setCurrentScreen('departments');
    setSelectedDepartment(null);
  };

  const handleSendParentNote = (note: string) => {
    if (selectedChild && userType === 'parent') {
      // Update in global departments state
      const updatedDepartments = departments.map(dept => ({
        ...dept,
        children: dept.children.map(child =>
          child.id === selectedChild.id ? { ...child, parentNotes: note } : child
        )
      }));
      setDepartments(updatedDepartments);
      setSelectedChild({ ...selectedChild, parentNotes: note });
      setCurrentScreen('confirmation');
    }
  };

  const handleUpdateChild = (updatedChild: Child) => {
    const updatedDepartments = departments.map(dept => ({
      ...dept,
      children: dept.children.map(child =>
        child.id === updatedChild.id ? updatedChild : child
      )
    }));
    setDepartments(updatedDepartments);
    setSelectedChild(updatedChild);
    
    if (selectedDepartment) {
      const updatedChildren = selectedDepartment.children.map(child =>
        child.id === updatedChild.id ? updatedChild : child
      );
      setSelectedDepartment({ ...selectedDepartment, children: updatedChildren });
    }
  };

  const handleLogout = () => {
    setCurrentScreen('userType');
    setUserType(null);
    setSelectedDepartment(null);
    setSelectedChild(null);
    setIsAdmin(false);
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleCloseSettings = () => {
    if (userType === 'parent') {
      setCurrentScreen('parentView');
    } else {
      setCurrentScreen('departments');
    }
  };

  const handleBottomNavNavigate = (destination: 'home' | 'settings') => {
    if (destination === 'home') {
      if (userType === 'parent') {
        setCurrentScreen('parentView');
      } else {
        setCurrentScreen('departments');
        setSelectedDepartment(null);
        setSelectedChild(null);
      }
    } else if (destination === 'settings') {
      setCurrentScreen('settings');
    }
  };

  const showBottomNav = userType && currentScreen !== 'userType' && currentScreen !== 'login' && currentScreen !== 'confirmation';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-[390px] min-h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            {currentScreen === 'userType' && <UserTypeSelection onSelectUserType={handleSelectUserType} />}
            {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} userType={userType} />}
            {currentScreen === 'departments' && (
              <DepartmentList 
                departments={departments} 
                onSelectDepartment={handleSelectDepartment} 
                onLogout={handleLogout}
                onOpenSettings={handleOpenSettings}
              />
            )}
            {currentScreen === 'attendance' && selectedDepartment && (
              <AttendanceList 
                department={selectedDepartment} 
                onSelectChild={handleSelectChild}
                onBack={handleBackToDepartments}
              />
            )}
            {currentScreen === 'childDetails' && selectedChild && (
              <ChildDetails 
                child={selectedChild}
                onUpdateStatus={handleUpdateChildStatus}
                onUpdateChild={handleUpdateChild}
                onBack={handleBackToList}
                isStaff={userType === 'staff'}
                isAdmin={isAdmin}
              />
            )}
            {currentScreen === 'parentView' && selectedChild && (
              <ParentView 
                child={selectedChild}
                onUpdateStatus={handleUpdateChildStatus}
                onSendNote={handleSendParentNote}
                onLogout={handleLogout}
                onOpenSettings={handleOpenSettings}
              />
            )}
            {currentScreen === 'confirmation' && <Confirmation onBack={handleBackToList} />}
            {currentScreen === 'settings' && <Settings onClose={handleCloseSettings} />}
          </div>
          {showBottomNav && (
            <BottomNav 
              userType={userType} 
              currentScreen={currentScreen}
              onNavigate={handleBottomNavNavigate}
            />
          )}
        </div>
      </div>
    </LanguageContext.Provider>
  );
}
