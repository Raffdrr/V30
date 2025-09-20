
import React, { useState, useEffect, useRef } from 'react';
import { Locale, UserReview as UserReviewType, FriendData, BillDetails } from '../../types'; 
import { CORAL_PRIMARY, MAP_PLACEHOLDER_LOCALE_MODAL, MENU_PHOTO_PRESETS, USER_AVATARS } from '../../constants'; 

import ImageWithFallback from '../ImageWithFallback';
import { X, Star, Heart, MapPin as MapPinIconLucide, CheckCircle, BookOpen, Camera, ThumbsUp, Edit3, ImagePlus, Users, ChevronDown, ChevronUp, LogOut, AlertTriangle, Receipt, CreditCard as CreditCardIcon, ChevronLeft, Share2, Info as InfoIcon, GalleryThumbnails, MenuSquare, MessageSquareText, Users2, Repeat, Undo2 } from 'lucide-react'; 

interface LocaleModalProps { 
  locale: Locale | null; 
  onClose: () => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Locale, itemType: 'locale') => void; 
  joinedRestaurantTables: Set<string>; 
  handleJoinTable: (localeItem: Locale) => void; 
  handleLeaveTable: (localeId: string) => void; 
  onCancelPaymentAndRefund: (localeId: string) => void;
  handleAddMenuPhoto: (localeId: string, photoUrl: string) => void; 
  setShowReviewModal: (data: { type: 'locale'; item: Locale } | null) => void; 
  nearbyFriends: FriendData[];
  billDetails: BillDetails | undefined;
  onInitiatePayBill: (localeId: string) => void;
  onOpenCreditApplicationModal: (localeId: string, totalBill: number, creditApplied: number) => void;
  onFinalizeBillPayment: (localeId: string, amountPaidWithCredit: number) => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void; 
}

type LocaleDetailTabId = 'info' | 'menu' | 'reviews' | 'participants';


const LocaleModal: React.FC<LocaleModalProps> = ({ 
  locale, 
  onClose, 
  isFavorite, 
  toggleFavorite, 
  joinedRestaurantTables, 
  handleJoinTable, 
  handleLeaveTable, 
  onCancelPaymentAndRefund,
  handleAddMenuPhoto, 
  setShowReviewModal, 
  nearbyFriends,
  billDetails,
  onInitiatePayBill,
  onOpenCreditApplicationModal,
  onFinalizeBillPayment,
  showToast,
}) => {
  const TABS_CONFIG: { id: LocaleDetailTabId; label: string; icon: React.ElementType }[] = [
    { id: 'info', label: "Info", icon: InfoIcon },
    { id: 'menu', label: "Menu", icon: MenuSquare },
    { id: 'reviews', label: `Recensioni`, icon: MessageSquareText },
    { id: 'participants', label: "Partecipanti", icon: Users2 },
  ];
  const [activeDetailTab, setActiveDetailTab] = useState<LocaleDetailTabId>(TABS_CONFIG[0].id);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 70; // Increased threshold
  const MAX_VERTICAL_SWIPE_FOR_HORIZONTAL = 50;


  useEffect(() => {
    if (locale) {
      document.body.style.overflow = 'hidden';
      // Reset to first tab when modal opens or locale changes
      setActiveDetailTab(TABS_CONFIG[0].id); 
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [locale]);

  if (!locale) return null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null || e.changedTouches.length === 0) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Prioritize horizontal swipe if it's dominant
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) { // Horizontal movement is more significant
      const currentIndex = TABS_CONFIG.findIndex(tab => tab.id === activeDetailTab);
      let newIndex = currentIndex;

      if (deltaX < 0) { // Swipe Left
        newIndex = Math.min(currentIndex + 1, TABS_CONFIG.length - 1);
      } else { // Swipe Right
        newIndex = Math.max(currentIndex - 1, 0);
      }

      if (newIndex !== currentIndex) {
        setActiveDetailTab(TABS_CONFIG[newIndex].id);
      }
    }
  };


  const favId = `locale_${locale.id}`; 
  const isUserJoined = joinedRestaurantTables.has(locale.id); 

  const menuByCategory = locale.menu.reduce((acc, item) => { 
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, typeof locale.menu>); 
  
  const peopleAtTableForInfoTab = (locale.joinedUserNames || []) 
    .map(attendeeName => {
        const friendDetail = nearbyFriends.find(friend => friend.name === attendeeName);
        if (attendeeName === "Mario Rossi") { 
            return { id: "currentUser", name: "Mario Rossi", avatar: USER_AVATARS[8]};
        }
        return friendDetail ? 
               { id: friendDetail.id, name: friendDetail.name, avatar: friendDetail.avatar} : 
               { id: attendeeName, name: attendeeName, avatar: USER_AVATARS[Math.floor(Math.random() * (USER_AVATARS.length -1))] }; 
    });

  const detailedParticipantsList = (locale.joinedUserNames || [])
    .map(name => {
        const isCurrentUser = name === "Mario Rossi";
        const friend = nearbyFriends.find(f => f.name === name);
        const age = isCurrentUser ? 32 : (Math.floor(Math.random() * 25) + 20); 
        const city = isCurrentUser ? "Milano" : "Città Demo"; 

        return {
            id: friend?.id || (isCurrentUser ? 'currentUser' : name),
            name,
            avatar: isCurrentUser ? USER_AVATARS[8] : (friend?.avatar || USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)]),
            age,
            city,
        };
    })
    .filter((p, index, self) => index === self.findIndex((t) => (t.id === p.id && t.name === p.name)));


  const renderMainActionButton = () => {
    if (billDetails?.status === 'paid_with_credit') {
      return (
         <button className="bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-default text-sm" title="Conto Pagato">
          <CheckCircle size={20} /> Pagato
        </button>
      );
    }

    if (billDetails?.status === 'ready_to_finalize') {
      return (
        <button
          onClick={() => onFinalizeBillPayment(locale.id, billDetails.creditContributed)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm"
          title={`Finalizza Pagamento (€${billDetails.creditContributed.toFixed(2)})`}
        >
          <CreditCardIcon size={20} /> Finalizza
        </button>
      );
    }

    if (billDetails?.status === 'awaiting_credit_application') {
      return (
        <button
          onClick={() => onOpenCreditApplicationModal(locale.id, billDetails.totalAmount, billDetails.creditContributed)}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm"
          title={`Applica Credito (Tot: €${billDetails.totalAmount.toFixed(2)})`}
        >
          <CreditCardIcon size={20} /> Applica Credito
        </button>
      );
    }
    
    if (isUserJoined) { // Not in payment process, but joined
       return (
          <button
            onClick={() => onInitiatePayBill(locale.id)}
            className={`bg-${CORAL_PRIMARY}-500 hover:bg-${CORAL_PRIMARY}-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm`}
            title="Paga Conto al Tavolo"
          >
            <Receipt size={20} /> Paga Conto
          </button>
       );
    }

    // Not joined
    if (locale.currentGuests >= locale.capacity) {
        return (
            <button
                className="bg-slate-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                disabled title="Tavolo Pieno"
            > <AlertTriangle size={20} /> Completo </button>
        );
    }
    return (
         <button
            onClick={() => handleJoinTable(locale)} 
            className={`bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm`}
            title="Unisciti al Tavolo"
        > <CheckCircle size={20} /> Unisciti </button>
    );
  };
  
  const renderInfoTab = () => (
    <div className="p-4 space-y-4">
      <div className="bg-slate-800 p-4 rounded-lg shadow">
        <h3 className={`text-lg font-semibold text-${CORAL_PRIMARY}-400 mb-2`}>Descrizione</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{locale.description || "Nessuna descrizione fornita."}</p>
      </div>
       {locale.hashtags && locale.hashtags.length > 0 && ( 
        <div className="bg-slate-800 p-4 rounded-lg shadow">
            <h3 className={`text-lg font-semibold text-${CORAL_PRIMARY}-400 mb-2`}>Tags</h3>
            <div className="flex flex-wrap gap-2">
            {locale.hashtags.map(tag => <span key={tag} className={`text-xs bg-${CORAL_PRIMARY}-700/50 text-${CORAL_PRIMARY}-300 px-2.5 py-1 rounded-full font-medium`}>#{tag}</span>)} 
            </div>
        </div>
      )}
      <div className="bg-slate-800 p-4 rounded-lg shadow">
        <h3 className={`text-lg font-semibold text-${CORAL_PRIMARY}-400 mb-2`}>Indirizzo</h3>
        <p className="text-slate-300 text-sm mb-2">{locale.address || "Indirizzo non specificato"}</p>
        <ImageWithFallback itemKey={`map_loc_${locale.id}`} src={MAP_PLACEHOLDER_LOCALE_MODAL} alt="Mappa Locale" imgClassName="w-full h-40 object-cover rounded-md" containerClassName="w-full h-40 rounded-md" />
      </div>
      {locale.openingHours && (
        <div className="bg-slate-800 p-4 rounded-lg shadow">
          <h3 className={`text-lg font-semibold text-${CORAL_PRIMARY}-400 mb-2`}>Orari di Apertura</h3>
          <p className="text-slate-300 text-sm whitespace-pre-line">{locale.openingHours}</p>
        </div>
      )}
       <div className="bg-slate-800 p-4 rounded-lg shadow">
          <h3 className={`text-lg font-semibold text-${CORAL_PRIMARY}-400 mb-1`}>Persone al Tavolo</h3>
          <p className="text-slate-300 text-sm mb-2">{locale.currentGuests} / {locale.capacity}</p>
          {peopleAtTableForInfoTab.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {peopleAtTableForInfoTab.slice(0, 5).map(att => (
                    <img key={att.id} src={att.avatar} alt={att.name} title={att.name} className="w-8 h-8 rounded-full border-2 border-slate-700 object-cover"/>
                ))}
                {peopleAtTableForInfoTab.length > 5 && (
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-semibold">+{peopleAtTableForInfoTab.length - 5}</span>
                )}
            </div>
          ) : <p className="text-xs text-slate-400">Nessuno attualmente al tavolo.</p>}
      </div>
    </div>
  );

  const renderMenuTab = () => (
     <div className="p-4 space-y-4">
        {Object.keys(menuByCategory).length > 0 ? (
          Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} className="bg-slate-800 p-4 rounded-lg shadow">
              <h3 className={`text-lg font-semibold text-${CORAL_PRIMARY}-400 mb-3`}>{category}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.dish} className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2 last:border-b-0 last:pb-0">
                    <span className="text-slate-300">{item.dish}</span>
                    <span className="font-medium text-slate-200">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center py-8">Menu non disponibile.</p>
        )}
        {locale.menuPhotos && locale.menuPhotos.length > 0 && (
            <div className="bg-slate-800 p-4 rounded-lg shadow">
                 <h3 className={`text-lg font-semibold text-${CORAL_PRIMARY}-400 mb-3`}>Foto del Menu</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {locale.menuPhotos.map((photoUrl, index) => ( 
                        <ImageWithFallback key={`menu_photo_${index}`} src={photoUrl} alt={`Foto menu ${index + 1}`} imgClassName="w-full h-28 object-cover rounded-md" containerClassName="w-full h-28 rounded-md" />
                    ))}
                 </div>
            </div>
        )}
        <button
            onClick={() => {
              const photo = prompt("Inserisci URL foto menu (simulato):", MENU_PHOTO_PRESETS[Math.floor(Math.random() * MENU_PHOTO_PRESETS.length)]);
              if (photo) handleAddMenuPhoto(locale.id, photo); 
            }}
            className={`w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-${CORAL_PRIMARY}-600 text-${CORAL_PRIMARY}-400 rounded-lg hover:bg-${CORAL_PRIMARY}-700/30 transition-colors text-sm font-medium`}
          >
            <Camera size={18} /> Aggiungi Foto al Menu
        </button>
     </div>
  );

  const renderReviewsTab = () => (
    <div className="p-4 space-y-4">
        {locale.userReviews && locale.userReviews.length > 0 ? ( 
            locale.userReviews.map((review: UserReviewType) => ( 
              <div key={review.userId + review.date} className="bg-slate-800 p-3.5 rounded-lg shadow">
                <div className="flex items-start mb-1.5">
                  <img src={review.avatar || USER_AVATARS[0]} alt={review.name} className="w-9 h-9 rounded-full mr-3 border-2 border-slate-700" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-200">{review.name || "Utente Anonimo"}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className={`mr-0.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />)}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString('it-IT')}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{review.text}</p>
              </div>
            ))
        ) : (
            <p className="text-slate-400 text-center py-4">Nessuna recensione ancora.</p>
        )}
        <button
            onClick={() => setShowReviewModal({ type: 'locale', item: locale })} 
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-amber-600 text-amber-400 rounded-lg hover:bg-amber-700/30 transition-colors text-sm font-medium"
          >
            <Edit3 size={18} /> Lascia una Recensione
        </button>
        
        {/* Gallery Section */}
        {locale.galleryPhotos && locale.galleryPhotos.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-700/60">
                <h3 className={`text-lg font-semibold text-${CORAL_PRIMARY}-400 mb-3 flex items-center gap-2`}><GalleryThumbnails size={20}/>Galleria Locale</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {locale.galleryPhotos.map((photo, index) => (
                    <ImageWithFallback key={`gallery_loc_${index}`} src={photo} alt={`${locale.name} - foto ${index + 1}`} imgClassName="w-full h-32 sm:h-40 object-cover rounded-md" containerClassName="w-full h-32 sm:h-40 rounded-md" />
                  ))}
                </div>
            </div>
        )}
    </div>
  );

  const renderParticipantsTab = () => (
    <div className="p-4 space-y-3">
      {detailedParticipantsList.length > 0 ? (
        <div className="flex flex-col space-y-3">
          {detailedParticipantsList.map(p => (
            <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-slate-800 rounded-lg shadow">
              <div className="relative flex-shrink-0">
                <img src={p.avatar} alt={p.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-md border-2 border-slate-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold text-slate-100 truncate">{p.name}</p>
                <p className="text-xs text-slate-400">{p.age} anni • {p.city}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">Nessun partecipante al tavolo al momento.</p>
      )}
    </div>
  );


  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black text-white overflow-hidden animate-fade-in-up">
      {/* Header Section */}
      <div className="relative h-[45vh] sm:h-[50vh] w-full flex-shrink-0">
        <ImageWithFallback
          src={locale.img}
          alt={locale.name}
          imgClassName="absolute inset-0 w-full h-full object-cover"
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
        
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 p-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">{locale.name}</h1>
          <p className="text-md sm:text-lg text-slate-200 mt-1.5 drop-shadow-md">{locale.cuisine} • {locale.price}</p>
          <div className="flex items-center text-amber-400 font-bold text-md sm:text-lg mt-2.5 drop-shadow-sm">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 fill-amber-400 text-amber-400" />
            {locale.rating.toFixed(1)} 
            <span className="text-slate-300 font-normal ml-2 text-xs sm:text-sm">({locale.reviews} recensioni)</span> 
          </div>
        </div>
      </div>

      {/* Tab Navigation Section */}
      <div className="bg-slate-900 sticky top-0 z-10 flex-shrink-0 shadow-md">
        <div className="flex">
          {TABS_CONFIG.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailTab(tab.id)}
              className={`flex-1 py-3.5 px-2 text-center text-sm font-semibold transition-colors duration-200 focus:outline-none flex items-center justify-center gap-1.5
                          ${activeDetailTab === tab.id ? `text-${CORAL_PRIMARY}-400 border-b-2 border-${CORAL_PRIMARY}-400` : 'text-slate-400 hover:text-slate-200'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto bg-slate-900 no-scrollbar pb-[5rem]" /* padding-bottom for the action bar */
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeDetailTab === 'info' && renderInfoTab()}
        {activeDetailTab === 'menu' && renderMenuTab()}
        {activeDetailTab === 'reviews' && renderReviewsTab()}
        {activeDetailTab === 'participants' && renderParticipantsTab()}
      </div>
      
      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between p-4">
          {/* Left Spacer */}
          <div className="flex-1">
            {/* This div acts as a spacer to push the central group to the middle */}
          </div>

          {/* Center Group: Navigation buttons */}
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <button 
                onClick={onClose} 
                className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors" 
                aria-label="Chiudi">
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => toggleFavorite(locale, 'locale')} 
                className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors" 
                aria-label={isFavorite(favId) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}>
                <Heart size={22} className={`${isFavorite(favId) ? `fill-${CORAL_PRIMARY}-500 text-${CORAL_PRIMARY}-500` : `text-white`}`} />
            </button>
            <button 
                onClick={() => showToast(`Condividi: ${locale.name} (Demo)`, "info")} 
                className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors" 
                aria-label="Condividi">
                <Share2 size={22} />
            </button>
          </div>

          {/* Right Group: Primary and Secondary Actions, aligned to the right */}
          <div className="flex-1 flex justify-end items-center gap-x-2 sm:gap-x-3">
            {isUserJoined && billDetails && (billDetails.status === 'awaiting_credit_application' || billDetails.status === 'ready_to_finalize') && (
              <button
                onClick={() => onCancelPaymentAndRefund(locale.id)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-3 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs"
                title="Annulla Pagamento e Rimborsa Credito"
                aria-label="Annulla Pagamento e Rimborsa Credito"
              >
                <Undo2 size={16} /> Annulla
              </button>
            )}
            {isUserJoined && (
              <button
                  onClick={() => handleLeaveTable(locale.id)}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2.5 px-3 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs"
                  title="Lascia il Tavolo"
                  aria-label="Lascia il Tavolo"
                >
                  <LogOut size={16} /> Lascia
                </button>
            )}
            {renderMainActionButton()}
          </div>
      </div>

    </div>
  );
};

export default LocaleModal;
