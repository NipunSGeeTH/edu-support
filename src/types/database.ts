export type Level = 'AL' | 'OL';
export type Stream = 'Science' | 'Arts' | 'Commerce' | 'Technology' | 'General';
export type MaterialCategory = 'Past Paper' | 'Note' | 'Textbook' | 'Model Paper';
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
  stream: Stream[]; // Array of streams (subject can belong to multiple streams)
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
  stream: Stream[]; // Array of streams (subject can belong to multiple streams)
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
  stream: Stream[];
  level: Level;
}

// Constants - These are ONLY used as type references
// Actual data is fetched from the database via /api/config
// Do NOT hardcode values here - update the database instead

export const LEVELS: Level[] = ['AL', 'OL'];

export const STREAMS: Record<Level, Stream[]> = {
  AL: ['Science', 'Arts', 'Commerce', 'Technology'],
  OL: ['General'],
};

// Empty - subjects come from database
export const SUBJECTS: Record<Stream, string[]> = {
  Science: [],
  Arts: [],
  Commerce: [],
  Technology: [],
  General: [],
};

export const LANGUAGES: Language[] = ['Sinhala', 'Tamil', 'English'];

export const MATERIAL_CATEGORIES: MaterialCategory[] = ['Past Paper', 'Note', 'Textbook', 'Model Paper'];
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
    'home.title': 'Rebuilding Futures Through Knowledge',
    'home.subtitle': 'Keeping education alive in disaster by uniting caring people to share knowledge, resources and hope - helping every affected student rise again with strength and dignity.',
    'home.browse_materials': 'Browse Materials',
    'home.view_sessions': 'View Sessions',
    'home.banner': "Let's join hands to rebuild Sri Lanka through education and uplift every student in need.",
    'home.quick_access': 'Quick Access',
    'home.materials_desc': 'Past papers, notes, and textbooks for all subjects',
    'home.sessions_desc': 'Live classes and recorded video lessons',
    'home.submit_desc': 'Share your educational resources with the community',
    'home.educational_support': 'Educational Support',
    'home.educational_support_desc': 'Give or receive educational help - books, clothes, stationery, and more',
    'home.request_help': 'Request Help',
    'home.request_help_desc': 'Need educational supplies? Submit a request and let donors help you',
    'home.donate_help': 'Donate to Help',
    'home.donate_help_desc': 'View requests from students and help them with educational supplies',
    
    // Features
    'feature.past_papers': 'Shared Past Papers',
    'feature.past_papers_desc': 'Teachers and volunteers sharing previous exam papers with marking schemes to help students prepare even when schools are closed.',
    'feature.notes': 'Notes & Study Materials',
    'feature.notes_desc': 'Educators contributing comprehensive study notes and guides to bridge learning gaps and keep education alive.',
    'feature.sessions': 'Live Classes & Recordings',
    'feature.sessions_desc': 'Teachers and mentors conducting live sessions and sharing recorded lessons to ensure continuous learning.',
    'feature.languages': 'Multiple Languages',
    'feature.languages_desc': 'Resources in Sinhala, Tamil and English making education accessible to every student in their preferred language.',
    'feature.streams': 'All Streams Covered',
    'feature.streams_desc': 'Science, Arts, Commerce and Technology-community contributors ensuring comprehensive coverage for A/L and O/L students.',
    'feature.free': '100% Free & Open',
    'feature.free_desc': 'All resources shared freely by our community. No barriers, no costs, just humanity lifting humanity through education.',
    
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
    'materials.subtitle': 'Shared by teachers and volunteers worldwide. Past papers, notes, and resources to keep learning alive.',
    'materials.search': 'Search materials...',
    'materials.showing': 'Showing {count} resource{s}',
    'materials.no_results': 'No materials found',
    'materials.no_results_hint': 'Try adjusting your filters or search query',
    
    // Sessions page
    'sessions.title': 'Live & Recorded Sessions',
    'sessions.subtitle': 'Connect with teachers and mentors. Learn from recorded sessions shared by our community.',
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
    'submit.title': 'Share Your Knowledge',
    'submit.subtitle': 'Join our community of teachers, volunteers, and educators. Share resources that will keep students learning.',
    'submit.type': 'Resource Type',
    'submit.material': 'Material (Paper/Note/Book)',
    'submit.session': 'Session (Live/Recording)',
    'submit.category': 'Category',
    'submit.title_field': 'Title',
    'submit.title_placeholder': 'e.g., A/L Physics 2023 Past Paper',
    'submit.description': 'Description',
    'submit.description_placeholder': 'Describe how this resource helps students learn...',
    'submit.url': 'URL / Link',
    'submit.url_hint_material': 'Link to PDF, Google Drive, or other file hosting',
    'submit.url_hint_session': 'Zoom/Teams meeting link or YouTube video URL',
    'submit.date': 'Session Date',
    'submit.start_time': 'Start Time',
    'submit.end_time': 'End Time',
    'submit.anonymous': 'Submit anonymously',
    'submit.anonymous_hint': 'Anonymous submissions require manual approval',
    'submit.button': 'Share This Resource',
    'submit.submitting': 'Sharing...',
    'submit.success': 'Thank you for lifting others through knowledge!',
    'submit.success_pending': 'Your contribution is being reviewed. We appreciate your help!',
    'submit.success_approved': 'Your resource is now live and helping students.',
    'submit.error': 'Failed to submit resource',
    
    // Dashboard
    'dashboard.welcome': 'Welcome, {name}',
    'dashboard.subtitle': 'Manage your educational contributions',
    'dashboard.total': 'Total Resources',
    'dashboard.materials': 'Materials',
    'dashboard.sessions_count': 'Sessions',
    'dashboard.pending': 'Pending Approval',
    'dashboard.add_new': 'Add New Resource',
    'dashboard.add_new_desc': 'Share a new paper, note, or session',
    'dashboard.manage': 'Manage Resources',
    'dashboard.manage_desc': 'Edit or delete your resources',
    
    // About page
    'about.title': 'Education Never Fails',
    'about.vission_title': 'Our Vision.',
    'about.vission_text': 'When students lose their books, devices, and safe places to learn, we believe humanity steps forward. Teachers, volunteers and caring individuals uniting to restore access to knowledge.',
    'about.mission_title': 'Our Mission',
    'about.mission_text': 'We ensure that education never becomes a casualty of disaster. This platform was created to unite teachers, volunteers, donors and caring individuals who are ready to lift others through knowledge. Every shared note every recorded lesson and every act of kindness becomes a bridge for a student trying to continue their learning journey.',
    'about.values_title': 'Our Community',
    'about.what_we_offer': 'What We Offer',
    'about.past_papers_title': 'Past Papers',
    'about.past_papers_detail': 'Previous exam papers with marking schemes',
    'about.notes_title': 'Notes',
    'about.notes_detail': 'Comprehensive study notes by educators',
    'about.textbooks_title': 'Textbooks',
    'about.textbooks_detail': 'Reference textbooks and guides',
    'about.video_sessions_title': 'Video Sessions',
    'about.video_sessions_detail': 'Live and recorded video lessons',
    'about.contributors_title': 'For Contributors',
    'about.contributors_text': 'Are you a teacher, educator or subject expert? Join our community of contributors and help thousands of students succeed. Share your notes, past papers and educational content with students across Sri Lanka.',
    'about.submit_resource': 'Submit a Resource',
    'about.become_contributor': 'Become a Contributor',
    'about.contact_title': 'Get in Touch',
    'about.contact_text': 'Have questions or suggestions? We\'d love to hear from you.',
    'about.contact_email': 'contact@edushare.lk',
    'about.features_title': 'Uniting Humanity Through Knowledge',
    'about.features_subtitle': 'Teachers, volunteers, and community members sharing resources to ensure no student is left behind-especially in times of crisis.',
    
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
    'nav.login': 'Login වෙන්න',
    'nav.logout': 'පිටවීම',
    'nav.submit': 'අලුත් නෝට්ස් / වීඩියෝ දාන්න',

    // Home page
    'home.title': 'දැනුම තුළින් අනාගතය නැවත ගොඩනගමු.',
    'home.subtitle': 'ගුරුවරුන්, ස්වේච්ඡා සේවකයින් සහ සැවෙසින් පුද්ගලයින් දැනුම බෙදා ගනිමින්. අර්බුද සම්පූර්ණයි සිසුන් ඉගෙනුම දිගටම කරන පරිදි නිදහස් අධ්‍යාපනික සම්පත්.',
    'home.browse_materials': 'අධ්‍යයන ද්‍රව්‍ය බලන්න',
    'home.view_sessions': 'පන්ති බලන්න',
    'home.banner': 'ශ්‍රී ලාංකික සිසු දූ දරුවන්ගේ අනාගතය උදෙසා එක්වී පෙළ ගැසෙමු.',
    'home.quick_access': 'ඉක්මන් ප්‍රවේශ',
    'home.materials_desc': 'සියලුම විෂයන් සඳහා පසුගිය ප්‍රශ්න පත්‍ර, සටහන් සහ පාඩම් නිර්දේශ',
    'home.sessions_desc': 'සජීවී පන්ති සහ පටිගත කල වීඩියෝ පාඩම්',
    'home.submit_desc': 'ඔබේ අධ්‍යාපනික සම්පත් ප්‍රජාව සමඟ බෙදා ගන්න',
    'home.educational_support': 'අධ්‍යාපනික සහාය',
    'home.educational_support_desc': 'අධ්‍යාපනික ආධාර ලබන්න හෝ දෙන්න - පොත්, ඇඳුම්, ලිපින ද්‍රව්‍ය සහ තවත්',
    'home.request_help': 'සහාය ඉල්ලන්න',
    'home.request_help_desc': 'අධ්‍යාපනික සැපයුම් අවශ්‍යද? ඉල්ලීමක් ඉදිරිපත් කර පරිත්‍යාගශීලීන්ට ඔබට උදව් කිරීමට ඉඩ දෙන්න.',
    'home.donate_help': 'පරිත්‍යාග කරන්න',
    'home.donate_help_desc': 'සිසුන්ගෙන් ඉල්ලීම් බලන්න සහ අධ්‍යාපනික සැපයුම් සඳහා ඔවුන්ට උදව් කරන්න.',
    
    // Features
    'feature.past_papers': 'බෙදා ගන්නා පසුගිය ප්‍රශ්න පත්‍ර',
    'feature.past_papers_desc': 'ගුරුවරුන් සහ ස්වේච්ඡා සේවකයින් ඔවුන්ගේ විභාගවලට සූදානම් කිරීම සඳහා ලකුණු ක්‍රම සමඟ ප්‍රශ්න පත්‍ර බෙදා ගනු ඇත.',
    'feature.notes': 'සටහන් සහ අධ්‍යයන ද්‍රව්‍ය',
    'feature.notes_desc': 'ඉගෙනුම් එකතා තැබීම් අවතරණය දුරු කිරීමට ගුරුවරුන් දායක සටහන් සහ මාර්ගෝපදේශ.',
    'feature.sessions': 'සජීවී පන්ති සහ පටිගත කිරීම්',
    'feature.sessions_desc': 'ගුරුවරුන් සහ උපදේශකයින් සජීවී පන්ති පවත්වා ගිය සහ ඔබගේ ප්‍රජා බෙදා ගිය පටිගත පාඩම්.',
    'feature.languages': 'බහු භාෂා',
    'feature.languages_desc': 'සිංහල, දෙමළ සහ ඉංග්‍රීසි-සිසුන්ගේ ප්‍රිය භාෂාවලින් ශික්ෂණ ලබා ගත හැකි කිරීම.',
    'feature.streams': 'සියලුම ධාරාවන්',
    'feature.streams_desc': 'විද්‍යා, කලා, වාණිජ සහ තාක්ෂණ-ප්‍රජා ඉදිරිමුණු ඔබ ඡඳිය ශික්ෂණ ඇත සුවිශේෂ.',
    'feature.free': '100% නොමිලේ සහ විවෘත',
    'feature.free_desc': 'ඔබගේ ප්‍රජා බෙදා ගන්නා සියලුම සම්පත්. බාධ නැත, ගාස්තු නැත, සිර්ෂ පමණ ශික්ෂණ මගින් ඡඳිය.',
    
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
    'materials.subtitle': 'ගුරුවරුන් සහ ස්වේච්ඡා සේවකයින් බෙදා ගන්නා විසින්. ඉගෙනුම උඩින් තබා ගැනීම සඳහා පසුගිය ප්‍රශ්න පත්‍ර, සටහන් සහ සම්පත්.',
    'materials.search': 'ද්‍රව්‍ය සොයන්න...',
    'materials.showing': 'සම්පත් {count}ක් පෙන්වයි',
    'materials.no_results': 'ද්‍රව්‍ය හමු නොවීය',
    'materials.no_results_hint': 'ඔබේ පෙරහන් හෝ සෙවුම් විමසුම වෙනස් කර බලන්න',
    
    // Sessions page
    'sessions.title': 'සජීවී සහ පටිගත කල පන්ති',
    'sessions.subtitle': 'ගුරුවරුන් සහ උපදේශකයින් සම්බන්ධ වන්න. ඔබගේ ප්‍රජා බෙදා ගන්නා පටිගත පන්ති සිට ඉගෙන ගන්න.',
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
    'submit.title': 'ඔබේ දැනුම බෙදා ගන්න',
    'submit.subtitle': 'ගුරුවරුන්, ස්වේච්ඡා සේවකයින් සහ ගුරුවරුන්ගේ ඔබගේ ප්‍රජා එක්වන්න. ශිසුන්ට ඉගෙනුම තබා ගැනීමට උපකාරී සම්පත් බෙදා ගන්න.',
    'submit.type': 'සම්පත් වර්ගය',
    'submit.material': 'ද්‍රව්‍ය (ප්‍රශ්න පත්‍ර/සටහන්/පොත්)',
    'submit.session': 'පන්තිය (සජීවී/පටිගත)',
    'submit.category': 'ප්‍රවර්ගය',
    'submit.title_field': 'මාතෘකාව',
    'submit.title_placeholder': 'උදා: උසස් පෙළ භෞතික විද්‍යාව 2023 ප්‍රශ්න පත්‍රය',
    'submit.description': 'විස්තරය',
    'submit.description_placeholder': 'සිසුන් කෙසේ ඉගෙනුම ගැතිබඩු ඉගෙනුම ගැතිබඩු යෝජනා වස්තුවක්...',
    'submit.url': 'URL / සබැඳිය',
    'submit.url_hint_material': 'PDF, Google Drive, හෝ වෙනත් ගොනු සත්කාරකයට සබැඳිය',
    'submit.url_hint_session': 'Zoom/Teams රැස්වීම් සබැඳිය හෝ YouTube වීඩියෝ URL',
    'submit.date': 'පන්ති දිනය',
    'submit.start_time': 'ආරම්භක වේලාව',
    'submit.end_time': 'අවසාන වේලාව',
    'submit.anonymous': 'නිර්නාමිකව ඉදිරිපත් කරන්න',
    'submit.anonymous_hint': 'නිර්නාමික ඉදිරිපත් කිරීම් සඳහා අතින් අනුමැතිය අවශ්‍යයි',
    'submit.button': 'මෙම සම්පතක් බෙදා ගන්න',
    'submit.submitting': 'බෙදා ගිමින්...',
    'submit.success': 'දැනුම දැනටත් දැනටත් ඡඳිය ගිගිමින් ස්තුතිවන්තයි!',
    'submit.success_pending': 'ඔබගේ ඉදිරිපත්ගිවෙණ අතර පරීක්ෂා කරන ලදි. අපි ඔබගේ උපකාර අගය දමමු!',
    'submit.success_approved': 'ඔබගේ සම්පත දැන් සජීවීව සිසුන් සඳහා ඡඳිය කරන තුල.',
    'submit.error': 'සම්පත් ඉදිරිපත් කිරීමට අසමත් විය',
    
    // Dashboard
    'dashboard.welcome': 'ආයුබෝවන්, {name}',
    'dashboard.subtitle': 'ඔබේ අධ්‍යාපනික දායකතා කළමනාකරණය කරන්න',
    'dashboard.total': 'මුළු සම්පත්',
    'dashboard.materials': 'ද්‍රව්‍ය',
    'dashboard.sessions_count': 'පන්ති',
    'dashboard.pending': 'අනුමැතිය බලාපොරොත්තුවෙන්',
    'dashboard.add_new': 'නව සම්පතක් එක් කරන්න',
    'dashboard.add_new_desc': 'නව ප්‍රශ්න පත්‍රයක්, සටහනක් හෝ පන්තියක් බෙදාගන්න',
    'dashboard.manage': 'සම්පත් කළමනාකරණය',
    'dashboard.manage_desc': 'ඔබේ සම්පත් සංස්කරණය හෝ මකන්න',
    
    // About page
    'about.title': 'උගතමනා ශිල්පයමයි මතු රැකෙනා',
    'about.vission_title': 'අපගේ දැක්ම',
    'about.vission_text': 'ශිෂ්‍යයන්ගේ පොත්, උපකරණ හා ආරක්ෂිත ඉගෙනීමේ අවකාශ නැති වූ අවස්ථාවලදී, මනුෂ්‍යත්වයේ සත්‍ය වටිනාකම පෙන්නුම් වන්නේ අපි එකට නැඟී සිටින විටයි. දැනුම නැවත ඔවුන් වෙත ගෙන ඒමට ගුරුවරු, ස්වෙච්ඡා සේවකයින් සහ යහපත් සිතින් සුවිසල් වූ පුද්ගලයින් එක්වන දායකත්වය අපගේ ශක්තිය වෙයි',
    'about.mission_title': 'අපගේ මෙහෙවර',
    'about.mission_text': 'ශ්‍රී ලාංකාව මුහුණ දුන් ස්වාභාවික ව්‍යසනය හමුවේ තම අධ්‍යන කටයුතු සඳහා අවශ්‍ය සම්පත්, උපාංග හා ඉගෙනුම් අවකාශ අහිමි වූ සිසු දූ දරුවන්ගේ අධ්‍යාපනික ප්‍රගතිය වෙනුවෙන් අධ්‍යාපනයේ වටිනාකම දත් මානුශීය හදවත් එකතුවකින් අනාගතය උදෙසා සිදු කෙරෙන උදාර මෙහෙවරකි.',
    'about.values_title': 'අපගේ වටිනාකම්',
    'about.what_we_offer': 'අපි ඉදිරිපත් කරන දේ',
    'about.past_papers_title': 'පසුගිය ප්‍රශ්න පත්‍ර',
    'about.past_papers_detail': 'ලකුණු ක්‍රම සහිත පරීක්ෂණ ප්‍රශ්න පත්‍ර',
    'about.notes_title': 'සටහන්',
    'about.notes_detail': 'ගුරුවරුන් විසින් විස්තිර ඉගෙනුම් සටහන්',
    'about.textbooks_title': 'පාඩම් නිර්දේශ',
    'about.textbooks_detail': 'යොමු පාඩම් නිර්දේශ සහ මාර්ගෝපදේශ',
    'about.video_sessions_title': 'වීඩියෝ පන්ති',
    'about.video_sessions_detail': 'සජීවී සහ පටිගත වීඩියෝ පාඩම්',
    'about.contributors_title': 'දායකයින් සඳහා',
    'about.contributors_text': 'ඔබ ගුරුවරයෙක් හෝ විෂය විශේෂඥයෙක්ද? අපගේ දායක ප්‍රජාවට එක්වෙන්න සහ සිසුන්ට උපකාර කරන්න. ඔබේ සටහන්, පසුගිය ප්‍රශ්න පත්‍ර සහ අධ්‍යාපනික අන්තර්ගතය අපගේ ප්‍රජාව සමග බෙදා ගන්න.',
    'about.submit_resource': 'සම්පත් ඉදිරිපත් කරන්න',
    'about.become_contributor': 'දායකයින් බවට පත්වෙන්න',
    'about.contact_title': 'අපට පිවිසුම් කරන්න',
    'about.contact_text': 'ප්‍රශ්නයක් හෝ යෝජනාවක් තිබේද? අපි ඔබගේ අසම්මතිය අසා සිටීමට කැමැතිය.',
    'about.contact_email': 'contact@edushare.lk',
    'about.features_title': 'දැනුම සමඟ මනුෂ්‍යත්වයව එක්තු කිරීම',
    'about.features_subtitle': 'ගුරුවරුන්, ස්වේච්ඡා සේවකයින් සහ ප්‍රජා සිසුන්ට සහාය වෙමින්. කිසිම සිසුවක් අහිමි නොවිය යුතුය - විශේෂයෙන් අර්බුදකාලීන සමයේ.',
    
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
    'home.title': 'கல்வி நிறுத்தப்பட்டால் மக்கள் ஒன்றாக நிற்கிறார்கள்',
    'home.subtitle': 'ஆசிரியர்கள், தன்னார்வலர்கள் மற்றும் கரிசனை நபர்கள் அறிவை பகிர்ந்து கொள்ளுகின்றனர். இருண்ட சமயங்களில் மாணவர்கள் தொடர்ந்து கற்பதை உறுதிசெய்யும் இலவச கல்வி வளங்கள்.',
    'home.browse_materials': 'கற்றல் பொருட்களைப் பார்க்க',
    'home.view_sessions': 'வகுப்புகளைப் பார்க்க',
    'home.banner': 'ஸ்ரீலங்காவை கல்வির மூலம் மீண்டும் உருவாக்க ஒன்றாக இணைவோம் மற்றும் தேவைப்படும் ஒவ்வொரு மாணவரையும் உயர்த்துவோம்.',
    'home.quick_access': 'விரைவு அணுகல்',
    'home.materials_desc': 'சகல பாடங்களுக்கான கடந்த கால வினாத்தாள்கள், குறிப்புகள் மற்றும் பாடநூல்கள்',
    'home.sessions_desc': 'நேரடி வகுப்புகள் மற்றும் பதிவுசெய்யப்பட்ட வீடியோ பாடங்கள்',
    'home.submit_desc': 'உங்கள் கல்வி வளங்களை சமூகத்துடன் பகிரவும்',
    'home.educational_support': 'கல்வி ஆதரவு',
    'home.educational_support_desc': 'கல்வி உதவி பெறுங்கள் அல்லது கொடுங்கள் - புத்தகங்கள், ஆடைகள், எழுதுசாதனம் மற்றும் பல',
    'home.request_help': 'உதவி கோரவும்',
    'home.request_help_desc': 'கல்வி சாமக்கிரியம் தேவையா? ஒரு கோரிக்கை சமர்ப்பித்து கொடையாளர்களை உங்களுக்கு உதவ அனுமதிக்கவும்',
    'home.donate_help': 'உதவ தான செய்யுங்கள்',
    'home.donate_help_desc': 'மாணவர்களின் கோரிக்கைகளைப் பார்த்து அவர்களுக்கு கல்வி பொருட்களுடன் உதவுங்கள்',
    
    // Features
    'feature.past_papers': 'பகிரப்பட்ட கடந்த கால வினாத்தாள்கள்',
    'feature.past_papers_desc': 'ஆசிரியர்கள் மற்றும் தன்னார்வலர்கள் மதிப்பெண் திட்டங்களுடன் தேர்வு வினாத்தாள்களை பகிர்ந்து கொள்ளுகின்றனர். மாணவர்களை தயாரிக்க உதவுகிறது.',
    'feature.notes': 'குறிப்புகள் & ஆய்வு பொருட்கள்',
    'feature.notes_desc': 'ஆசிரியர்கள் சேர்ந்து விரிவான கற்றல் குறிப்புகள் மற்றும் வழிகாட்டிகள் கொடுக்கிறார்கள். கல்வி இடைவெளியை நிரப்புகிறது.',
    'feature.sessions': 'நேரடி வகுப்புகள் மற்றும் பதிவுசெய்யப்பட்ட கற்றல்',
    'feature.sessions_desc': 'ஆசிரியர்கள் மற்றும் ஆலோசகர்கள் நேரடி பாடங்களை நடத்துகின்றனர் மற்றும் பதிவுசெய்யப்பட்ட பாடங்களை பகிர்கின்றனர்.',
    'feature.languages': 'பல மொழிகள்',
    'feature.languages_desc': 'சிங்களம், தமிழ், மற்றும் ஆங்கிலம் - ஒவ்வொரு மாணவருக்கும் அவர்களின் விருப்ப மொழியில் கல்வி கிடைக்கிறது.',
    'feature.streams': 'அனைத்து ஸ்ட்ரீம்கள் - முழுமையான கவரேஜ்',
    'feature.streams_desc': 'அறிவியல், கலை, வணிகம் மற்றும் தொழில்நுட்பம். உ/த மற்றும் சா/த - மாணவர்களின் தேவைகளுக்கு முழு ஆதரவு.',
    'feature.free': '100% இலவசம் மற்றும் திறந்திருக்கிறது',
    'feature.free_desc': 'சமூகம் பகிரும் அனைத்து வளங்களும். மறைந்த கட்டணங்கள் இல்லை - கல்வி மூலம் மனிதுறவை நகர்த்துவதுதான் மட்டும்.',
    
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
    'about.title': 'கல்வி நிறுத்தப்படுவதில்லை',
    'about.vission_title': 'எங்கள் பார்வை',
    'about.vission_text': 'மாணவர்கள் தங்களின் புத்தகங்கள், சாதனங்கள் மற்றும் கற்றல் இடத்தை இழக்கும்போது, நாம் நம்புவோம் மனிதுறவு முன்வருகிறது. ஆசிரியர்கள், தன்னார்வலர்கள் மற்றும் நாம் கரிசனை கொண்ட நபர்கள் அறிவை மீட்டெடுக்க ஒன்றுபட்டுள்ளோம்.',
    'about.mission_title': 'எங்கள் பணி',
    'about.mission_text': 'கல்வி பேரிடர்ப் பலியாக வேண்டாம் என்று உறுதிசெய்கிறோம். ஆசிரியர்கள், தன்னார்வலர்கள், கொடையாளர்கள் மற்றும் அறிவின் மூலம் மற்றவர்களைத் தூக்க தயாராக இருக்கும் கரிசனை நபர்களை ஒன்றுபடுத்த இந்த தளம் உருவாக்கப்பட்டது. பகிரப்பட்ட ஒவ்வொரு குறிப்பு, ஒவ்வொரு பதிவுசெய்யப்பட்ட பாடமும், ஒவ்வொரு கருணையும் அவர்களின் கற்றல் பயணத்தைத் தொடர்ந்து கொள்ள முயற்சிக்கும் மாணவனுக்கு ஒரு பாலமாக மாறுகிறது.',
    'about.values_title': 'எங்கள் சமூகம்',
    'about.what_we_offer': 'நாம் வழங்குவது',
    'about.past_papers_title': 'கடந்த கால வினாத்தாள்கள்',
    'about.past_papers_detail': 'மதிப்பெண் திட்டங்களுடன் முந்தைய தேர்வு வினாத்தாள்கள்',
    'about.notes_title': 'குறிப்புகள்',
    'about.notes_detail': 'கல்விமான்களால் வழங்கப்பட்ட விரிவான ஆய்வு குறிப்புகள்',
    'about.textbooks_title': 'பாடநூல்கள்',
    'about.textbooks_detail': 'குறிப்பு புத்தகங்கள் மற்றும் வழிகாட்டிகள்',
    'about.video_sessions_title': 'வீடியோ வகுப்புகள்',
    'about.video_sessions_detail': 'நேரடி மற்றும் பதிவுசெய்யப்பட்ட வீடியோ பாடங்கள்',
    'about.contributors_title': 'பங்களிப்பாளர்களுக்கு',
    'about.contributors_text': 'நீங்கள் ஆசிரியர், கல்வியாளர் அல்லது விஷய நிபுணரா? எங்கள் பங்களிப்பாளர்களின் சமூகத்தில் சேரவும் மற்றும் ஆயிரக்கணக்கான மாணவர்களுக்கு உதவ செய்யுங்கள். உங்கள் குறிப்புகள், கடந்த கால வினாத்தாள்கள் மற்றும் கல்விப் பொருள்களை இலங்கை முழுவதிலும் மாணவர்களுடன் பகிரவும்.',
    'about.submit_resource': 'வளத்தைச் சமர்ப்பி',
    'about.become_contributor': 'பங்களிப்பாளர் ஆகி',
    'about.contact_title': 'எங்களுடன் தொடர்பு கொள்ளுங்கள்',
    'about.contact_text': 'கேள்விகள் அல்லது பரிந்துரைகள் உள்ளதா? நாங்கள் உங்களிடமிருந்து கேட்க விரும்புகிறோம்.',
    'about.contact_email': 'contact@edushare.lk',
    'about.features_title': 'அறிவின் மூலம் மானபதை ஐக்கியப்படுத்துதல்',
    'about.features_subtitle': 'ஆசிரியர்கள், தன்னார்வலர்கள் மற்றும் சமூக உறுப்பினர்கள் மாணவர்களுக்கு ஆதரவு வழங்குகின்றனர். எந்த மாணவரும் பின்தங்கி விடக்கூடாது - குறிப்பாக நெருக்கடி சமயங்களில்.',
    
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
