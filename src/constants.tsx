import React from 'react';
import { 
    Sparkles, ThumbsUp, Ticket, Gift, PlusCircle, Camera, Edit3, MessageCircle as MessageCircleIcon, CreditCard as CreditCardIconLucide, UtensilsCrossed,
    Bell, Award, UserCheck, ShoppingBag, FileText, Clock2, BookMarked, Users, Percent, Smile, Shield as ShieldIcon
} from 'lucide-react';
import { Locale, Event, Badge, FriendData, GamificationObjectiveCore, LevelDetails, NotificationItem, ChatMessage, Reward } from './types';

// Costanti Colore Corallo Primario (rose)
export const CORAL_PRIMARY = 'rose'; 
export const CORAL_ACCENT_LIGHT = 'rose-100';
export const CORAL_TEXT_ACTIVE = 'text-rose-600';
export const CORAL_ICON_ACTIVE = 'text-rose-500';
export const CORAL_BORDER = 'border-rose-500/30';
export const CORAL_TAG_BG = 'bg-rose-100';
export const CORAL_TAG_TEXT = 'text-rose-700';

// Immagini segnaposto e preset
export const MAP_PLACEHOLDER = "https://placehold.co/600x400/334155/e2e8f0?text=Anteprima+Mappa";
export const MAP_PLACEHOLDER_LOCALE_MODAL = "https://placehold.co/400x200/334155/e2e8f0?text=Mappa+Locale";
export const GOOGLE_PAY_LOGO_URL = "https://cdn.icon-icons.com/icons2/2649/PNG/512/google_pay_logo_icon_160630.png";
export const CHARITY_EVENT_PRESET_IMG = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=60";
export const SIMULATED_QR_CODE_URL = "https://placehold.co/256x256/334155/e2e8f0?text=QR+CODE";
export const PANDA_AVATAR_REWARD_URL = "https://placehold.co/60x60/34d399/ffffff?text=PANDA";


export const EVENT_IMAGE_PRESETS = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60", 
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=60", 
  "https://images.unsplash.com/photo-1526234362653-3b75a0c07438?auto=format&fit=crop&w=800&q=60", 
  CHARITY_EVENT_PRESET_IMG,
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=60", 
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=60", 
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=60", 
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=60", 
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=60", 
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=60", 
];
export const MENU_PHOTO_PRESETS = [
    "https://placehold.co/300x200/e2e8f0/334155?text=Menu+1",
    "https://placehold.co/300x200/fde68a/a16207?text=Menu+2",
    "https://placehold.co/300x200/bfdbfe/1e40af?text=Menu+3",
    "https://placehold.co/300x200/fecaca/7f1d1d?text=Dessert+Menu",
    "https://placehold.co/300x200/d1fae5/047857?text=Bevande",
];

export const LOCALE_GALLERY_PRESETS = [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=60",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=400&q=60",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=60",
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=400&q=60",
];


export const USER_AVATARS = [
    "https://placehold.co/40x40/f87171/ffffff?text=LG", "https://placehold.co/40x40/60a5fa/ffffff?text=MS",
    "https://placehold.co/40x40/34d399/ffffff?text=AV", "https://placehold.co/40x40/fbbf24/ffffff?text=FR",
    "https://placehold.co/40x40/c084fc/ffffff?text=SC", "https://placehold.co/40x40/a78bfa/ffffff?text=GB",
    "https://placehold.co/40x40/f472b6/ffffff?text=EC", "https://placehold.co/40x40/818cf8/ffffff?text=DP",
    "https://placehold.co/40x40/fdba74/8c2d04?text=MR", 
    "https://placehold.co/40x40/a3e635/3f6212?text=CG",
    "https://placehold.co/40x40/22d3ee/0e7490?text=SB",
    PANDA_AVATAR_REWARD_URL, 
];
export const NEARBY_FRIENDS_DATA: FriendData[] = [
    { id: "friend1", name: "Laura G.", distance: "250m", avatar: USER_AVATARS[0] },
    { id: "friend2", name: "Marco S.", distance: "400m", avatar: USER_AVATARS[1] },
    { id: "friend3", name: "Anna V.", distance: "650m", avatar: USER_AVATARS[2] },
    { id: "friend4", name: "Fabio R.", distance: "1.2km", avatar: USER_AVATARS[3] },
    { id: "friend5", name: "Sofia C.", distance: "800m", avatar: USER_AVATARS[4] },
];

// Dati Iniziali (statici)
export const initialLocaleData: Locale[] = [ 
  {
    id: "loc1", name: "Osteria del Borgo Antico", rating: 4.6, reviews: 128, cuisine: "Italiana Tradizionale", price: "$$$", distance: "438 m", address: "Via Roma 10, 00100 Città", phone: "06 12345678", website: "www.osteriaborgo.it", img: EVENT_IMAGE_PRESETS[0], coords: { lat: 46.003, lng: 8.953 }, capacity: 30, 
    currentGuests: 5, 
    joinedUserNames: ["Laura G.", "Marco S.", "Mario Rossi", "Sofia C.", "Fabio R."],
    hashtags: ["tradizione", "borgo", "cucinaitaliana", "romantico"], 
    menu: [{ dish: "Tagliatelle al Ragù della Nonna", price: "€16", category: "Primi" }, { dish: "Filetto di Branzino al Forno", price: "€24", category: "Secondi" }, { dish: "Tiramisù Artigianale", price: "€8", category: "Dolci" }, { dish: "Vino Rosso della Casa (0.75L)", price: "€15", category: "Bevande"}], 
    description: "Un'accogliente osteria nel cuore del centro storico, dove riscoprire i sapori autentici della tradizione italiana. Ingredienti freschi e di stagione. L'atmosfera è calda e familiare, perfetta per cene romantiche o serate in compagnia. Offriamo anche una selezione di vini locali e birre artigianali.", 
    menuPhotos: [MENU_PHOTO_PRESETS[0], MENU_PHOTO_PRESETS[3]], 
    galleryPhotos: [LOCALE_GALLERY_PRESETS[0], LOCALE_GALLERY_PRESETS[1]],
    openingHours: "Lun-Sab: 12-15, 19-23. Dom: Chiuso",
    userReviews: [
        {userId: 'user1', name: 'Luigi Verdi', avatar: USER_AVATARS[0], rating: 5, text: 'Fantastico! Cibo ottimo e atmosfera accogliente. Le tagliatelle erano divine!', date: '2025-04-10'}, 
        {userId: 'user2', name: 'Maria Bianchi', avatar: USER_AVATARS[1], rating: 4, text: 'Buona esperienza, consigliato. Servizio un po\' lento ma cordiale.', date: '2025-04-15'},
        {userId: 'user4', name: 'Fabio R.', avatar: USER_AVATARS[3], rating: 5, text: 'Sempre una garanzia, ci torno spesso!', date: '2025-03-20'}
    ],
  },
  {
    id: "loc2", name: "Trattoria Moderna 'Da Lucian'", rating: 4.9, reviews: 98, cuisine: "Italiana Contemporanea", price: "$$", distance: "650 m", address: "Corso Italia 50, 00100 Città", phone: "06 87654321", website: "www.dalucian.it", img: EVENT_IMAGE_PRESETS[1], coords: { lat: 46.004, lng: 8.955 }, capacity: 40, 
    currentGuests: 0, 
    joinedUserNames: [], 
    hashtags: ["moderno", "gourmet", "chef", "fusion"], 
    menu: [{ dish: "Risotto ai Funghi Porcini e Tartufo", price: "€18", category: "Primi" }, { dish: "Cotoletta Milanese 'Sbagliata'", price: "€20", category: "Secondi" }, { dish: "Panna Cotta ai Frutti di Bosco", price: "€7", category: "Dolci" }], 
    description: "Un'esperienza culinaria innovativa che fonde tradizione e creatività. Perfetto per una serata speciale. Utilizziamo solo ingredienti di prima scelta e tecniche di cottura all'avanguardia.", 
    menuPhotos: [MENU_PHOTO_PRESETS[1], MENU_PHOTO_PRESETS[4]], 
    galleryPhotos: [LOCALE_GALLERY_PRESETS[2], LOCALE_GALLERY_PRESETS[3]],
    openingHours: "Mar-Dom: 19:30-23:30. Lun: Chiuso",
    userReviews: [
        {userId: 'user3', name: 'Anna V.', avatar: USER_AVATARS[2], rating: 5, text: 'Eccezionale! Ogni piatto una sorpresa. Il risotto era sublime.', date: '2025-05-01'},
        {userId: 'user_current', name: 'Mario Rossi', avatar: USER_AVATARS[8], rating: 4, text: 'Ottima cena, servizio impeccabile. Prezzi un po\' alti ma ne vale la pena.', date: '2025-04-28'}
    ],
  },
  {
    id: "loc3", name: "Sushi Zen Garden", rating: 4.7, reviews: 215, cuisine: "Giapponese", price: "$$$", distance: "1.1 km", address: "Via Kyoto 3, 00100 Città", phone: "06 98765432", website: "www.sushizen.it", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=60", coords: { lat: 46.000, lng: 8.950 }, capacity: 50, 
    currentGuests: 0,
    joinedUserNames: [],
    hashtags: ["sushi", "giapponese", "zen", "pescefresco"],
    menu: [{ dish: "Sashimi Misto (12pz)", price: "€22", category: "Sashimi & Tartare" }, { dish: "Uramaki Dragon Roll", price: "€16", category: "Roll Speciali" }, { dish: "Tempura di Gamberi e Verdure", price: "€18", category: "Fritti" }, { dish: "Mochi Gelato (2pz)", price: "€6", category: "Dolci" }],
    description: "Autentica cucina giapponese in un ambiente rilassante. Pesce freschissimo e preparazioni curate.",
    menuPhotos: ["https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=300&q=60", "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=300&q=60"],
    userReviews: [{userId: 'user5', name: 'Sofia C.', avatar: USER_AVATARS[4], rating: 5, text: 'Il miglior sushi della città, senza dubbio!', date: '2025-05-05'}],
  },
  {
    id: "loc4", name: "Green Leaf Vegan Bistrot", rating: 4.5, reviews: 75, cuisine: "Vegana", price: "$$", distance: "850 m", address: "Piazza Natura 12, 00100 Città", phone: "06 11223344", website: "www.greenleaf.it", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=60", coords: { lat: 46.008, lng: 8.958 }, capacity: 25, 
    currentGuests: 0,
    joinedUserNames: [],
    hashtags: ["vegan", "bio", "salutare", "km0"],
    menu: [{ dish: "Burger di Ceci con Patate Dolci", price: "€14", category: "Piatti Unici" }, { dish: "Insalata Buddha Bowl", price: "€12", category: "Insalate" }, { dish: "Cheesecake Vegana ai Frutti Rossi", price: "€7", category: "Dolci" }],
    description: "Cucina vegana creativa e gustosa, con ingredienti biologici e a km zero. Un'oasi di sapore e benessere.",
    menuPhotos: ["https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=60"],
    userReviews: [],
  },
];

export const initialEventData: Event[] = [
  { id: "event1", name: "Degustazione Vini Naturali", date: "2025-06-17", time: "18:00", location: "Enoteca 'Il Grappolo'", category: "Food & Wine", img: EVENT_IMAGE_PRESETS[0], coords: { lat: 46.005, lng: 8.952 }, description: "Un viaggio attraverso i sapori autentici dei vini naturali, guidati da esperti sommelier. Piccoli assaggi in abbinamento. Imparerai a riconoscere le note distintive e le storie dietro ogni etichetta.", maxParticipants: 20, currentParticipants: Math.floor(Math.random() * 18) + 2, hashtags: ["vino", "degustazione", "bio", "sommelier"], isUserCreated: false, userReviews: [], pastAttendees: [], isCharityEvent: false, donationsReceived: 0, donationGoal: 0, partecipationFee: "€15", isPublicVenue: true, localeId: "loc1", organizerName: "Enoteca Il Grappolo", whatToBring: "Curiosità e voglia di scoprire!", houseRules: "Vietato fumare. Rispetta gli altri partecipanti.", generalInfo: "Accessibile ai disabili. Parcheggio nelle vicinanze."},
  { id: "event2", name: "Serata Jazz & Cena Gourmet", date: "2025-06-22", time: "20:30", location: "Locale 'Blue Note'", category: "Musica", img: EVENT_IMAGE_PRESETS[2], coords: { lat: 46.001, lng: 8.954 }, description: "Goditi una cena raffinata accompagnata dalle note avvolgenti di un trio jazz dal vivo. Menu degustazione speciale per l'occasione.", maxParticipants: 0, currentParticipants: 8, hashtags: ["jazz", "livemusic", "cena", "gourmetlive"], isUserCreated: false, localeId: "loc2", userReviews: [], pastAttendees: [NEARBY_FRIENDS_DATA[0].name, NEARBY_FRIENDS_DATA[1].name, NEARBY_FRIENDS_DATA[2].name, NEARBY_FRIENDS_DATA[4].name], isCharityEvent: false, donationsReceived: 0, donationGoal: 0, partecipationFee: "€70", isPublicVenue: true, organizerName: "Locale Blue Note"}, 
  { id: "event3", name: "Corso di Cucina Regionale", date: "2025-06-29", time: "10:00", location: "Scuola di Cucina 'Mani in Pasta'", category: "Corsi", img: EVENT_IMAGE_PRESETS[8], partecipationFee: "€25", description: "Impara i segreti della cucina tradizionale emiliana. Dalla sfoglia tirata a mano ai sughi più gustosi. Degustazione finale inclusa.", maxParticipants: 15, currentParticipants: 7, hashtags: ["cucina", "workshop", "tradizione", "imparare"], isUserCreated: true, userReviews: [], pastAttendees: [], isCharityEvent: false, donationsReceived: 0, donationGoal: 0, isPublicVenue: false, whatToBring: "Grembiule e contenitore per portare a casa le preparazioni.", houseRules: "Seguire le indicazioni dello chef." },
  { id: "event_charity1", name: "Cena di Gala per 'Cuori Generosi'", date: "2025-07-15", time: "19:30", location: "Villa Reale", category: "Beneficenza", img: CHARITY_EVENT_PRESET_IMG, description: "Una serata elegante per raccogliere fondi a sostegno dei bambini bisognosi. Cena stellata, asta di beneficenza e intrattenimento dal vivo.", maxParticipants: 100, currentParticipants: 45, hashtags: ["beneficenza", "gala", "solidarietà", "cuori"], isUserCreated: false, userReviews: [], pastAttendees: [], isCharityEvent: true, donationsReceived: 3250, donationGoal: 10000, partecipationFee: "€50 (donazione minima)", isPublicVenue: false, organizerName: "Fondazione Cuori Generosi", generalInfo: "Dress code: elegante." },
  { id: "event_past1", name: "Festival Street Food", date: "2025-04-20", time: "12:00", location: "Piazza Centrale", category: "Festival", img: EVENT_IMAGE_PRESETS[4], description: "Un festival colorato con i migliori food truck della regione. Musica dal vivo e intrattenimento per tutti.", maxParticipants: 200, currentParticipants: 180, hashtags: ["streetfood", "festival", "musica"], isUserCreated: false, userReviews: [{userId: 'user1', name: 'Luigi Verdi', avatar: USER_AVATARS[0], rating: 5, text: 'Bellissimo festival, tanta scelta e ottima organizzazione!', date: '2025-04-21'}], pastAttendees: [NEARBY_FRIENDS_DATA[0].name, NEARBY_FRIENDS_DATA[2].name, NEARBY_FRIENDS_DATA[3].name], isCharityEvent: false, donationsReceived: 0, donationGoal: 0, isPublicVenue: false },
  { id: "event_past2", name: "Cena con Delitto", date: "2025-03-15", time: "20:00", location: "Villa Mistero", category: "Intrattenimento", img: EVENT_IMAGE_PRESETS[5], partecipationFee: "€50", description: "Una serata intrigante con cena e spettacolo interattivo. Risolvi il mistero tra una portata e l'altra!", maxParticipants: 30, currentParticipants: 30, hashtags: ["cena", "mistero", "teatro"], isUserCreated: true, userReviews: [], pastAttendees: [NEARBY_FRIENDS_DATA[1].name], isCharityEvent: false, donationsReceived: 0, donationGoal: 0, paidWithCredit: true, isPublicVenue: false },
  { id: "event_techconf", name: "Tech Innovators Summit", date: "2025-08-05", time: "09:00", location: "Centro Congressi Metropolis", category: "Conferenze", img: EVENT_IMAGE_PRESETS[9], description: "Il futuro della tecnologia è qui. Keynote, workshop e networking con i leader del settore.", maxParticipants: 300, currentParticipants: 120, hashtags: ["tech", "innovazione", "startup", "networking"], isUserCreated: false, userReviews: [], pastAttendees: [], isCharityEvent: false, donationsReceived: 0, donationGoal: 0, partecipationFee: "€150", isPublicVenue: false, organizerName: "TechEvents Corp" },
  { id: "event_yoga", name: "Yoga al Tramonto in Spiaggia", date: "2025-07-10", time: "19:00", location: "Spiaggia Dorata", category: "Benessere", img: EVENT_IMAGE_PRESETS[6], description: "Rilassati e rigenerati con una sessione di yoga al tramonto, cullato dalle onde del mare. Porta il tuo tappetino!", maxParticipants: 25, currentParticipants: 18, hashtags: ["yoga", "benessere", "relax", "spiaggia", "natura"], isUserCreated: false, userReviews: [], pastAttendees: [NEARBY_FRIENDS_DATA[4].name], isCharityEvent: false, donationsReceived: 0, donationGoal: 0, isPublicVenue: false, whatToBring: "Tappetino da yoga, acqua, asciugamano.", houseRules: "Mantenere il silenzio durante la sessione." },
];

export const USER_BADGES: Badge[] = [
    { id: 'badge1', name: 'Esploratore Gourmet', icon: <Sparkles size={20} className="text-amber-500"/>, description: 'Hai visitato 5 locali diversi.', color: 'amber' },
    { id: 'badge2', name: 'Recensore Attivo', icon: <ThumbsUp size={20} className="text-sky-500"/>, description: 'Hai scritto 3 recensioni.', color: 'sky' },
    { id: 'badge3', name: 'Amante degli Eventi', icon: <Ticket size={20} className={`text-${CORAL_PRIMARY}-500`}/>, description: 'Hai partecipato a 5 eventi.', color: CORAL_PRIMARY },
    { id: 'badge4', name: 'Cuore d\'Oro', icon: <Gift size={20} className="text-pink-500"/>, description: 'Hai fatto una donazione ad un evento di beneficenza.', color: 'pink' },
    { id: 'badge5', name: 'Primo Tavolo', icon: <BookMarked size={20} className="text-green-500"/>, description: 'Ti sei unito al tuo primo tavolo.', color: 'green' },
];

// GAMIFICATION CONSTANTS
export const XP_THRESHOLDS_FOR_LEVELS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000]; 

export const calculateLevelDetails = (xp: number): LevelDetails => {
  let level = 1;
  let xpForCurrentLevelStart = 0;
  let xpForNextLevelStart = XP_THRESHOLDS_FOR_LEVELS[1];

  for (let i = XP_THRESHOLDS_FOR_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS_FOR_LEVELS[i]) {
      level = i + 1;
      xpForCurrentLevelStart = XP_THRESHOLDS_FOR_LEVELS[i];
      xpForNextLevelStart = (i + 1 < XP_THRESHOLDS_FOR_LEVELS.length) ? XP_THRESHOLDS_FOR_LEVELS[i+1] : Infinity; 
      break;
    }
  }
   if (level === 1 && xp < XP_THRESHOLDS_FOR_LEVELS[1]) { 
        xpForCurrentLevelStart = 0;
        xpForNextLevelStart = XP_THRESHOLDS_FOR_LEVELS[1];
   }

  const xpIntoCurrentLevel = xp - xpForCurrentLevelStart;
  const xpNeededForNextLevel = xpForNextLevelStart - xpForCurrentLevelStart;
  const progressPercentage = (xpNeededForNextLevel === Infinity || xpNeededForNextLevel === 0) ? 100 : Math.min(Math.max(0,(xpIntoCurrentLevel / xpNeededForNextLevel) * 100), 100);
  
  return {
    level,
    xp,
    xpForCurrentLevelStart,
    xpForNextLevelStart,
    xpIntoCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage
  };
};

export const GAMIFICATION_OBJECTIVES_LIST_CORE: GamificationObjectiveCore[] = [
  { id: 'obj1', title: 'Benvenuto Organizzatore!', description: 'Crea il tuo primo evento.', xpValue: 50, actionType: 'CREATE_EVENT', targetCount: 1, icon: <PlusCircle size={20} className="text-green-500"/> },
  { id: 'obj2', title: 'Prima Recensione', description: 'Scrivi la tua prima recensione per un locale o evento.', xpValue: 25, actionType: 'ADD_REVIEW', targetCount: 1, icon: <ThumbsUp size={20} className="text-sky-500"/> }, 
  { id: 'obj3', title: 'Fotografo di Menu', description: 'Aggiungi la tua prima foto al menu di un locale.', xpValue: 30, actionType: 'ADD_MENU_PHOTO', targetCount: 1, icon: <Camera size={20} className="text-indigo-500"/> }, 
  { id: 'obj4', title: 'Esploratore Sociale', description: 'Partecipa a 3 eventi diversi.', xpValue: 75, actionType: 'JOIN_EVENT', targetCount: 3, icon: <Ticket size={20} className={`text-${CORAL_PRIMARY}-500`}/> },
  { id: 'obj5', title: 'Critico Affermato', description: 'Recensisci 3 locali diversi.', xpValue: 100, actionType: 'ADD_REVIEW_LOCALE', targetCount: 3, icon: <Edit3 size={20} className="text-amber-500"/> }, 
  { id: 'obj6', title: 'Re degli Eventi', description: 'Organizza 3 eventi.', xpValue: 150, actionType: 'CREATE_EVENT', targetCount: 3, icon: <Sparkles size={20} className="text-yellow-500"/> },
  { id: 'obj7', title: 'Cuore d\'Oro', description: 'Fai una donazione a un evento di beneficenza.', xpValue: 60, actionType: 'MAKE_DONATION', targetCount: 1, icon: <Gift size={20} className="text-pink-500"/> },
  { id: 'obj8', title: 'Recensore Prolifico', description: 'Scrivi 5 recensioni (locali o eventi).', xpValue: 120, actionType: 'ADD_REVIEW', targetCount: 5, icon: <MessageCircleIcon size={20} className="text-teal-500"/> }, 
  { id: 'obj9', title: 'Pagamento Smart Evento', description: 'Paga la quota di un evento con il tuo credito.', xpValue: 40, actionType: 'PAY_EVENT_WITH_CREDIT', targetCount: 1, icon: <CreditCardIconLucide size={20} className="text-sky-500"/> },
  { id: 'obj_join_table', title: 'Primo Tavolo Unito', description: 'Unisciti al tuo primo tavolo tramite l\'app.', xpValue: 20, actionType: 'JOIN_TABLE', targetCount: 1, icon: <Users size={20} className="text-green-600"/> },
];

export const EVENT_COST_OPTIONS = ["Gratuito", "A Pagamento"];

export const initialNotifications: NotificationItem[] = [
  { id: 'notif1', icon: Award, iconColor: 'text-amber-500', title: "Badge 'Esploratore Gourmet' Sbloccato!", description: "Complimenti, hai visitato 5 locali!", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), isRead: false, link: { tabId: 'profile'}}, 
  { id: 'notif2', icon: Clock2, iconColor: `text-${CORAL_PRIMARY}-500`, title: "Evento 'Serata Jazz & Cena Gourmet' inizia tra 1 ora!", description: "Non dimenticare il tuo evento stasera alle 20:30.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), isRead: false, link: { tabId: 'home', itemId: 'event2', itemType: 'event'}},
  { id: 'notif3', icon: UserCheck, iconColor: 'text-green-500', title: "Benvenuto in SocialMix!", description: "Esplora locali ed eventi vicino a te.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), isRead: true}, 
  { id: 'notif4', icon: ThumbsUp, iconColor: 'text-sky-500', title: "La tua recensione per 'Osteria del Borgo Antico' è stata pubblicata.", description: "Grazie per il tuo contributo!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), isRead: false, link: {tabId: 'home', itemId: 'loc1', itemType: 'locale'}},
];

export const initialChatMessages: ChatMessage[] = [
  { 
    id: 'chat1', 
    senderId: NEARBY_FRIENDS_DATA[0].id, 
    senderName: NEARBY_FRIENDS_DATA[0].name, 
    avatar: NEARBY_FRIENDS_DATA[0].avatar, 
    lastMessage: "Ciao! Pronta per la degustazione di vini di domani? Ho sentito che sarà fantastica!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 2,
  },
  { 
    id: 'chat2', 
    senderId: 'socialmix_support', 
    senderName: "SocialMix Support", 
    avatar: "https://placehold.co/40x40/8b5cf6/ffffff?text=SM", 
    lastMessage: "Benvenuto in SocialMix! Se hai bisogno di aiuto, non esitare a chiedere.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    unreadCount: 0,
  },
  { 
    id: 'chat3', 
    senderId: NEARBY_FRIENDS_DATA[1].id, 
    senderName: NEARBY_FRIENDS_DATA[1].name, 
    avatar: NEARBY_FRIENDS_DATA[1].avatar, 
    lastMessage: "Hai visto il nuovo locale giapponese Sushi Zen Garden? Sembra ottimo, andiamo?", 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    unreadCount: 1,
  },
   { 
    id: 'chat4', 
    senderId: NEARBY_FRIENDS_DATA[3].id, 
    senderName: NEARBY_FRIENDS_DATA[3].name, 
    avatar: NEARBY_FRIENDS_DATA[3].avatar, 
    lastMessage: "Grazie per l'invito al corso di cucina, ci sarò!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    unreadCount: 0,
  },
];

export const INITIAL_REWARDS_DATA: Reward[] = [
  {
    id: 'reward_premium_month',
    name: 'Mese Premium Gratuito',
    description: 'Sblocca tutte le funzionalità Premium per un mese!',
    xpCost: 200,
    icon: <ShieldIcon size={24} />,
    color: 'purple',
  },
  {
    id: 'reward_discount_partner',
    name: 'Sconto Esclusivo Locale Partner',
    description: 'Ottieni un codice sconto del 20% da usare in un locale partner.',
    xpCost: 100,
    icon: <Percent size={24} />,
    color: 'teal',
  },
  {
    id: 'reward_exclusive_avatar',
    name: 'Avatar Esclusivo "Panda"',
    description: 'Sblocca un avatar speciale e limitato per il tuo profilo.',
    xpCost: 50,
    icon: <Smile size={24} />, 
    color: 'emerald', // This was emerald, let's keep it emerald as it's a specific reward design
  },
];
