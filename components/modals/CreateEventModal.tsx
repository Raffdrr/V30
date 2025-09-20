
import React, { useState, useEffect } from 'react';
import { Event, Locale } from '../../types';
import { CORAL_PRIMARY, CORAL_ICON_ACTIVE, EVENT_IMAGE_PRESETS, CHARITY_EVENT_PRESET_IMG, initialEventData, initialLocaleData } from '../../constants';
import { ChevronLeft, Edit3, PlusCircle, UsersRound, Gift, AlertTriangle, Building, Tag, CalendarDays, Clock, MapPin, FileText, ImageIcon, Users, DollarSign, Hash, ShoppingBag, Info as InfoIcon, Shield as ShieldIcon, LucideProps } from 'lucide-react';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (eventData: Partial<Event>) => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
  setShowInviteFriendsModal: (show: boolean) => void;
  invitedFriendsCount: number;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onCreate, showToast, setShowInviteFriendsModal, invitedFriendsCount }) => {
  const today = new Date().toISOString().split('T')[0];
  const initialEventCategories = Array.from(new Set(initialEventData.map(e => e.category).filter(c => c !== "Beneficenza")));
  
  const [name, setName] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("19:00");
  const [location, setLocation] = useState("");
  const [eventCategory, setEventCategory] = useState(initialEventCategories[0] || "Altro");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [partecipationFee, setPartecipationFee] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedPresetImg, setSelectedPresetImg] = useState(EVENT_IMAGE_PRESETS[0]);
  const [isCharity, setIsCharity] = useState(false);
  const [donationGoal, setDonationGoal] = useState("");

  const [isPublicVenue, setIsPublicVenue] = useState(false);
  const [localeId, setLocaleId] = useState<string | undefined>(undefined);
  const [whatToBring, setWhatToBring] = useState("");
  const [houseRules, setHouseRules] = useState("");
  const [generalInfo, setGeneralInfo] = useState("");

  const allEventCategories = Array.from(new Set([...initialEventCategories, "Beneficenza", "Altro"].filter(Boolean)));

  useEffect(() => {
    if (isCharity) {
      setEventCategory("Beneficenza");
      if (selectedPresetImg !== CHARITY_EVENT_PRESET_IMG) {
        setSelectedPresetImg(CHARITY_EVENT_PRESET_IMG);
      }
    } else {
      if (eventCategory === "Beneficenza") {
        setEventCategory(initialEventCategories[0] || "Altro");
      }
      if (selectedPresetImg === CHARITY_EVENT_PRESET_IMG) {
         setSelectedPresetImg(EVENT_IMAGE_PRESETS[0]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCharity]);

  useEffect(() => {
    if (isPublicVenue && initialLocaleData.length > 0 && !localeId) {
      const firstLocale = initialLocaleData[0];
      setLocaleId(firstLocale.id);
      setLocation(firstLocale.name); 
    } else if (!isPublicVenue) {
      setLocaleId(undefined);
      // Optionally clear location if switching away from a public venue that set it
      // setLocation(""); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublicVenue]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !time || !eventCategory || !description) {
      showToast("Compila tutti i campi obbligatori (*).", "error", <AlertTriangle size={18} />);
      return;
    }
    if (isPublicVenue && !localeId) {
      showToast("Seleziona un locale se l'evento è pubblico.", "error", <Building size={18} />);
      return;
    }
    if (!isPublicVenue && !location.trim()) {
        showToast("Specifica un luogo per l'evento privato.", "error", <MapPin size={18} />);
        return;
    }

    onCreate({
      name, date, time, 
      location: isPublicVenue && localeId ? initialLocaleData.find(l=>l.id === localeId)?.name || location : location, 
      category: eventCategory, description,
      maxParticipants: parseInt(maxParticipants) || 0,
      partecipationFee,
      hashtags: hashtags.split(',').map(h => h.trim().replace(/^#/, '')).filter(h => h),
      img: selectedPresetImg,
      isCharityEvent: isCharity,
      donationGoal: isCharity ? (parseFloat(donationGoal) || 0) : 0,
      isPublicVenue,
      localeId: isPublicVenue ? localeId : undefined,
      whatToBring: whatToBring || undefined,
      houseRules: houseRules || undefined,
      generalInfo: generalInfo || undefined,
      invitedFriends: Array.from(invitedFriendsCount > 0 ? new Set(["DemoFriend1"]) : []), // Placeholder for actual friend list
    });
  };

  const FormField: React.FC<{label: string, icon?: React.ReactElement<LucideProps>, children: React.ReactNode, htmlFor?: string, required?: boolean}> = ({label, icon, children, htmlFor, required}) => (
    <div>
        <label htmlFor={htmlFor} className="flex items-center text-sm font-medium text-slate-700 mb-1.5">
            {icon && React.cloneElement(icon, { size: 16, className: "mr-2 text-slate-500"})}
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white shadow-md p-3 sm:p-4 flex items-center justify-center sticky top-0 z-20 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <Edit3 size={22} className={`${CORAL_ICON_ACTIVE}`} />Crea Nuovo Evento
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 no-scrollbar"> 
          <FormField label="Nome Evento" icon={<Tag />} htmlFor="eventName" required>
            <input type="text" id="eventName" value={name} onChange={e => setName(e.target.value)} required className="form-input" />
          </FormField>
          
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <FormField label="Data" icon={<CalendarDays />} htmlFor="eventDate" required>
              <input type="date" id="eventDate" value={date} min={today} onChange={e => setDate(e.target.value)} required className="form-input" />
            </FormField>
            <FormField label="Ora" icon={<Clock />} htmlFor="eventTime" required>
              <input type="time" id="eventTime" value={time} onChange={e => setTime(e.target.value)} required className="form-input" />
            </FormField>
          </div>
          
          <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
                <input type="checkbox" id="isPublicVenue" checked={isPublicVenue} onChange={(e) => setIsPublicVenue(e.target.checked)} className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-sky-600 border-slate-300 rounded focus:ring-sky-500" />
                <label htmlFor="isPublicVenue" className="flex items-center cursor-pointer text-sm font-medium text-slate-700">
                    <Building size={16} className="mr-2 text-sky-500" />
                    L'evento si svolge in un locale pubblico?
                </label>
            </div>

            {isPublicVenue ? (
                <FormField label="Seleziona Locale" icon={<Building />} htmlFor="eventLocale" required>
                <select id="eventLocale" value={localeId} onChange={e => {
                    setLocaleId(e.target.value);
                    const selectedLoc = initialLocaleData.find(l => l.id === e.target.value);
                    if (selectedLoc) setLocation(selectedLoc.name);
                    }} required className="form-input bg-white">
                    <option value="">Scegli un locale...</option>
                    {initialLocaleData.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                </FormField>
            ) : (
                <FormField label="Luogo Evento Privato" icon={<MapPin />} htmlFor="eventPrivateLocation" required>
                <input type="text" id="eventPrivateLocation" value={location} onChange={e => setLocation(e.target.value)} placeholder="Es. Parco Cittadino / Via Roma, 1" required={!isPublicVenue} className="form-input" />
                </FormField>
            )}
          </div>
          
          <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-2">
                <input type="checkbox" id="isCharity" checked={isCharity} onChange={(e) => setIsCharity(e.target.checked)} className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-pink-600 border-slate-300 rounded focus:ring-pink-500" />
                <label htmlFor="isCharity" className="flex items-center cursor-pointer text-sm font-medium text-slate-700">
                    <Gift size={16} className="mr-2 text-pink-500" />
                    È un evento di beneficenza?
                </label>
            </div>
            {isCharity && (
                <div className="mt-3">
                    <FormField label="Obiettivo Donazione (€)" icon={<DollarSign />} htmlFor="donationGoal">
                        <input type="number" id="donationGoal" value={donationGoal} onChange={e => setDonationGoal(e.target.value)} placeholder="Es. 5000" className="form-input" />
                    </FormField>
                </div>
            )}
          </div>

          <FormField label="Categoria" icon={<Tag />} htmlFor="eventCategory" required>
            <select id="eventCategory" value={eventCategory} onChange={e => setEventCategory(e.target.value)} required className="form-input bg-white" disabled={isCharity}>
              {allEventCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </FormField>
          
          <FormField label="Descrizione" icon={<FileText />} htmlFor="eventDescription" required>
            <textarea id="eventDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="form-input leading-relaxed"></textarea>
          </FormField>
          
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <ImageIcon size={16} className="mr-2 text-slate-500" /> Immagine Evento<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2 sm:mb-2.5"> 
              {EVENT_IMAGE_PRESETS.filter(img => img !== CHARITY_EVENT_PRESET_IMG || isCharity).slice(0, isCharity ? 4 : 8).map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`Preset ${index + 1}`} onClick={() => setSelectedPresetImg(imgUrl)} className={`h-20 sm:h-24 w-full object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${selectedPresetImg === imgUrl ? `border-${isCharity ? 'pink' : CORAL_PRIMARY}-500 shadow-xl scale-105 ring-2 ring-offset-1 ring-${isCharity ? 'pink' : CORAL_PRIMARY}-300` : `border-slate-200 hover:border-${isCharity ? 'pink' : CORAL_PRIMARY}-300 hover:shadow-md`}`} />
              ))}
            </div>
            {selectedPresetImg && <img src={selectedPresetImg} alt="Anteprima selezionata" className="w-full h-40 sm:h-48 object-cover rounded-lg mt-1.5 border-2 border-slate-300 shadow-inner" />}
          </div>
          
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <FormField label="Max Partecipanti" icon={<Users />} htmlFor="maxParticipants">
              <input type="number" id="maxParticipants" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} placeholder="0 (illimitati)" className="form-input" />
            </FormField>
            <FormField label="Costo (es. €10)" icon={<DollarSign />} htmlFor="eventFee">
              <input type="text" id="eventFee" value={partecipationFee} onChange={e => setPartecipationFee(e.target.value)} placeholder="Gratuito se vuoto" className="form-input" />
            </FormField>
          </div>
          
          <FormField label="Hashtag (separati da virgola)" icon={<Hash />} htmlFor="eventHashtags">
            <input type="text" id="eventHashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#cibo, #musica, #divertimento" className="form-input" />
          </FormField>
          
          <FormField label="Cosa Portare (opzionale)" icon={<ShoppingBag />} htmlFor="whatToBring">
            <textarea id="whatToBring" value={whatToBring} onChange={e => setWhatToBring(e.target.value)} rows={2} placeholder="Es. Tappetino yoga, costume da bagno" className="form-input"></textarea>
          </FormField>
          <FormField label="Regole Evento (opzionale)" icon={<ShieldIcon />} htmlFor="houseRules">
            <textarea id="houseRules" value={houseRules} onChange={e => setHouseRules(e.target.value)} rows={2} placeholder="Es. Vietato fumare, portare amici a 4 zampe" className="form-input"></textarea>
          </FormField>
          <FormField label="Info Generali (opzionale)" icon={<InfoIcon />} htmlFor="generalInfo">
            <textarea id="generalInfo" value={generalInfo} onChange={e => setGeneralInfo(e.target.value)} rows={2} placeholder="Es. Accessibilità, parcheggio disponibile" className="form-input"></textarea>
          </FormField>

          <div>
            <button 
              type="button" 
              onClick={() => setShowInviteFriendsModal(true)} 
              className="w-full mt-3 sm:mt-4 flex items-center justify-center gap-2.5 px-4 py-3 border border-indigo-400 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors text-sm font-semibold active:scale-[0.98] shadow-sm hover:shadow-md" 
            >
              <UsersRound size={20} /> Invita Amici ({invitedFriendsCount})
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white/90 backdrop-blur-sm sticky bottom-0 z-10 flex items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
          <button 
            type="submit" 
            className={`flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95`}
          >
            <PlusCircle size={22} /> Crea Evento
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95"
            aria-label="Indietro"
          >
            <ChevronLeft size={20} /> Indietro
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventModal;
