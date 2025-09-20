
import React, { useState, useEffect } from 'react';
import { Event, UserReview as UserReviewType, PaymentCodeModalData, PayWithCreditAmountModalData, Locale, FriendData } from '../../types';
import { CORAL_PRIMARY, GOOGLE_PAY_LOGO_URL, USER_AVATARS, MAP_PLACEHOLDER_LOCALE_MODAL, MAP_PLACEHOLDER } from '../../constants';
import ImageWithFallback from '../ImageWithFallback';
import { X, Star, Heart, MapPin as MapPinIconLucide, CalendarDays, Clock, DollarSign, Gift, Users, CheckCircle, ThumbsUp, CreditCard, Banknote, AlertTriangle, Edit3, ChevronLeft, Share2, Info as InfoIcon, Ticket as TicketIcon, Users2, Building } from 'lucide-react';

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Event, itemType: 'event') => void;
  joinedEvents: Set<string>;
  handleJoinEventAttempt: (eventItem: Event, paymentType?: 'direct_fee_payment' | 'join_pay_later' ) => void;
  handleLeaveEvent: (eventItem: Event) => void;
  setShowReviewModal: (data: { type: 'event'; item: Event } | null) => void;
  setShowDonationModal: (eventItem: Event | null) => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
  userCredit: number;
  isPayableTodayOrTomorrow: (dateString: string) => boolean;
  setShowPayWithCreditAmountModal: (data: PayWithCreditAmountModalData | null) => void;
  locali: Locale[]; 
  nearbyFriends: FriendData[]; 
  currentUserAvatar: string;
}

type EventDetailTabId = 'details' | 'participants';

const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  isFavorite,
  toggleFavorite,
  joinedEvents,
  handleJoinEventAttempt,
  handleLeaveEvent,
  setShowReviewModal,
  setShowDonationModal,
  showToast,
  userCredit,
  isPayableTodayOrTomorrow,
  setShowPayWithCreditAmountModal,
  locali, 
  nearbyFriends,
  currentUserAvatar,
}) => {
  const [activeDetailTab, setActiveDetailTab] = useState<EventDetailTabId>('details');
  const [headerLocale, setHeaderLocale] = useState<Locale | null>(null);

  useEffect(() => {
    if (event?.isPublicVenue && event.localeId) {
      const foundLocale = locali.find(l => l.id === event.localeId);
      setHeaderLocale(foundLocale || null);
    } else {
      setHeaderLocale(null);
    }
  }, [event, locali]);

  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
      setActiveDetailTab('details'); // Reset to first tab on new event
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [event]);


  if (!event) return null;

  const favId = `event_${event.id}`;
  const isJoined = joinedEvents.has(event.id);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < today;

  const eventFeeAmount = event.partecipationFee ? parseFloat(event.partecipationFee.replace('€', '').replace(',', '.')) : 0;
  
  const canPayFeeWithCreditConditionsMet = event.partecipationFee && 
                                 userCredit >= eventFeeAmount && 
                                 isPayableTodayOrTomorrow(event.date) &&
                                 !event.paidWithCredit;

  const handleSimulatedExternalPaymentAndJoin = () => {
    showToast(`Pagamento di ${event.partecipationFee} per ${event.name} con Google Pay in corso... (Simulazione)`, "info", <CreditCard size={18} />);
    setTimeout(() => {
      handleJoinEventAttempt(event, 'direct_fee_payment'); 
    }, 1500);
  };
  
  const handleOpenPayFeeWithCreditModal = () => {
    if (event.paidWithCredit) { showToast("Quota già pagata con credito.", "info"); return; }
    if (!event.partecipationFee) { showToast("Questo evento è gratuito.", "info"); return; }
    if (userCredit < eventFeeAmount) { showToast("Credito insufficiente per pagare la quota.", "error", <AlertTriangle size={18}/>); return; }
    if (!isPayableTodayOrTomorrow(event.date)) { showToast("Puoi pagare la quota con credito solo nei giorni vicini all'evento.", "info"); return; }
    setShowPayWithCreditAmountModal({ itemType: 'event', itemId: event.id, itemName: event.name, maxAmount: eventFeeAmount, isEventFee: true });
  };

  const organizerDisplayName = event.isUserCreated ? "Mario Rossi" : event.organizerName || "SocialMix Team";
  const headerTitle = headerLocale ? headerLocale.name : event.name;

  const tabs = [
    { id: 'details' as EventDetailTabId, label: headerLocale ? "Locale" : "Evento" },
    { id: 'participants' as EventDetailTabId, label: "Partecipanti" }
  ];

  const renderParticipants = () => {
    let allAttendeesNames = [...(event.pastAttendees || [])];
    if (isJoined && !allAttendeesNames.includes("Mario Rossi")) {
        allAttendeesNames.push("Mario Rossi");
    }
    
    const participantsDetails = allAttendeesNames.map(name => {
        const isCurrentUser = name === "Mario Rossi";
        const friend = nearbyFriends.find(f => f.name === name);
        const age = isCurrentUser ? 32 : (friend && 'age' in friend ? (friend as any).age : Math.floor(Math.random() * 30) + 20); 
        const city = isCurrentUser ? "Milano" : (friend && 'city' in friend ? (friend as any).city : "Città Demo");

        return { 
            id: friend?.id || (isCurrentUser ? 'currentUser' : name), 
            name, 
            avatar: isCurrentUser ? currentUserAvatar : (friend?.avatar || USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)]),
            isHost: event.isUserCreated && isCurrentUser,
            age,
            city
        };
    }).filter((p, index, self) => index === self.findIndex((t) => (t.id === p.id && t.name === p.name)));


    return (
      <div className="p-4 space-y-3">
        {participantsDetails.length > 0 ? (
          <div className="flex flex-col space-y-3">
            {participantsDetails.map(p => (
              <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-white rounded-lg shadow">
                <div className="relative flex-shrink-0">
                  <img src={p.avatar} alt={p.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-md border-2 border-slate-200" />
                  {p.isHost && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-400 text-black text-xs px-1.5 py-0.5 rounded-full font-semibold shadow-sm">Host</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-md font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.age} anni • {p.city}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">Nessun partecipante ancora.</p>
        )}
      </div>
    );
  };

  const renderEventDetailsContent = () => (
    <div className="p-4 space-y-4">
      {!event.isPublicVenue && (
         <div className="bg-white p-4 rounded-lg shadow">
            <h3 className={`text-lg font-semibold text-slate-700 mb-2 flex items-center gap-2`}><MapPinIconLucide size={20} className={`text-${CORAL_PRIMARY}-500`}/>Luogo Evento</h3>
            <p className="text-slate-600 text-sm mb-2">{event.location || "Luogo non specificato"}</p>
            <ImageWithFallback 
                itemKey={`map_event_${event.id}`} 
                src={event.coords ? MAP_PLACEHOLDER_LOCALE_MODAL : MAP_PLACEHOLDER } 
                alt={`Mappa per ${event.name}`} 
                imgClassName="w-full h-40 object-cover rounded-md" 
                containerClassName="w-full h-40 rounded-md bg-slate-200" 
            />
        </div>
      )}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Descrizione Evento</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
      </div>
      {event.whatToBring && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Cosa Portare</h3>
          <p className="text-slate-600 text-sm">{event.whatToBring}</p>
        </div>
      )}
      {event.houseRules && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Regole</h3>
          <p className="text-slate-600 text-sm">{event.houseRules}</p>
        </div>
      )}
      {event.generalInfo && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Info Generali</h3>
          <p className="text-slate-600 text-sm">{event.generalInfo}</p>
        </div>
      )}
      {(!event.whatToBring && !event.houseRules && !event.generalInfo && (event.isPublicVenue || (!event.isPublicVenue && !event.location))) && (
           <p className="text-slate-500 text-sm p-4 text-center">Nessun dettaglio aggiuntivo fornito per questo evento.</p>
      )}
    </div>
  );

  const renderLocaleDetailsContent = () => {
    if (!headerLocale) return <p className="text-slate-500 p-4">Dettagli locale non disponibili.</p>;
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className={`text-lg font-semibold text-slate-700 mb-2 flex items-center gap-2`}><Building size={20} className={`text-${CORAL_PRIMARY}-500`}/>Descrizione Locale</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{headerLocale.description}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className={`text-lg font-semibold text-slate-700 mb-2 flex items-center gap-2`}><MapPinIconLucide size={20} className={`text-${CORAL_PRIMARY}-500`}/>Indirizzo</h3>
          <p className="text-slate-600 text-sm">{headerLocale.address}</p>
          <ImageWithFallback 
            itemKey={`map_loc_event_${headerLocale.id}`}
            src={MAP_PLACEHOLDER_LOCALE_MODAL} 
            alt="Mappa Placeholder" 
            imgClassName="mt-2 rounded-md w-full h-40 object-cover" 
            containerClassName="mt-2 rounded-md w-full h-40 bg-slate-200"
          />
        </div>
        {headerLocale.galleryPhotos && headerLocale.galleryPhotos.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Galleria Locale</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {headerLocale.galleryPhotos.map((photo, index) => (
                <ImageWithFallback key={index} src={photo} alt={`Foto locale ${index+1}`} imgClassName="w-full h-24 object-cover rounded" containerClassName="w-full h-24 rounded bg-slate-200" />
              ))}
            </div>
          </div>
        )}
        {headerLocale.openingHours && (
           <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Orari</h3>
            <p className="text-slate-600 text-sm whitespace-pre-line">{headerLocale.openingHours}</p>
          </div>
        )}
      </div>
    );
  };
  
 const renderActionButtonArea = () => {
    const actionButtons: React.ReactNode[] = [];

    if (isPastEvent) {
      if (isJoined && !event.userReviews.find(r => r.userId === 'currentUser')) {
        actionButtons.push(
          <button
            key="review"
            onClick={() => setShowReviewModal({ type: 'event', item: event })}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs"
            title="Lascia una recensione"
          > <Edit3 size={18} /> Recensisci </button>
        );
      }
    } else { // Not a past event
      if (event.isCharityEvent) {
        actionButtons.push(
          <button
            key="donate"
            onClick={() => setShowDonationModal(event)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs"
            title="Dona Ora"
          > <Gift size={18} /> Dona </button>
        );
        if (!isJoined) {
            const maxReached = headerLocale ? event.currentParticipants >= headerLocale.capacity : (event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants);
             if (maxReached && (headerLocale?.capacity || event.maxParticipants > 0)) {
                actionButtons.push(
                    <button key="join_full_charity" className="bg-slate-500 text-white/80 font-semibold py-3 px-3.5 rounded-lg shadow-lg cursor-not-allowed flex items-center justify-center gap-1.5 text-xs" title="Evento Completo" disabled>
                        <AlertTriangle size={18} /> Completo
                    </button>
                );
            } else {
                actionButtons.push(
                    <button key="join_charity" onClick={() => handleJoinEventAttempt(event)} className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs`} title="Partecipa all'Evento Benefico">
                        <CheckCircle size={18} /> Partecipa
                    </button>
                );
            }
        } else {
             actionButtons.push(
                <button key="leave_charity" onClick={() => handleLeaveEvent(event)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs" title="Lascia Evento">
                    <X size={18} /> Lascia
                </button>
            );
        }

      } else { // Not a charity event
        if (isJoined) {
          if (event.partecipationFee && !event.paidWithCredit && canPayFeeWithCreditConditionsMet) {
            actionButtons.push(
                <button key="pay_credit" onClick={handleOpenPayFeeWithCreditModal} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs" title="Paga Quota con Credito">
                    <Banknote size={18} /> Paga Credito
                </button>
            );
          }
          actionButtons.push(
              <button key="leave" onClick={() => handleLeaveEvent(event)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs" title="Lascia Evento">
                  <X size={18} /> Lascia
              </button>
          );
        } else { // Not joined, not charity
            const maxReached = headerLocale ? event.currentParticipants >= headerLocale.capacity : (event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants);
            if (maxReached && (headerLocale?.capacity || event.maxParticipants > 0) ) {
                actionButtons.push(
                    <button key="join_full" className="bg-slate-500 text-white/80 font-semibold py-3 px-3.5 rounded-lg shadow-lg cursor-not-allowed flex items-center justify-center gap-1.5 text-xs" title="Evento Completo" disabled>
                        <AlertTriangle size={18} /> Completo
                    </button>
                );
            } else {
                if (event.partecipationFee) {
                    actionButtons.push( 
                        <button key="pay_join" onClick={handleSimulatedExternalPaymentAndJoin} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs" title="Paga e Partecipa">
                            <CreditCard size={18} /> Paga
                        </button>
                    );
                    if (canPayFeeWithCreditConditionsMet) {
                        actionButtons.push(
                            <button key="pay_credit_join" onClick={handleOpenPayFeeWithCreditModal} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs" title="Paga Quota con Credito">
                                <Banknote size={18} /> Paga Credito
                            </button>
                        );
                    }
                    actionButtons.push(
                        <button key="join_pay_later" onClick={() => handleJoinEventAttempt(event, 'join_pay_later')} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs" title="Unisciti e paga più tardi/all'evento">
                            <Users2 size={18} /> Unisciti
                        </button>
                    );
                } else { // Free event
                    actionButtons.push( 
                        <button key="join_free" onClick={() => handleJoinEventAttempt(event)} className={`bg-${CORAL_PRIMARY}-500 hover:bg-${CORAL_PRIMARY}-600 text-white font-semibold py-3 px-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-xs`} title="Partecipa Gratuitamente">
                            <CheckCircle size={18} /> Partecipa
                        </button>
                    );
                }
            }
        }
      }
    }
    
    // Return as a fragment, layout handled by parent div
    return <>{actionButtons}</>;
  };


  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-100 text-slate-900 overflow-hidden animate-fade-in-up">
      {/* Header Section */}
      <div className="relative h-[45vh] sm:h-[50vh] w-full flex-shrink-0">
        <ImageWithFallback
          src={event.img}
          alt={headerTitle}
          imgClassName="absolute inset-0 w-full h-full object-cover"
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10"></div>
        
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 p-2 text-white">
          {event.isCharityEvent && (
            <span className="inline-block bg-pink-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wide shadow-md">Evento Benefico</span>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">{headerTitle}</h1>
          <p className="text-md sm:text-lg text-slate-200 mt-1.5 drop-shadow-md">Creato da {organizerDisplayName}</p>
          <div className="flex items-center text-sm text-slate-300 mt-2.5 gap-x-4 gap-y-1 flex-wrap drop-shadow-sm">
            <span className="flex items-center gap-1.5"><CalendarDays size={16} /> {new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} /> {event.time}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Section */}
      <div className="bg-white sticky top-0 z-10 flex-shrink-0 shadow-md">
        <div className="flex">
          {tabs.map(tab => {
            const IconComponent = tab.label === "Locale" ? Building : (tab.label === "Evento" ? TicketIcon : Users);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`flex-1 py-3.5 px-2 text-center text-sm font-semibold transition-colors duration-200 focus:outline-none flex items-center justify-center gap-1.5
                            ${activeDetailTab === tab.id ? `text-${CORAL_PRIMARY}-600 border-b-2 border-${CORAL_PRIMARY}-600` : 'text-slate-500 hover:text-slate-800'}`}
              >
                <IconComponent size={16} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Section - Added pb-[5rem] for bottom bar */}
      <div className="flex-1 overflow-y-auto bg-slate-100 no-scrollbar pb-[5rem]">
        {activeDetailTab === 'details' && (headerLocale ? renderLocaleDetailsContent() : renderEventDetailsContent())}
        {activeDetailTab === 'participants' && renderParticipants()}
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
                onClick={() => toggleFavorite(event, 'event')} 
                className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors" 
                aria-label={isFavorite(favId) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}>
                <Heart size={22} className={`${isFavorite(favId) ? `fill-${CORAL_PRIMARY}-500 text-${CORAL_PRIMARY}-500` : `text-white`}`} />
            </button>
            <button 
                onClick={() => showToast(`Condividi: ${headerTitle} (Demo)`, "info")} 
                className="p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors" 
                aria-label="Condividi">
                <Share2 size={22} />
            </button>
          </div>
          
          {/* Right Group: Primary and Secondary Actions, aligned to the right */}
          <div className="flex-1 flex justify-end items-center gap-x-1.5 sm:gap-x-2 flex-wrap">
            {renderActionButtonArea()}
          </div>
      </div>

    </div>
  );
};

export default EventModal;
