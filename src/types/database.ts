export type Level = 'AL' | 'OL';
export type Stream = 'Science' | 'Arts' | 'Commerce' | 'Technology';
export type MaterialCategory = 'Past Paper' | 'Note' | 'Textbook';
export type SessionType = 'Live' | 'Recording';
export type Language = 'Sinhala' | 'Tamil' | 'English';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

// UI Language for the website
export type UILanguage = 'en' | 'si' | 'ta';

export interface Material {
  id: string;
  title: string;
  description: string;
  url: string;
  category: MaterialCategory;
  level: Level;
  stream: Stream;
  subject: string;
  language: Language;
  contributor_id: string | null;
  contributor_name: string | null;
  is_anonymous: boolean;
  status: ApprovalStatus;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  url: string;
  session_type: SessionType;
  level: Level;
  stream: Stream;
  subject: string;
  language: Language;
  session_date: string | null;
  start_time: string | null;
  end_time: string | null;
  contributor_id: string | null;
  contributor_name: string | null;
  is_anonymous: boolean;
  status: ApprovalStatus;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contributor {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  stream: Stream;
  level: Level;
}

// Constants for filter options
export const LEVELS: Level[] = ['AL', 'OL'];

export const STREAMS: Record<Level, Stream[]> = {
  AL: ['Science', 'Arts', 'Commerce', 'Technology'],
  OL: ['Science', 'Arts', 'Commerce', 'Technology'],
};

export const SUBJECTS: Record<Stream, string[]> = {
  Science: ['Physics', 'Chemistry', 'Biology', 'Combined Mathematics', 'ICT', 'Mathematics', 'Science'],
  Arts: ['History', 'Geography', 'Political Science', 'Economics', 'Sinhala', 'Tamil', 'English Literature', 'English', 'Civic Education', 'Buddhism'],
  Commerce: ['Accounting', 'Business Studies', 'Economics', 'ICT', 'Commerce'],
  Technology: ['Engineering Technology', 'Bio Systems Technology', 'Science for Technology', 'ICT'],
};

export const LANGUAGES: Language[] = ['Sinhala', 'Tamil', 'English'];

export const MATERIAL_CATEGORIES: MaterialCategory[] = ['Past Paper', 'Note', 'Textbook','Model Paper'];
export const SESSION_TYPES: SessionType[] = ['Live', 'Recording'];

// UI Translations
export const translations: Record<UILanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.materials': 'Materials',
    'nav.sessions': 'Sessions',
    'nav.about': 'About',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Contributor Login',
    'nav.logout': 'Sign Out',
    'nav.submit': 'Submit Resource',
    
    // Home page
    'home.title': 'Learn Without Limits',
    'home.subtitle': 'Access free educational resources for A/L and O/L students. Past papers, notes, textbooks, and live sessions - all in one place.',
    'home.browse_materials': 'Browse Materials',
    'home.view_sessions': 'View Sessions',
    'home.features_title': 'Everything You Need to Succeed',
    'home.features_subtitle': 'Our platform provides comprehensive educational resources for Sri Lankan students',
    
    // Features
    'feature.past_papers': 'Past Papers',
    'feature.past_papers_desc': 'Access previous years\' exam papers with marking schemes for thorough exam preparation.',
    'feature.notes': 'Notes & Textbooks',
    'feature.notes_desc': 'Comprehensive study notes and textbook PDFs organized by subject and stream.',
    'feature.sessions': 'Video Sessions',
    'feature.sessions_desc': 'Live classes and recorded lessons from experienced educators across all subjects.',
    'feature.languages': 'Multiple Languages',
    'feature.languages_desc': 'Resources available in Sinhala, Tamil, and English to suit your preferred medium.',
    'feature.streams': 'All Streams Covered',
    'feature.streams_desc': 'Science, Arts, Commerce, and Technology streams for both A/L and O/L students.',
    'feature.free': '100% Free',
    'feature.free_desc': 'All resources are completely free. No hidden charges, no premium tiers.',
    
    // Filters
    'filter.title': 'Filters',
    'filter.level': 'Level',
    'filter.stream': 'Stream',
    'filter.subject': 'Subject',
    'filter.medium': 'Medium',
    'filter.type': 'Type',
    'filter.all': 'All',
    'filter.all_streams': 'All Streams',
    'filter.all_subjects': 'All Subjects',
    'filter.all_languages': 'All Languages',
    'filter.clear': 'Clear All Filters',
    
    // Materials page
    'materials.title': 'Learning Materials',
    'materials.subtitle': 'Browse past papers, notes, and textbooks for A/L and O/L students',
    'materials.search': 'Search materials...',
    'materials.showing': 'Showing {count} resource{s}',
    'materials.no_results': 'No materials found',
    'materials.no_results_hint': 'Try adjusting your filters or search query',
    
    // Sessions page
    'sessions.title': 'Learning Sessions',
    'sessions.subtitle': 'Join live classes or watch recorded video lessons',
    'sessions.search': 'Search sessions...',
    'sessions.showing': 'Showing {count} session{s}',
    'sessions.no_results': 'No sessions found',
    'sessions.no_results_hint': 'Try adjusting your filters or search query',
    'sessions.live': 'Live',
    'sessions.recording': 'Recording',
    'sessions.starts_at': 'Starts at',
    'sessions.ends_at': 'Ends at',
    'sessions.date': 'Date',
    
    // Submit page
    'submit.title': 'Submit Resource',
    'submit.subtitle': 'Share educational materials or session links',
    'submit.type': 'Resource Type',
    'submit.material': 'Material (Paper/Note/Book)',
    'submit.session': 'Session (Live/Recording)',
    'submit.category': 'Category',
    'submit.title_field': 'Title',
    'submit.title_placeholder': 'e.g., A/L Physics 2023 Past Paper',
    'submit.description': 'Description',
    'submit.description_placeholder': 'Brief description of the resource...',
    'submit.url': 'URL / Link',
    'submit.url_hint_material': 'Link to PDF, Google Drive, or other file hosting',
    'submit.url_hint_session': 'Zoom/Teams meeting link or YouTube video URL',
    'submit.date': 'Session Date',
    'submit.start_time': 'Start Time',
    'submit.end_time': 'End Time',
    'submit.anonymous': 'Submit anonymously',
    'submit.anonymous_hint': 'Anonymous submissions require manual approval',
    'submit.button': 'Submit Resource',
    'submit.submitting': 'Submitting...',
    'submit.success': 'Resource submitted successfully!',
    'submit.success_pending': 'Your submission is pending approval.',
    'submit.success_approved': 'Your resource is now live.',
    'submit.error': 'Failed to submit resource',
    
    // Dashboard
    'dashboard.welcome': 'Welcome, {name}',
    'dashboard.subtitle': 'Manage your educational resources',
    'dashboard.total': 'Total Resources',
    'dashboard.materials': 'Materials',
    'dashboard.sessions_count': 'Sessions',
    'dashboard.pending': 'Pending Approval',
    'dashboard.add_new': 'Add New Resource',
    'dashboard.add_new_desc': 'Share a new paper, note, or session',
    'dashboard.manage': 'Manage Resources',
    'dashboard.manage_desc': 'Edit or delete your resources',
    
    // About page
    'about.title': 'About EduSupport',
    'about.subtitle': 'Empowering Sri Lankan students with free, accessible educational resources',
    'about.mission_title': 'Our Mission',
    'about.mission_text': 'EduSupport was created with a simple mission: to make quality educational resources accessible to every student in Sri Lanka, regardless of their location or economic background.',
    'about.values_title': 'Our Values',
    
    // Common
    'common.open': 'Open',
    'common.join': 'Join',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Error',
  },
  si: {
    // Navigation
    'nav.home': 'මුල් පිටුව',
    'nav.materials': 'අධ්‍යයන ද්‍රව්‍ය',
    'nav.sessions': 'පන්ති',
    'nav.about': 'අප ගැන',
    'nav.dashboard': 'පාලක පුවරුව',
    'nav.login': 'දායක පිවිසුම',
    'nav.logout': 'පිටවීම',
    'nav.submit': 'සම්පත් ඉදිරිපත් කරන්න',
    
    // Home page
    'home.title': 'සීමාවකින් තොරව ඉගෙන ගන්න',
    'home.subtitle': 'උසස් පෙළ සහ සාමාන්‍ය පෙළ සිසුන් සඳහා නොමිලේ අධ්‍යාපනික සම්පත්. පසුගිය ප්‍රශ්න පත්‍ර, සටහන්, පෙළ පොත් සහ සජීවී පන්ති - සියල්ල එක තැනක.',
    'home.browse_materials': 'අධ්‍යයන ද්‍රව්‍ය බලන්න',
    'home.view_sessions': 'පන්ති බලන්න',
    'home.features_title': 'ඔබේ සාර්ථකත්වයට අවශ්‍ය සියල්ල',
    'home.features_subtitle': 'අපගේ වේදිකාව ශ්‍රී ලාංකික සිසුන් සඳහා සම්පූර්ණ අධ්‍යාපනික සම්පත් සපයයි',
    
    // Features
    'feature.past_papers': 'පසුගිය ප්‍රශ්න පත්‍ර',
    'feature.past_papers_desc': 'සම්පූර්ණ විභාග සූදානමක් සඳහා ලකුණු ක්‍රම සමඟ පසුගිය වසරවල විභාග ප්‍රශ්න පත්‍ර.',
    'feature.notes': 'සටහන් සහ පෙළ පොත්',
    'feature.notes_desc': 'විෂය සහ ධාරාව අනුව සංවිධානය කළ සම්පූර්ණ අධ්‍යයන සටහන් සහ පෙළ පොත් PDF.',
    'feature.sessions': 'වීඩියෝ පන්ති',
    'feature.sessions_desc': 'සියලුම විෂයන් හරහා පළපුරුදු ගුරුවරුන්ගෙන් සජීවී පන්ති සහ පටිගත කළ පාඩම්.',
    'feature.languages': 'බහු භාෂා',
    'feature.languages_desc': 'සිංහල, දෙමළ සහ ඉංග්‍රීසි යන භාෂාවලින් සම්පත් ලබා ගත හැකිය.',
    'feature.streams': 'සියලුම ධාරාවන්',
    'feature.streams_desc': 'උසස් පෙළ සහ සාමාන්‍ය පෙළ සිසුන් සඳහා විද්‍යා, කලා, වාණිජ සහ තාක්ෂණ ධාරාවන්.',
    'feature.free': '100% නොමිලේ',
    'feature.free_desc': 'සියලුම සම්පත් සම්පූර්ණයෙන්ම නොමිලේ. සැඟවුණු ගාස්තු නැත.',
    
    // Filters
    'filter.title': 'පෙරහන්',
    'filter.level': 'මට්ටම',
    'filter.stream': 'ධාරාව',
    'filter.subject': 'විෂය',
    'filter.medium': 'මාධ්‍යය',
    'filter.type': 'වර්ගය',
    'filter.all': 'සියල්ල',
    'filter.all_streams': 'සියලුම ධාරාවන්',
    'filter.all_subjects': 'සියලුම විෂයන්',
    'filter.all_languages': 'සියලුම භාෂා',
    'filter.clear': 'සියලුම පෙරහන් ඉවත් කරන්න',
    
    // Materials page
    'materials.title': 'අධ්‍යයන ද්‍රව්‍ය',
    'materials.subtitle': 'උසස් පෙළ සහ සාමාන්‍ය පෙළ සිසුන් සඳහා පසුගිය ප්‍රශ්න පත්‍ර, සටහන් සහ පෙළ පොත් බලන්න',
    'materials.search': 'ද්‍රව්‍ය සොයන්න...',
    'materials.showing': 'සම්පත් {count}ක් පෙන්වයි',
    'materials.no_results': 'ද්‍රව්‍ය හමු නොවීය',
    'materials.no_results_hint': 'ඔබේ පෙරහන් හෝ සෙවුම් විමසුම වෙනස් කර බලන්න',
    
    // Sessions page
    'sessions.title': 'පන්ති',
    'sessions.subtitle': 'සජීවී පන්තිවලට සම්බන්ධ වන්න හෝ පටිගත කළ වීඩියෝ පාඩම් නරඹන්න',
    'sessions.search': 'පන්ති සොයන්න...',
    'sessions.showing': 'පන්ති {count}ක් පෙන්වයි',
    'sessions.no_results': 'පන්ති හමු නොවීය',
    'sessions.no_results_hint': 'ඔබේ පෙරහන් හෝ සෙවුම් විමසුම වෙනස් කර බලන්න',
    'sessions.live': 'සජීවී',
    'sessions.recording': 'පටිගත කිරීම',
    'sessions.starts_at': 'ආරම්භය',
    'sessions.ends_at': 'අවසානය',
    'sessions.date': 'දිනය',
    
    // Submit page
    'submit.title': 'සම්පත් ඉදිරිපත් කරන්න',
    'submit.subtitle': 'අධ්‍යාපනික ද්‍රව්‍ය හෝ පන්ති සබැඳි බෙදාගන්න',
    'submit.type': 'සම්පත් වර්ගය',
    'submit.material': 'ද්‍රව්‍ය (ප්‍රශ්න පත්‍ර/සටහන්/පොත්)',
    'submit.session': 'පන්තිය (සජීවී/පටිගත)',
    'submit.category': 'ප්‍රවර්ගය',
    'submit.title_field': 'මාතෘකාව',
    'submit.title_placeholder': 'උදා: උසස් පෙළ භෞතික විද්‍යාව 2023 ප්‍රශ්න පත්‍රය',
    'submit.description': 'විස්තරය',
    'submit.description_placeholder': 'සම්පතේ කෙටි විස්තරයක්...',
    'submit.url': 'URL / සබැඳිය',
    'submit.url_hint_material': 'PDF, Google Drive, හෝ වෙනත් ගොනු සත්කාරකයට සබැඳිය',
    'submit.url_hint_session': 'Zoom/Teams රැස්වීම් සබැඳිය හෝ YouTube වීඩියෝ URL',
    'submit.date': 'පන්ති දිනය',
    'submit.start_time': 'ආරම්භක වේලාව',
    'submit.end_time': 'අවසාන වේලාව',
    'submit.anonymous': 'නිර්නාමිකව ඉදිරිපත් කරන්න',
    'submit.anonymous_hint': 'නිර්නාමික ඉදිරිපත් කිරීම් සඳහා අතින් අනුමැතිය අවශ්‍යයි',
    'submit.button': 'සම්පත් ඉදිරිපත් කරන්න',
    'submit.submitting': 'ඉදිරිපත් කරමින්...',
    'submit.success': 'සම්පත් සාර්ථකව ඉදිරිපත් කරන ලදී!',
    'submit.success_pending': 'ඔබේ ඉදිරිපත් කිරීම අනුමැතිය බලාපොරොත්තුවෙන් සිටී.',
    'submit.success_approved': 'ඔබේ සම්පත දැන් සජීවීව ඇත.',
    'submit.error': 'සම්පත් ඉදිරිපත් කිරීමට අසමත් විය',
    
    // Dashboard
    'dashboard.welcome': 'ආයුබෝවන්, {name}',
    'dashboard.subtitle': 'ඔබේ අධ්‍යාපනික සම්පත් කළමනාකරණය කරන්න',
    'dashboard.total': 'මුළු සම්පත්',
    'dashboard.materials': 'ද්‍රව්‍ය',
    'dashboard.sessions_count': 'පන්ති',
    'dashboard.pending': 'අනුමැතිය බලාපොරොත්තුවෙන්',
    'dashboard.add_new': 'නව සම්පතක් එක් කරන්න',
    'dashboard.add_new_desc': 'නව ප්‍රශ්න පත්‍රයක්, සටහනක් හෝ පන්තියක් බෙදාගන්න',
    'dashboard.manage': 'සම්පත් කළමනාකරණය',
    'dashboard.manage_desc': 'ඔබේ සම්පත් සංස්කරණය හෝ මකන්න',
    
    // About page
    'about.title': 'EduSupport ගැන',
    'about.subtitle': 'නොමිලේ, ප්‍රවේශ විය හැකි අධ්‍යාපනික සම්පත් සමඟ ශ්‍රී ලාංකික සිසුන් බලගන්වමින්',
    'about.mission_title': 'අපගේ මෙහෙවර',
    'about.mission_text': 'EduSupport නිර්මාණය කරන ලද්දේ සරල මෙහෙවරක් සමඟයි: ශ්‍රී ලංකාවේ සෑම සිසුවෙකුටම ගුණාත්මක අධ්‍යාපනික සම්පත් ලබා ගත හැකි කිරීම.',
    'about.values_title': 'අපගේ වටිනාකම්',
    
    // Common
    'common.open': 'විවෘත කරන්න',
    'common.join': 'සම්බන්ධ වන්න',
    'common.edit': 'සංස්කරණය',
    'common.delete': 'මකන්න',
    'common.save': 'සුරකින්න',
    'common.cancel': 'අවලංගු කරන්න',
    'common.back': 'ආපසු',
    'common.loading': 'පූරණය වෙමින්...',
    'common.error': 'දෝෂයක්',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.materials': 'கற்றல் பொருட்கள்',
    'nav.sessions': 'வகுப்புகள்',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.login': 'பங்களிப்பாளர் உள்நுழைவு',
    'nav.logout': 'வெளியேறு',
    'nav.submit': 'வளத்தைச் சமர்ப்பி',
    
    // Home page
    'home.title': 'வரம்புகள் இல்லாமல் கற்றுக்கொள்ளுங்கள்',
    'home.subtitle': 'உ/த மற்றும் சா/த மாணவர்களுக்கான இலவச கல்வி வளங்களை அணுகுங்கள். கடந்த கால வினாத்தாள்கள், குறிப்புகள், பாடநூல்கள் மற்றும் நேரடி வகுப்புகள் - அனைத்தும் ஒரே இடத்தில்.',
    'home.browse_materials': 'கற்றல் பொருட்களைப் பார்க்க',
    'home.view_sessions': 'வகுப்புகளைப் பார்க்க',
    'home.features_title': 'வெற்றிக்கு தேவையான அனைத்தும்',
    'home.features_subtitle': 'எங்கள் தளம் இலங்கை மாணவர்களுக்கு விரிவான கல்வி வளங்களை வழங்குகிறது',
    
    // Features
    'feature.past_papers': 'கடந்த கால வினாத்தாள்கள்',
    'feature.past_papers_desc': 'முழுமையான தேர்வுத் தயாரிப்புக்கு மதிப்பெண் திட்டங்களுடன் முந்தைய ஆண்டுகளின் தேர்வு வினாத்தாள்கள்.',
    'feature.notes': 'குறிப்புகள் & பாடநூல்கள்',
    'feature.notes_desc': 'பாடம் மற்றும் துறை வாரியாக ஒழுங்கமைக்கப்பட்ட விரிவான படிப்பு குறிப்புகள் மற்றும் பாடநூல் PDFகள்.',
    'feature.sessions': 'வீடியோ வகுப்புகள்',
    'feature.sessions_desc': 'அனைத்து பாடங்களிலும் அனுபவம் வாய்ந்த கல்வியாளர்களிடமிருந்து நேரடி வகுப்புகள் மற்றும் பதிவு செய்யப்பட்ட பாடங்கள்.',
    'feature.languages': 'பல மொழிகள்',
    'feature.languages_desc': 'சிங்களம், தமிழ் மற்றும் ஆங்கிலத்தில் வளங்கள் கிடைக்கும்.',
    'feature.streams': 'அனைத்து துறைகளும்',
    'feature.streams_desc': 'உ/த மற்றும் சா/த மாணவர்களுக்கான அறிவியல், கலை, வணிகம் மற்றும் தொழில்நுட்ப துறைகள்.',
    'feature.free': '100% இலவசம்',
    'feature.free_desc': 'அனைத்து வளங்களும் முற்றிலும் இலவசம். மறைந்த கட்டணங்கள் இல்லை.',
    
    // Filters
    'filter.title': 'வடிகட்டிகள்',
    'filter.level': 'நிலை',
    'filter.stream': 'துறை',
    'filter.subject': 'பாடம்',
    'filter.medium': 'மொழி',
    'filter.type': 'வகை',
    'filter.all': 'அனைத்தும்',
    'filter.all_streams': 'அனைத்து துறைகளும்',
    'filter.all_subjects': 'அனைத்து பாடங்களும்',
    'filter.all_languages': 'அனைத்து மொழிகளும்',
    'filter.clear': 'அனைத்து வடிகட்டிகளையும் அழி',
    
    // Materials page
    'materials.title': 'கற்றல் பொருட்கள்',
    'materials.subtitle': 'உ/த மற்றும் சா/த மாணவர்களுக்கான கடந்த கால வினாத்தாள்கள், குறிப்புகள் மற்றும் பாடநூல்களைப் பார்க்கவும்',
    'materials.search': 'பொருட்களைத் தேடு...',
    'materials.showing': '{count} வளங்கள் காட்டப்படுகின்றன',
    'materials.no_results': 'பொருட்கள் கிடைக்கவில்லை',
    'materials.no_results_hint': 'உங்கள் வடிகட்டிகள் அல்லது தேடல் வினவலை மாற்றி முயற்சிக்கவும்',
    
    // Sessions page
    'sessions.title': 'வகுப்புகள்',
    'sessions.subtitle': 'நேரடி வகுப்புகளில் சேரவும் அல்லது பதிவு செய்யப்பட்ட வீடியோ பாடங்களைப் பாருங்கள்',
    'sessions.search': 'வகுப்புகளைத் தேடு...',
    'sessions.showing': '{count} வகுப்புகள் காட்டப்படுகின்றன',
    'sessions.no_results': 'வகுப்புகள் கிடைக்கவில்லை',
    'sessions.no_results_hint': 'உங்கள் வடிகட்டிகள் அல்லது தேடல் வினவலை மாற்றி முயற்சிக்கவும்',
    'sessions.live': 'நேரடி',
    'sessions.recording': 'பதிவு',
    'sessions.starts_at': 'தொடக்கம்',
    'sessions.ends_at': 'முடிவு',
    'sessions.date': 'தேதி',
    
    // Submit page
    'submit.title': 'வளத்தைச் சமர்ப்பி',
    'submit.subtitle': 'கல்வி பொருட்கள் அல்லது வகுப்பு இணைப்புகளைப் பகிரவும்',
    'submit.type': 'வள வகை',
    'submit.material': 'பொருள் (வினாத்தாள்/குறிப்பு/புத்தகம்)',
    'submit.session': 'வகுப்பு (நேரடி/பதிவு)',
    'submit.category': 'வகை',
    'submit.title_field': 'தலைப்பு',
    'submit.title_placeholder': 'எ.கா: உ/த இயற்பியல் 2023 வினாத்தாள்',
    'submit.description': 'விவரம்',
    'submit.description_placeholder': 'வளத்தின் சுருக்கமான விவரம்...',
    'submit.url': 'URL / இணைப்பு',
    'submit.url_hint_material': 'PDF, Google Drive அல்லது பிற கோப்பு ஹோஸ்டிங்கிற்கான இணைப்பு',
    'submit.url_hint_session': 'Zoom/Teams சந்திப்பு இணைப்பு அல்லது YouTube வீடியோ URL',
    'submit.date': 'வகுப்பு தேதி',
    'submit.start_time': 'தொடக்க நேரம்',
    'submit.end_time': 'முடிவு நேரம்',
    'submit.anonymous': 'அநாமதேயமாக சமர்ப்பிக்கவும்',
    'submit.anonymous_hint': 'அநாமதேய சமர்ப்பிப்புகளுக்கு கைமுறை ஒப்புதல் தேவை',
    'submit.button': 'வளத்தைச் சமர்ப்பி',
    'submit.submitting': 'சமர்ப்பிக்கிறது...',
    'submit.success': 'வளம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
    'submit.success_pending': 'உங்கள் சமர்ப்பிப்பு ஒப்புதலுக்காக காத்திருக்கிறது.',
    'submit.success_approved': 'உங்கள் வளம் இப்போது நேரடியாக உள்ளது.',
    'submit.error': 'வளத்தைச் சமர்ப்பிப்பதில் தோல்வி',
    
    // Dashboard
    'dashboard.welcome': 'வணக்கம், {name}',
    'dashboard.subtitle': 'உங்கள் கல்வி வளங்களை நிர்வகிக்கவும்',
    'dashboard.total': 'மொத்த வளங்கள்',
    'dashboard.materials': 'பொருட்கள்',
    'dashboard.sessions_count': 'வகுப்புகள்',
    'dashboard.pending': 'ஒப்புதலுக்காக காத்திருக்கிறது',
    'dashboard.add_new': 'புதிய வளத்தைச் சேர்',
    'dashboard.add_new_desc': 'புதிய வினாத்தாள், குறிப்பு அல்லது வகுப்பைப் பகிரவும்',
    'dashboard.manage': 'வளங்களை நிர்வகி',
    'dashboard.manage_desc': 'உங்கள் வளங்களைத் திருத்தவும் அல்லது நீக்கவும்',
    
    // About page
    'about.title': 'EduSupport பற்றி',
    'about.subtitle': 'இலவச, அணுகக்கூடிய கல்வி வளங்களுடன் இலங்கை மாணவர்களை அதிகாரப்படுத்துதல்',
    'about.mission_title': 'எங்கள் நோக்கம்',
    'about.mission_text': 'EduSupport ஒரு எளிய நோக்கத்துடன் உருவாக்கப்பட்டது: இலங்கையில் உள்ள ஒவ்வொரு மாணவருக்கும் தரமான கல்வி வளங்களை அணுகக்கூடியதாக மாற்றுவது.',
    'about.values_title': 'எங்கள் மதிப்புகள்',
    
    // Common
    'common.open': 'திற',
    'common.join': 'சேர்',
    'common.edit': 'திருத்து',
    'common.delete': 'நீக்கு',
    'common.save': 'சேமி',
    'common.cancel': 'ரத்துசெய்',
    'common.back': 'பின்',
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
  },
};
