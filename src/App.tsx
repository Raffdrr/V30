import React, { useState, useEffect, useRef } from "react";
import {
  Home, Heart, User, MapPin as MapPinIconLucide, X, CheckCircle, ImageOff, Star,
  Ticket, Users, MessageSquare, AlertTriangle, Info, Plus, Edit3, ClipboardList,
  Filter as FilterIconUnused, Tag, RefreshCw, ChevronLeft, ChevronRight, Clock, DollarSign,
  Maximize2, Send, Trash2, MapPin, Navigation, Settings, LogOut, Edit, Globe,
  HelpCircle, Search as SearchIcon, ListFilter, PlusCircle, UsersRound, Image as ImageIcon, Sparkles,
  GripVertical, CalendarDays, ChevronDown, ChevronUp, Award, Shield,
  MessageCircle as MessageCircleIconLucide, Camera, ThumbsUp, CreditCard, BookOpen, Repeat,
  ImagePlus, BadgePercent, Pocket, Gift, TrendingUp, Banknote, PiggyBank, PlusSquare, Target, Activity, QrCode, UtensilsCrossed, Receipt,
  Bell, FileText, BookMarked, ShoppingBag, Clock2, UserCheck, Percent, Smile, LucideProps, CreditCard as CreditCardIcon, LucideIcon, Undo2
} from "lucide-react";

import { 
    Locale, Event, UserReview, Badge, GamificationObjective, ToastMessage,
    ReviewModalData, LevelDetails, TabId, DisplayCategory, FavoriteItem, GamificationActionType, 
    PaymentCodeModalData, PayWithCreditAmountModalData, NotificationItem, ChatMessage, FriendData, Reward, BillDetails
} from './types';
import { 
    CORAL_PRIMARY, CORAL_ACCENT_LIGHT, CORAL_TEXT_ACTIVE, CORAL_ICON_ACTIVE, CORAL_BORDER, CORAL_TAG_BG, CORAL_TAG_TEXT,
    initialLocaleData, initialEventData, USER_AVATARS, USER_BADGES, NEARBY_FRIENDS_DATA,
    XP_THRESHOLDS_FOR_LEVELS, calculateLevelDetails, GAMIFICATION_OBJECTIVES_LIST_CORE, MENU_PHOTO_PRESETS, EVENT_COST_OPTIONS, 
    EVENT_IMAGE_PRESETS, CHARITY_EVENT_PRESET_IMG, SIMULATED_QR_CODE_URL, initialNotifications, initialChatMessages,
    INITIAL_REWARDS_DATA, PANDA_AVATAR_REWARD_URL
} from './constants';

import ImageWithFallback from "./components/ImageWithFallback";
import ListCard from "./components/ListCard";

import CategoryToggleComponent from "./components/ui/CategoryToggle";
import FilterSectionComponent from "./components/ui/FilterSection";
import MapPreviewComponent from "./components/ui/MapPreview";

// FIX: Corrected import path for ModalWrapper to point to the component outside the 'src' directory, as per the provided file structure.
import ModalWrapper from "../components/modals/ModalWrapper"; 
import FullScreenModalWrapper from "./components/modals/FullScreenModalWrapper";

import LocaleModal from "./components/modals/LocaleModal"; 
import EventModal from "./components/modals/EventModal";
import CreateEventModal from "./components/modals/CreateEventModal";
import ProposeTableModal from "./components/modals/ProposeTableModal";
import GlobalMapModal from "./components/modals/GlobalMapModal";
import InviteFriendsModal from "./components/modals/InviteFriendsModal";
import AmbassadorModal from "./components/modals/AmbassadorModal";
import SubscriptionModal from "./components/modals/SubscriptionModal";
import ReviewModal from "./components/modals/ReviewModal";
import DonationModal from "./components/modals/DonationModal";
import WithdrawCreditModal from "./components/modals/WithdrawCreditModal";
import AddCreditModal from "./components/modals/AddCreditModal";
import PaymentCodeModal from "./components/modals/PaymentCodeModal";
import PayWithCreditAmountModal from "./components/modals/PayWithCreditAmountModal";
import InputModal from "./components/modals/InputModal";


// UI Element Heights in pixels for dynamic calculations
const NAV_BAR_BASE_HEIGHT_PX = 56; // Approx 3.5rem
const BOTTOM_SEARCH_BAR_HEIGHT_PX = 56; // Approx 3.5rem for the container
const HOME_FILTER_PANEL_MAX_HEIGHT_PX = 300; // Max height for the filter panel content area when open
const FAB_BUTTON_HEIGHT_PX = 56; // Approx height of the FAB itself
const BASE_MARGIN_PX = 16; // 1rem


export default function SocialMixApp() {
  const [activeTab, setActiveTab] = useState<TabId>("home"); 
  const [displayCategory, setDisplayCategory] = useState<DisplayCategory>("all"); 
  const [search, setSearch] = useState("");
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showGlobalMap, setShowGlobalMap] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  
  const [localeData, setLocaleData] = useState<Locale[]>(initialLocaleData.map(l => ({...l, joinedUserNames: l.joinedUserNames || [] })));
  const [eventData, setEventData] = useState<Event[]>(initialEventData);

  const [showFabMenu, setShowFabMenu] = useState(false);
  const fabMenuRef = useRef<HTMLDivElement>(null);

  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showProposeTableModal, setShowProposeTableModal] = useState(false);
  const [showInviteFriendsModal, setShowInviteFriendsModal] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set());

  const [showFilterPanel, setShowFilterPanel] = useState(false); 
  const [showLocaleFilterSection, setShowLocaleFilterSection] = useState(true);
  const [showEventFilterSection, setShowEventFilterSection] = useState(true);

  const [activeLocaleFilters, setActiveLocaleFilters] = useState<Set<string>>(new Set());
  const [activeEventFilters, setActiveEventFilters] = useState<Set<string>>(new Set());
  const localeCuisineTypes = Array.from(new Set(initialLocaleData.map(l => l.cuisine)));
  
  const mainContentRef = useRef<HTMLDivElement>(null); // Ref for inner scrollable list in Home

  const [showAmbassadorModal, setShowAmbassadorModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<ReviewModalData | null>(null); 
  const [showDonationModal, setShowDonationModal] = useState<Event | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [userCredit, setUserCredit] = useState(125.50); 
  const [paymentCodeModalData, setPaymentCodeModalData] = useState<PaymentCodeModalData | null>(null);
  const [showPayWithCreditAmountModalData, setShowPayWithCreditAmountModalData] = useState<PayWithCreditAmountModalData | null>(null);
  const [inputModalConfig, setInputModalConfig] = useState<{ title: string; message?: string; inputLabel: string; inputType?: string; placeholder?: string; initialValue?: string; confirmText?: string; onConfirm: (value: string) => void; inputMode?: 'numeric' | 'decimal' | 'text' | 'tel' | 'search' | 'email' | 'url'; min?: string; step?: string } | null>(null);

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const [userXP, setUserXP] = useState(165);
  const [objectives, setObjectives] = useState<GamificationObjective[]>([]);
  const levelDetails: LevelDetails = calculateLevelDetails(userXP);
  
  const [favorites, setFavorites] = useState<Map<string, FavoriteItem>>(() => {
    const initialFavs = new Map<string, FavoriteItem>();
    const favLocale = initialLocaleData.find(l => l.id === "loc1");
    if (favLocale) initialFavs.set(`locale_${favLocale.id}`, {...favLocale, itemType: 'locale'});
    const favEvent = initialEventData.find(e => e.id === "event1");
    if (favEvent) initialFavs.set(`event_${favEvent.id}`, {...favEvent, itemType: 'event'});
    return initialFavs;
  });

  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(() => {
     const initialJoined = new Set(['event_past1', 'event_past2']);
     const futureJoinedEvent = initialEventData.find(e => e.id === 'event_yoga');
     if (futureJoinedEvent) initialJoined.add(futureJoinedEvent.id);
     return initialJoined;
  });
  
  const [joinedRestaurantTables, setJoinedRestaurantTables] = useState<Set<string>>(() => {
    const s = new Set<string>();
    initialLocaleData.forEach(l => {
        if ((l.joinedUserNames || []).includes("Mario Rossi")) {
            s.add(l.id);
        }
    });
    return s;
  });


  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  const unreadMessagesCount = chatMessages.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; 
  const MAX_VERTICAL_SWIPE_DIST = 40; 

  // State for Profile accordion sections
  const [showPastJoinedEvents, setShowPastJoinedEvents] = useState(false);
  const [showActiveObjectives, setShowActiveObjectives] = useState(false);
  const [showUserBadgesSection, setShowUserBadgesSection] = useState(false);
  const [showRewardsSection, setShowRewardsSection] = useState(false); 
  
  const [rewardsData, setRewardsData] = useState<Reward[]>(INITIAL_REWARDS_DATA);
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());
  const [isPremiumUser, setIsPremiumUser] = useState(false); 
  const [userAvatar, setUserAvatar] = useState(USER_AVATARS[8]); 

  const [billDetailsByLocaleId, setBillDetailsByLocaleId] = useState<Map<string, BillDetails>>(new Map());

  // Reset filter panel visibility when leaving Home tab
  useEffect(() => {
    if (activeTab !== 'home') {
      setShowFilterPanel(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const initialObjectivesList = GAMIFICATION_OBJECTIVES_LIST_CORE.map(obj => {
      let isCompleted = false;
      let currentProgress = obj.targetCount > 1 ? 0 : undefined;

      if (obj.actionType === 'PAY_EVENT_WITH_CREDIT' && initialEventData.some(e => e.id === 'event_past2' && e.paidWithCredit)) {
        isCompleted = true;
        if (currentProgress !== undefined) currentProgress = obj.targetCount;
      }
       if (obj.actionType === 'JOIN_TABLE' && joinedRestaurantTables.size > 0) { 
        isCompleted = true;
        if (currentProgress !== undefined) currentProgress = obj.targetCount;
      }
      if (obj.actionType === 'ADD_REVIEW_LOCALE' && initialLocaleData.some(l => l.id === 'loc2' && l.userReviews.some(rev => rev.userId === 'user_current'))) {
         isCompleted = true;
         if (currentProgress !== undefined) currentProgress = obj.targetCount;
      }
      return { ...obj, isCompleted, currentProgress };
    });
    setObjectives(initialObjectivesList);
  }, [joinedRestaurantTables]);


  const navTabs: {id: TabId, label: string, icon: LucideIcon, badgeCount?: number}[] = [
    { id: "calendar" as TabId, label: "Calendario", icon: CalendarDays },
    { id: "chat" as TabId, label: "Chat", icon: MessageSquare, badgeCount: unreadNotificationsCount + unreadMessagesCount },
    { id: "home" as TabId, label: "Home", icon: Home }, 
    { id: "favorites" as TabId, label: "Preferiti", icon: Heart },
    { id: "profile" as TabId, label: "Profilo", icon: User },
  ];
  
  useEffect(() => { 
    const listScroller = mainContentRef.current;
    if (listScroller) { listScroller.scrollTop = 0; }
  }, [search, displayCategory, activeLocaleFilters, activeEventFilters]);

  // Scroll main tab content to top on tab change
   useEffect(() => {
    const mainScroller = document.querySelector('main'); // Assuming main is the primary scroller
    if (mainScroller) {
      mainScroller.scrollTop = 0;
    }
  }, [activeTab, currentMonthDate]);
  
  useEffect(() => { 
    function handleClickOutside(event: MouseEvent) { 
      if (fabMenuRef.current && !fabMenuRef.current.contains(event.target as Node)) { 
        setShowFabMenu(false); 
      } 
    } 
    document.addEventListener("mousedown", handleClickOutside); 
    return () => document.removeEventListener("mousedown", handleClickOutside); 
  }, [fabMenuRef]);

  const showToast = (text: string, type: ToastMessage['type'] = "success", icon: React.ReactNode = null) => { setToast({ text, type, icon }); setTimeout(() => setToast(null), 3500); };

  const updateUserProgress = (actionType: GamificationActionType, details: Record<string, any> = {}) => {
    let totalXPEarnedThisAction = 0;
    let objectiveCompletedTitle: string | null = null;
    let objectiveCompletedIcon: React.ReactElement | null = null;
  
    const newObjectives = objectives.map(obj => {
      if (obj.isCompleted || obj.actionType !== actionType) {
        return obj;
      }
  
      let progressMade = false;
      let newProgress = obj.currentProgress;
  
      switch (actionType) {
        case 'CREATE_EVENT':
        case 'ADD_MENU_PHOTO':
        case 'MAKE_DONATION':
        case 'PAY_EVENT_WITH_CREDIT':
        case 'JOIN_TABLE':
        case 'PAY_LOCALE_BILL_WITH_CREDIT':
          if (obj.targetCount === 1) progressMade = true;
          else { newProgress = (newProgress || 0) + 1; progressMade = true; }
          break;
        case 'ADD_REVIEW': 
        case 'ADD_REVIEW_LOCALE':
        case 'JOIN_EVENT':
          newProgress = (newProgress || 0) + 1; progressMade = true;
          break;
        default:
          return obj;
      }
  
      if (progressMade) {
        if ((obj.targetCount === 1 && !obj.isCompleted) || (newProgress !== undefined && newProgress >= obj.targetCount && !obj.isCompleted)) {
          totalXPEarnedThisAction += obj.xpValue;
          objectiveCompletedTitle = obj.title;
          objectiveCompletedIcon = obj.icon || <CheckCircle size={18} className="text-green-300"/>;
          return { ...obj, currentProgress: obj.targetCount, isCompleted: true };
        }
        return { ...obj, currentProgress: newProgress };
      }
      return obj;
    });
  
    if (objectiveCompletedTitle) {
        showToast(`Obiettivo: ${objectiveCompletedTitle} (+${totalXPEarnedThisAction} XP)`, "success", objectiveCompletedIcon);
    }
    
    if (totalXPEarnedThisAction > 0) {
      setUserXP(prevXP => {
        const newUserXP = prevXP + totalXPEarnedThisAction;
        const oldLevelDetails = calculateLevelDetails(prevXP);
        const newLevelDetailsCalc = calculateLevelDetails(newUserXP);
        if (newLevelDetailsCalc.level > oldLevelDetails.level) {
          setTimeout(() => {
            showToast(`Congratulazioni! Livello ${newLevelDetailsCalc.level} raggiunto!`, "success", <Award size={20} className="text-yellow-300"/>);
          }, objectiveCompletedTitle ? 600 : 50);
        }
        return newUserXP;
      });
    }
    setObjectives(newObjectives);
  };

  const toggleFavorite = (item: Locale | Event, itemType: 'locale' | 'event') => {
    const itemId = `${itemType}_${item.id}`; 
    setFavorites(prevFavorites => { 
      const newFavorites = new Map(prevFavorites); 
      if (newFavorites.has(itemId)) { 
        newFavorites.delete(itemId); 
        showToast(`${item.name} rimosso dai preferiti.`, "info", <Heart className={`w-5 h-5 text-sky-400`} />); 
      } else { 
        const favItem: FavoriteItem = { ...item, itemType: itemType, id: item.id, name: item.name, img: item.img };
        newFavorites.set(itemId, favItem); 
        showToast(`${item.name} aggiunto ai preferiti!`, "success", <Heart className={`w-5 h-5 text-${CORAL_PRIMARY}-400 fill-${CORAL_PRIMARY}-400`} />); 
      } 
      return newFavorites; 
    }); 
  };
  const isFavorite = (itemId: string) => favorites.has(itemId);
  
  const isPayableTodayOrTomorrow = (dateString: string): boolean => {
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return eventDate.getTime() === today.getTime() || eventDate.getTime() === tomorrow.getTime();
  };

  const handleJoinEventAttempt = (eventItem: Event, paymentType?: 'direct_fee_payment' | 'join_pay_later' ) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const eventDate = new Date(eventItem.date);
    if (eventDate < today && !eventItem.isCharityEvent) {
        showToast("Non puoi modificare la partecipazione a un evento passato.", "error", <AlertTriangle size={18}/>);
        return;
    }

    const isAlreadyJoined = joinedEvents.has(eventItem.id);

    if (isAlreadyJoined) {
      showToast(`Sei già iscritto a ${eventItem.name}.`, "info");
      return;
    }
    
    if (eventItem.partecipationFee && !paymentType && !eventItem.isCharityEvent) { 
        showToast("Per partecipare a questo evento a pagamento, scegli un metodo di pagamento o 'Unisciti (Paga Dopo)'.", "info");
        return;
    }
    
    if (eventItem.localeId) {
        const locale = localeData.find(l => l.id === eventItem.localeId);
        if (locale && locale.capacity > 0 && eventItem.currentParticipants >= locale.capacity) {
            showToast(`L'evento "${eventItem.name}" presso ${locale.name} è completo.`, "error", <AlertTriangle size={18}/>);
            return;
        }
    } else if (!eventItem.isUserCreated && eventItem.maxParticipants > 0 && eventItem.currentParticipants >= eventItem.maxParticipants) {
        showToast(`L'evento "${eventItem.name}" è completo.`, "error", <AlertTriangle size={18}/>);
        return;
    }

    setJoinedEvents(prev => new Set(prev).add(eventItem.id));
    
    if (paymentType === 'join_pay_later') {
        showToast(`Ti sei unito a: ${eventItem.name}! Ricorda di pagare la quota.`, "success", <CheckCircle className="w-5 h-5" />);
    } else {
       showToast(`Ti sei unito a: ${eventItem.name}!`, "success", <CheckCircle className="w-5 h-5" />);
    }
    
    if (!eventItem.isUserCreated) {
        updateUserProgress('JOIN_EVENT', { eventId: eventItem.id });
    }
    
    const newCurrentParticipants = eventItem.currentParticipants + 1;

    setEventData(currentEvents => currentEvents.map(e => 
        e.id === eventItem.id ? { ...e, currentParticipants: newCurrentParticipants } : e
    ));

    if (selectedEvent && selectedEvent.id === eventItem.id) {
        setSelectedEvent(prevEvent => ({ ...prevEvent!, currentParticipants: newCurrentParticipants }));
    }
  };

  const handlePayEventFeeWithCredit = (eventId: string, amount: number) => {
    const eventToPay = eventData.find(e => e.id === eventId);
    if (!eventToPay) {
      showToast("Evento non trovato.", "error");
      setShowPayWithCreditAmountModalData(null);
      return;
    }

    if (userCredit >= amount) {
      setUserCredit(prev => prev - amount);
      
      const wasAlreadyJoined = joinedEvents.has(eventId);
      let newCurrentParticipants = eventToPay.currentParticipants;
      if (!wasAlreadyJoined) {
          newCurrentParticipants = eventToPay.currentParticipants + 1;
          setJoinedEvents(prev => new Set(prev).add(eventId));
          if (!eventToPay.isUserCreated) {
            updateUserProgress('JOIN_EVENT', { eventId });
          }
      }

      setEventData(currentEvents => currentEvents.map(e => 
        e.id === eventId ? { ...e, paidWithCredit: true, currentParticipants: newCurrentParticipants } : e
      ));

      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(prevEvent => ({ ...prevEvent!, paidWithCredit: true, currentParticipants: newCurrentParticipants }));
      }
      
      showToast(`Pagata quota di €${amount.toFixed(2)} per ${eventToPay.name} con credito! ${!wasAlreadyJoined ? 'Ti sei anche unito all\'evento.' : ''}`, "success", <CheckCircle size={18}/>);
      updateUserProgress('PAY_EVENT_WITH_CREDIT', { eventId, amount });
      setShowPayWithCreditAmountModalData(null);
    } else {
      showToast("Credito insufficiente per pagare la quota.", "error", <Banknote size={18} className="text-red-300"/>);
    }
  };


  const handleLeaveEvent = (eventItem: Event) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const eventDate = new Date(eventItem.date);
    if (eventDate < today) {
        showToast("Non puoi lasciare un evento passato.", "error", <AlertTriangle size={18}/>);
        return;
    }
    if (!joinedEvents.has(eventItem.id)) { return; }

    setJoinedEvents(prev => { const next = new Set(prev); next.delete(eventItem.id); return next; });
    
    if (eventItem.paidWithCredit && eventItem.partecipationFee) {
        const feeAmount = parseFloat(eventItem.partecipationFee.replace('€', '').replace(',', '.'));
        setUserCredit(prev => prev + feeAmount);
        showToast(`Credito di €${feeAmount.toFixed(2)} rimborsato.`, "info");
    }

    const newCurrentParticipants = Math.max(0, eventItem.currentParticipants - 1);
    
    setEventData(currentEvents => currentEvents.map(e => e.id === eventItem.id ? {...e, currentParticipants: newCurrentParticipants, paidWithCredit: false} : e));
    if (selectedEvent && selectedEvent.id === eventItem.id) setSelectedEvent(prevEvent => ({...prevEvent!, currentParticipants: newCurrentParticipants, paidWithCredit: false}));
    
    showToast(`Hai lasciato l'evento: ${eventItem.name}`, "info", <LogOut className="w-5 h-5" />);
  };
  
  const handleJoinTable = (localeItem: Locale) => {
    if (localeItem.currentGuests >= localeItem.capacity) {
      showToast(`Il tavolo da ${localeItem.name} è pieno.`, "error", <AlertTriangle size={18} />);
      return;
    }

    setLocaleData(prevData => prevData.map(l => {
      if (l.id === localeItem.id) {
        const newJoinedUserNames = Array.from(new Set([...(l.joinedUserNames || []), "Mario Rossi"])); 
        return { ...l, currentGuests: l.currentGuests + 1, joinedUserNames: newJoinedUserNames };
      }
      return l;
    }));
    
    setJoinedRestaurantTables(prev => new Set(prev).add(localeItem.id));
    
    if (selectedLocale && selectedLocale.id === localeItem.id) {
        setSelectedLocale(prev => ({
            ...prev!, 
            currentGuests: prev!.currentGuests + 1,
            joinedUserNames: Array.from(new Set([...(prev!.joinedUserNames || []), "Mario Rossi"]))
        }));
    }

    showToast(`Ti sei unito al tavolo da ${localeItem.name}!`, "success", <CheckCircle className="w-5 h-5" />);
    updateUserProgress('JOIN_TABLE', { restaurantId: localeItem.id });
  };

  const handleLeaveTable = (localeId: string) => {
    const localeItem = localeData.find(l => l.id === localeId);
    if (!localeItem) return;

    // Refund credit if payment was in progress
    const billInProgress = billDetailsByLocaleId.get(localeId);
    if (billInProgress && billInProgress.creditContributed > 0 && billInProgress.status !== 'paid_with_credit') {
      setUserCredit(prev => prev + billInProgress.creditContributed);
      showToast(`Pagamento annullato. Credito di €${billInProgress.creditContributed.toFixed(2)} rimborsato.`, "info", <Undo2 size={18}/>);
    }
    // Remove any pending bill details
    setBillDetailsByLocaleId(prevMap => {
        const newMap = new Map(prevMap);
        newMap.delete(localeId);
        return newMap;
    });


    setLocaleData(prevData => prevData.map(l => {
      if (l.id === localeId) {
        const newJoinedUserNames = (l.joinedUserNames || []).filter(name => name !== "Mario Rossi"); 
        return { ...l, currentGuests: Math.max(0, l.currentGuests - 1), joinedUserNames: newJoinedUserNames, billDetails: undefined };
      }
      return l;
    }));

    setJoinedRestaurantTables(prev => {
      const next = new Set(prev);
      next.delete(localeId);
      return next;
    });

     if (selectedLocale && selectedLocale.id === localeId) {
        setSelectedLocale(prev => {
            if (!prev) return null;
            return {
                ...prev, 
                currentGuests: Math.max(0, prev.currentGuests - 1),
                joinedUserNames: (prev.joinedUserNames || []).filter(name => name !== "Mario Rossi"),
                billDetails: undefined
            };
        });
    }
    showToast(`Hai lasciato il tavolo da ${localeItem.name}.`, "info", <LogOut className="w-5 h-5" />);
  };

  const handleCancelPaymentAndRefund = (localeId: string) => {
    const bill = billDetailsByLocaleId.get(localeId);
    if (!bill || bill.status === 'paid_with_credit') {
        showToast("Nessun pagamento da annullare o pagamento già finalizzato.", "info");
        return;
    }

    if (bill.creditContributed > 0) {
        setUserCredit(prev => prev + bill.creditContributed);
        showToast(`Credito di €${bill.creditContributed.toFixed(2)} rimborsato.`, "success", <Undo2 size={18}/>);
    }

    setBillDetailsByLocaleId(prevMap => {
        const newMap = new Map(prevMap);
        newMap.delete(localeId);
        return newMap;
    });

    if (selectedLocale && selectedLocale.id === localeId) {
        setSelectedLocale(prev => {
            if (!prev) return null;
            return { ...prev, billDetails: undefined };
        });
    }
    showToast("Processo di pagamento annullato.", "info");
  };


  const handleCreateEvent = (newEventData: Partial<Event>) => { 
    const newEvent: Event = { 
      name: '', date: '', time: '', location: '', category: '', img: '', description: '', maxParticipants: 0, 
      ...newEventData, 
      id: `event${Date.now()}`, 
      currentParticipants: 0, 
      isUserCreated: true, 
      userReviews: [],     
      pastAttendees: [],   
      donationsReceived: 0, 
      paidWithCredit: false, 
      isCharityEvent: newEventData.isCharityEvent === true, 
      donationGoal: (newEventData.isCharityEvent === true && newEventData.donationGoal) 
                      ? newEventData.donationGoal 
                      : 0,
      hashtags: newEventData.hashtags || [], 
      invitedFriends: Array.from(invitedFriends), 
    }; 
    setEventData(prev => [newEvent, ...prev]); 
    setShowCreateEventModal(false); 
    setInvitedFriends(new Set());  
    showToast(`Evento "${newEvent.name}" creato con successo!`, "success", <Sparkles size={18} className="text-yellow-300"/>); 
    updateUserProgress('CREATE_EVENT'); 
  };
  const handleProposeTable = (tableData: { localeName: string; date: string; time: string; numPeople: number; notes: string }) => { 
    console.log("Tavolo proposto:", tableData); 
    setShowProposeTableModal(false); 
    showToast(`Proposta tavolo da "${tableData.localeName}" inviata!`, "success"); 
  };
  
  const toggleLocaleFilter = (filter: string) => { setActiveLocaleFilters(prev => { const next = new Set(prev); if (next.has(filter)) next.delete(filter); else next.add(filter); return next; }); };
  const toggleEventFilter = (filter: string) => { setActiveEventFilters(prev => { const next = new Set(prev); if (next.has(filter)) next.delete(filter); else next.add(filter); return next; }); };
  const resetAllFilters = () => { resetLocaleFilters(); resetEventFilters(); }
  const resetLocaleFilters = () => setActiveLocaleFilters(new Set());
  const resetEventFilters = () => setActiveEventFilters(new Set());

  const filteredLocali = localeData.filter(l => { const searchLower = search.toLowerCase(); const searchMatch = l.name.toLowerCase().includes(searchLower) || l.cuisine.toLowerCase().includes(searchLower) || (l.hashtags && l.hashtags.some(h => `#${h.toLowerCase()}`.includes(searchLower))); const filterMatch = activeLocaleFilters.size === 0 || activeLocaleFilters.has(l.cuisine); return searchMatch && filterMatch; });
  const filteredEvents = eventData.filter(e => { const searchLower = search.toLowerCase(); const searchMatch = e.name.toLowerCase().includes(searchLower) || e.category.toLowerCase().includes(searchLower) || (e.description && e.description.toLowerCase().includes(searchLower)) || (e.hashtags && e.hashtags.some(h => `#${h.toLowerCase()}`.includes(searchLower))); let filterMatch = true; if (activeEventFilters.size > 0) { filterMatch = Array.from(activeEventFilters).every(filter => { if (EVENT_COST_OPTIONS.includes(filter)) return filter === "Gratuito" ? !e.partecipationFee : !!e.partecipationFee; return e.category === filter; }); } const today = new Date(); today.setHours(0,0,0,0); const eventDate = new Date(e.date); return searchMatch && filterMatch && eventDate >= today; });
  const pastJoinedEvents = eventData.filter(e => { const today = new Date(); today.setHours(0,0,0,0); const eventDate = new Date(e.date); return joinedEvents.has(e.id) && eventDate < today; }).sort((a,b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()); 

  const handleAddReview = (itemType: 'locale' | 'event', itemId: string, rating: number, text: string) => { const review: UserReview = { userId: 'currentUser', name: 'Mario Rossi', avatar: userAvatar, rating, text, date: new Date().toISOString().split('T')[0] }; if (itemType === 'event') { setEventData(prev => prev.map(e => e.id === itemId ? {...e, userReviews: [...(e.userReviews || []), review]} : e)); if (selectedEvent && selectedEvent.id === itemId) setSelectedEvent(prev => ({...prev!, userReviews: [...(prev!.userReviews || []), review]})); } else if (itemType === 'locale') { setLocaleData(prev => prev.map(l => l.id === itemId ? {...l, userReviews: [...(l.userReviews || []), review]} : l)); if (selectedLocale && selectedLocale.id === itemId) setSelectedLocale(prev => ({...prev!, userReviews: [...(prev!.userReviews || []), review]})); } showToast("Recensione aggiunta con successo!", "success", <ThumbsUp size={18}/>); setShowReviewModal(null); updateUserProgress('ADD_REVIEW', { itemType, itemId }); if (itemType === 'locale') { updateUserProgress('ADD_REVIEW_LOCALE', { itemId }); } };
  
  const handleAddMenuPhoto = (localeId: string, photoUrl: string) => { setLocaleData(prev => prev.map(l => { if (l.id === localeId) { const updatedLocale = {...l, menuPhotos: [...(l.menuPhotos || []), photoUrl]}; if (selectedLocale && selectedLocale.id === localeId) { setSelectedLocale(updatedLocale); } return updatedLocale; } return l; })); showToast("Foto del menu aggiunta!", "success", <Camera size={18}/>); updateUserProgress('ADD_MENU_PHOTO', { localeId }); };
  
  const handleMakeDonation = (eventId: string, amount: number) => { setEventData(prevEvents => prevEvents.map(e => e.id === eventId ? {...e, donationsReceived: (e.donationsReceived || 0) + amount} : e)); if (selectedEvent && selectedEvent.id === eventId) { setSelectedEvent(prevSelected => ({...prevSelected!, donationsReceived: (prevSelected!.donationsReceived || 0) + amount})); } showToast(`Grazie per la tua donazione di €${amount.toFixed(2)}!`, "success", <Gift size={18} className="text-pink-300"/>); setShowDonationModal(null); updateUserProgress('MAKE_DONATION', { eventId, amount });};
  const handleWithdrawCredit = (amount: number) => { setUserCredit(prev => Math.max(0, prev - amount)); showToast(`Hai ritirato €${amount.toFixed(2)}. Il tuo novo saldo è €${(userCredit - amount).toFixed(2)}. (Simulazione)`, "success", <Banknote size={18}/>); setShowWithdrawModal(false); };
  const handleAddCredit = (amount: number) => { setUserCredit(prev => prev + amount); showToast(`Hai aggiunto €${amount.toFixed(2)} al tuo credito. Nuovo saldo: €${(userCredit + amount).toFixed(2)}. (Simulazione)`, "success", <PlusSquare size={18} />); setShowAddCreditModal(false); };
  
  const handleClaimReward = (rewardId: string) => {
    const reward = rewardsData.find(r => r.id === rewardId);
    if (!reward) {
      showToast("Premio non trovato.", "error");
      return;
    }
    if (claimedRewards.has(rewardId)) {
      showToast("Hai già riscattato questo premio.", "info");
      return;
    }
    if (userXP < reward.xpCost) {
      showToast("Non hai abbastanza XP per questo premio.", "error");
      return;
    }

    setUserXP(prevXP => prevXP - reward.xpCost);
    setClaimedRewards(prev => new Set(prev).add(rewardId));
    showToast(`Premio "${reward.name}" riscattato con successo! (-${reward.xpCost} XP)`, "success", React.cloneElement(reward.icon as React.ReactElement<LucideProps>, { className: `text-${reward.color}-500` }));

    if (reward.id === 'reward_premium_month') {
      setIsPremiumUser(true);
      showToast("Mese Premium attivato!", "info", <Shield size={18} className="text-purple-400" />);
    } else if (reward.id === 'reward_discount_partner') {
      showToast("Codice Sconto: SOCIALMIX20 (simulato)", "info", <Percent size={18} className="text-teal-400" />);
    } else if (reward.id === 'reward_exclusive_avatar') {
      setUserAvatar(PANDA_AVATAR_REWARD_URL); 
      showToast("Avatar Esclusivo Panda sbloccato!", "info", <Smile size={18} className="text-emerald-400" />);
    }
  };

  const openPaymentCodeModal = (data: PaymentCodeModalData) => { setPaymentCodeModalData(data); };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? {...n, isRead: true} : n));
  };

  const markChatAsRead = (chatId: string) => {
    setChatMessages(prev => prev.map(c => c.id === chatId ? {...c, unreadCount: 0} : c));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) { 
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null || e.changedTouches.length === 0) {
      return;
    }
  
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
  
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;
  
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaY) < MAX_VERTICAL_SWIPE_DIST) {
      const categoriesCycle: DisplayCategory[] = ["locali", "all", "events"];
      const currentIndex = categoriesCycle.indexOf(displayCategory);
  
      let newIndex;
      if (deltaX > 0) { 
        newIndex = (currentIndex - 1 + categoriesCycle.length) % categoriesCycle.length;
      } else { 
        newIndex = (currentIndex + 1) % categoriesCycle.length;
      }
  
      if (categoriesCycle[newIndex] !== displayCategory) {
          setDisplayCategory(categoriesCycle[newIndex]);
          resetAllFilters(); 
      }
    }
  };

  const handleInitiatePayBill = (localeId: string) => {
    const locale = localeData.find(l => l.id === localeId);
    if (!locale) return;

    setInputModalConfig({
      title: `Paga Conto da ${locale.name}`,
      message: "Inserisci l'importo totale del conto da pagare.",
      inputLabel: "Importo Totale Conto (€)*",
      inputType: "number",
      inputMode: "decimal",
      placeholder: "Es. 40.00",
      min: "0.01",
      step: "0.01",
      confirmText: "Avanti",
      onConfirm: (value) => {
        const totalAmount = parseFloat(value);
        if (isNaN(totalAmount) || totalAmount <= 0) {
          showToast("Inserisci un importo valido per il conto.", "error");
          return;
        }
        setBillDetailsByLocaleId(prev => new Map(prev).set(localeId, { 
          totalAmount, 
          creditContributed: 0, 
          status: 'awaiting_credit_application' 
        }));
        setInputModalConfig(null);
        setShowPayWithCreditAmountModalData({
          itemType: 'locale',
          itemId: localeId,
          itemName: locale.name,
          maxAmount: totalAmount, 
          currentContribution: 0, 
          isEventFee: false,
        });
      }
    });
  };

  const handleOpenCreditApplicationModal = (localeId: string, totalBill: number, creditApplied: number) => {
     const locale = localeData.find(l => l.id === localeId);
     if (!locale) return;
      setShowPayWithCreditAmountModalData({
        itemType: 'locale',
        itemId: localeId,
        itemName: locale.name,
        maxAmount: totalBill,
        currentContribution: creditApplied,
        isEventFee: false,
      });
  };
  
  const handleApplyCreditToBill = (localeId: string, amountToApply: number) => {
    const bill = billDetailsByLocaleId.get(localeId);
    const locale = localeData.find(l => l.id === localeId);
    if (!bill || !locale) {
      showToast("Errore nel trovare i dettagli del conto.", "error");
      setShowPayWithCreditAmountModalData(null);
      return;
    }

    if (amountToApply > userCredit) {
      showToast("Credito insufficiente.", "error");
      return; 
    }
    
    const newCreditContributed = bill.creditContributed + amountToApply;
    const remainingOnBill = bill.totalAmount - newCreditContributed;

    setUserCredit(prev => prev - amountToApply);
    setBillDetailsByLocaleId(prevMap => {
      const newMap = new Map(prevMap);
      const newStatus: BillDetails['status'] = remainingOnBill <= 0 ? 'ready_to_finalize' : 'awaiting_credit_application';
      newMap.set(localeId, {
        ...bill,
        creditContributed: newCreditContributed,
        status: newStatus
      });
      return newMap;
    });
        
    if (selectedLocale && selectedLocale.id === localeId) {
        setSelectedLocale(prevSelectedLocale => {
          if (!prevSelectedLocale) return null; 

          const newResolvedStatus: BillDetails['status'] = remainingOnBill <= 0 
            ? 'ready_to_finalize' 
            : 'awaiting_credit_application';

          const baseBillDetails: BillDetails = prevSelectedLocale.billDetails || { 
            totalAmount: bill.totalAmount, 
            creditContributed: 0, 
            status: 'awaiting_credit_application'
          };
          
          const updatedBillDetails: BillDetails = {
            ...baseBillDetails,
            creditContributed: newCreditContributed,
            status: newResolvedStatus 
          };
          return {...prevSelectedLocale, billDetails: updatedBillDetails};
        });
    }

    showToast(`€${amountToApply.toFixed(2)} di credito applicati al conto di ${locale.name}.`, "success", <CreditCardIcon size={18}/>);
    if (remainingOnBill <=0) {
        showToast("Conto coperto dal credito! Pronto per finalizzare.", "info");
    }
    setShowPayWithCreditAmountModalData(null);
  };

  const handleFinalizeBillPayment = (localeId: string, amountPaidWithCredit: number) => {
    const bill = billDetailsByLocaleId.get(localeId);
    const locale = localeData.find(l => l.id === localeId);
    if (!bill || !locale) {
      showToast("Errore nel finalizzare il pagamento.", "error");
      return;
    }

    const finalBillDetails: BillDetails = {
      ...bill,
      status: 'paid_with_credit',
    };

    setBillDetailsByLocaleId(prev => new Map(prev).set(localeId, finalBillDetails));
    
    if (selectedLocale && selectedLocale.id === localeId) {
        setSelectedLocale(prev => ({...prev!, billDetails: finalBillDetails }));
    }
    
    const paymentCode = `TVL-${Math.random().toString(36).substring(2, 5).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    setPaymentCodeModalData({
      itemName: locale.name,
      itemType: 'locale',
      details: "Pagamento Conto al Tavolo",
      amount: `€${amountPaidWithCredit.toFixed(2)} (con credito)`,
      qrCodeUrl: SIMULATED_QR_CODE_URL,
      paymentCode: paymentCode,
    });
    showToast(`Pagamento di €${amountPaidWithCredit.toFixed(2)} per ${locale.name} finalizzato con credito! Mostra il codice.`, "success", <QrCode size={18}/>);
    updateUserProgress('PAY_LOCALE_BILL_WITH_CREDIT', { localeId, amount: amountPaidWithCredit });
  };
  
  const currentEventCategoriesForFilter = Array.from(new Set(eventData
    .filter(e => {
      const eventDate = new Date(e.date);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .map(e => e.category)));

  let isFunnelButtonDisabled = false;
  if (activeTab === 'home') {
    if (displayCategory === 'locali') {
      isFunnelButtonDisabled = localeCuisineTypes.length === 0;
    } else if (displayCategory === 'events') {
      isFunnelButtonDisabled = currentEventCategoriesForFilter.length === 0 && EVENT_COST_OPTIONS.length === 0;
    } else { // 'all'
      isFunnelButtonDisabled = localeCuisineTypes.length === 0 && currentEventCategoriesForFilter.length === 0 && EVENT_COST_OPTIONS.length === 0;
    }
  }
  
  const renderHome = () => { 
    const showLocali = displayCategory === 'all' || displayCategory === 'locali';
    const showEvents = displayCategory === 'all' || displayCategory === 'events'; 
    const noLocaliFound = showLocali && filteredLocali.length === 0;
    const noEventsFound = showEvents && filteredEvents.length === 0; 

    // This padding is for the inner scrollable list inside Home, to not be obscured by FAB
    // It does not need to account for nav/search/filter as those are handled by <main>'s padding
    const homeListPaddingBottom = FAB_BUTTON_HEIGHT_PX + BASE_MARGIN_PX * 2; 

    return ( 
      <div className="flex flex-col flex-1"> 
        <CategoryToggleComponent displayCategory={displayCategory} setDisplayCategory={setDisplayCategory} resetAllFilters={resetAllFilters} />
        
        {/* Map Preview is part of the scrollable content of Home */}
        {(!search || search.length === 0) && activeTab === 'home' && <MapPreviewComponent setShowGlobalMap={setShowGlobalMap} />}
        
        <div 
          className="flex flex-col gap-4 sm:gap-5 overflow-y-auto no-scrollbar flex-1"
          ref={mainContentRef} 
          style={{ paddingBottom: `${homeListPaddingBottom}px`}}
          onTouchStart={activeTab === 'home' ? handleTouchStart : undefined}
          onTouchEnd={activeTab === 'home' ? handleTouchEnd : undefined}
        > 
          {showLocali && (
            <> 
              {displayCategory === 'all' && filteredLocali.length > 0 && <h2 className="text-lg sm:text-xl font-bold text-slate-700 mt-2 mb-0 px-1 animate-fade-in">Locali</h2>}
              {filteredLocali.length > 0 ? filteredLocali.map((l, index) => {
                const favId = `locale_${l.id}`;
                return ( 
                  <ListCard key={l.id} onClick={() => setSelectedLocale(l)} itemType="locale" index={index}>
                    <ImageWithFallback itemKey={`loc_img_${l.id}`} src={l.img} alt={`Foto di ${l.name}`} errorText="Foto N/A" imgClassName="h-32 sm:h-36 w-full sm:w-32 md:w-40 rounded-xl object-cover flex-shrink-0" containerClassName="h-32 sm:h-36 w-full sm:w-32 md:w-40 rounded-xl flex-shrink-0" />
                    <div className="flex flex-col justify-between py-1 flex-1 min-w-0"> 
                      <div> 
                        <h3 className="font-bold text-md sm:text-lg text-slate-800 mb-0.5 sm:mb-1 truncate">{l.name}</h3> 
                        <p className="text-xs text-slate-500 mb-1 sm:mb-1.5 truncate"> {l.cuisine} • {l.price} • {l.distance} </p> 
                        <div className="flex items-center text-[10px] sm:text-xs text-sky-700 bg-sky-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold shadow-sm self-start mt-1">
                            <Users size={12} className="mr-1"/> {l.currentGuests}/{l.capacity} al tavolo
                        </div>
                        {l.hashtags && l.hashtags.length > 0 && ( 
                          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2"> 
                            {l.hashtags.slice(0,2).map(tag => <span key={tag} className="text-[9px] sm:text-[10px] bg-sky-100 text-sky-700 px-1.5 sm:px-2 py-0.5 rounded-full font-medium shadow-sm">#{tag}</span>)} 
                          </div> 
                        )} 
                      </div> 
                      <div className="flex items-center text-xs sm:text-sm text-amber-600 font-bold mt-1.5 sm:mt-2"> 
                        {(() => {
                          const starPropsAmber: LucideProps = { size: 16, className: "mr-1 sm:mr-1.5 fill-amber-500 text-amber-500" };
                          return <Star {...starPropsAmber} />;
                        })()} {l.rating.toFixed(1)} <span className="text-slate-500 font-normal ml-1 sm:ml-1.5 text-[10px] sm:text-xs">({l.reviews} rec.)</span> 
                      </div> 
                    </div> 
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(l, 'locale'); }} className={`p-2.5 sm:p-3 rounded-full hover:bg-${CORAL_PRIMARY}-100/80 transition-all duration-200 self-start sm:self-center focus:outline-none focus:ring-2 focus:ring-${CORAL_PRIMARY}-300 active:scale-90`} aria-label={isFavorite(favId) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"} > 
                      <Heart size={20} className={`transition-all ${isFavorite(favId) ? `text-${CORAL_PRIMARY}-500 fill-${CORAL_PRIMARY}-500 scale-110` : `text-slate-400 hover:text-${CORAL_PRIMARY}-400`}`} /> 
                    </button> 
                  </ListCard> 
                ); 
              }) : (displayCategory === 'locali' && <p className="text-center text-slate-500 mt-8 py-4 animate-fade-in">Nessun locale trovato.</p>)}
            </> 
          )} 
          {showEvents && ( 
            <> 
              {displayCategory === 'all' && filteredEvents.length > 0 && <h2 className="text-lg sm:text-xl font-bold text-slate-700 mt-4 mb-0 px-1 animate-fade-in">Prossimi Eventi</h2>} 
              {filteredEvents.length > 0 ? filteredEvents.map((e, index) => { 
                const favId = `event_${e.id}`; 
                let availabilityBadge: React.ReactNode = null; 
                const associatedLocale = e.localeId ? localeData.find(l => l.id === e.localeId) : null;

                if (associatedLocale && associatedLocale.capacity > 0) {
                    availabilityBadge = (
                        <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm 
                            ${ e.currentParticipants >= associatedLocale.capacity ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                           <Users size={12}/> {e.currentParticipants}/{associatedLocale.capacity} part.
                        </span>
                    );
                } else if (e.isUserCreated) { 
                  const starPropsPurple: LucideProps = { size: 12, className: "fill-purple-500 text-purple-500" };
                  availabilityBadge = <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-purple-100 text-purple-700 font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm"><Star {...starPropsPurple}/>Creato da te</span>; 
                } else if (e.isCharityEvent) { 
                  availabilityBadge = <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-pink-100 text-pink-700 font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm"><Gift size={12} className="text-pink-500"/>Beneficenza</span>; 
                } else if (e.maxParticipants > 0) { 
                  const availabilityRatio = e.currentParticipants / e.maxParticipants;
                  if (availabilityRatio >= 1) { 
                    availabilityBadge = <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-red-100 text-red-700 font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm"><AlertTriangle size={12}/>Completo</span>; 
                  } else if (availabilityRatio > 0.85) { 
                    availabilityBadge = <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-orange-100 text-orange-700 font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm"><Users size={12}/>Quasi Pieno</span>; 
                  } else if (availabilityRatio > 0.5) { 
                    availabilityBadge = <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-yellow-100 text-yellow-700 font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm"><Users size={12}/>Posti Limitati</span>; 
                  } 
                } 
                return ( 
                  <ListCard key={e.id} onClick={() => setSelectedEvent(e)} itemType="event" index={index} isCharity={e.isCharityEvent}> 
                    <ImageWithFallback itemKey={`event_img_${e.id}`} src={e.img} alt={`Foto di ${e.name}`} errorText="Foto N/A" imgClassName="h-32 sm:h-36 w-full sm:w-32 md:w-40 rounded-xl object-cover flex-shrink-0" containerClassName="h-32 sm:h-36 w-full sm:w-32 md:w-40 rounded-xl flex-shrink-0" /> 
                    <div className="flex flex-col justify-between py-1 flex-1 min-w-0"> 
                      <div> 
                        <div className="flex justify-between items-start mb-0.5 sm:mb-1"> 
                          <h3 className="font-bold text-md sm:text-lg text-slate-800 truncate pr-2">{e.name}</h3> 
                          {availabilityBadge && <div className="flex-shrink-0 ml-1 sm:ml-2 mt-0.5">{availabilityBadge}</div>} 
                        </div> 
                        <p className="text-xs text-slate-500 mb-0.5 truncate">{e.category} • {new Date(e.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} • {e.time}</p> 
                        <p className="text-xs text-slate-500 mb-1 sm:mb-1.5 truncate"><MapPinIconLucide size={10} className="inline mr-1"/>{e.location || "Luogo da definire"}</p> 
                        {e.hashtags && e.hashtags.length > 0 && ( 
                          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2"> 
                            {e.hashtags.slice(0,2).map(tag => <span key={tag} className={`text-[9px] sm:text-[10px] ${e.isCharityEvent ? 'bg-pink-100 text-pink-700' : `bg-${CORAL_TAG_BG} ${CORAL_TAG_TEXT}`} px-1.5 sm:px-2 py-0.5 rounded-full font-medium shadow-sm`}>#{tag}</span>)} 
                          </div> 
                        )} 
                      </div> 
                      <div className="flex items-center justify-between mt-2 sm:mt-2.5"> 
                        <div className="text-xs text-slate-600"> 
                          {e.partecipationFee ? ( <span className="font-semibold text-green-600 text-sm">{e.partecipationFee}</span> ) : ( <span className="font-semibold text-green-600 text-sm">Gratuito</span> )} 
                          {e.maxParticipants > 0 && !e.isCharityEvent && !associatedLocale && <span className="ml-1.5 sm:ml-2 text-slate-500 text-[10px] sm:text-xs">({e.currentParticipants}/{e.maxParticipants} part.)</span>}
                          {e.isCharityEvent && e.donationsReceived > 0 && <span className="ml-1.5 sm:ml-2 text-pink-600 text-[10px] sm:text-xs font-medium">€{e.donationsReceived.toLocaleString('it-IT')} raccolti</span>} 
                        </div> 
                        <button onClick={(ev) => { ev.stopPropagation(); toggleFavorite(e, 'event'); }} className={`p-2.5 sm:p-3 rounded-full hover:bg-${CORAL_PRIMARY}-100/80 transition-all duration-200 self-start sm:self-center focus:outline-none focus:ring-2 focus:ring-${CORAL_PRIMARY}-300 active:scale-90`} aria-label={isFavorite(favId) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"} > 
                          <Heart size={20} className={`transition-all ${isFavorite(favId) ? `text-${CORAL_PRIMARY}-500 fill-${CORAL_PRIMARY}-500 scale-110` : `text-slate-400 hover:text-${CORAL_PRIMARY}-400`}`} /> 
                        </button> 
                      </div> 
                    </div> 
                  </ListCard> 
                ); 
              }) : (displayCategory === 'events' && <p className="text-center text-slate-500 mt-8 py-4 animate-fade-in">Nessun evento trovato.</p>)}
            </> 
          )} 
          {noLocaliFound && noEventsFound && displayCategory !== 'all' && (
            <p className="text-center text-slate-500 mt-8 py-4 animate-fade-in"> 
              Nessun risultato trovato per "{displayCategory === 'locali' ? 'locali' : 'eventi'}" con i filtri attuali.
            </p> 
          )} 
          {noLocaliFound && noEventsFound && displayCategory === 'all' && (
            <p className="text-center text-slate-500 mt-8 py-4 animate-fade-in"> 
              Nessun locale o evento trovato. Prova a modificare la ricerca o i filtri.
            </p> 
          )} 
        </div> 
      </div> 
    ); 
  };

  const renderCalendar = () => {
    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay(); 
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    
    const todayFull = new Date();
    todayFull.setHours(0,0,0,0);
    const todayDate = todayFull.getDate();
    const todayMonth = todayFull.getMonth();
    const todayYear = todayFull.getFullYear();
    
    const monthDays = daysInMonth(currentMonthDate);
    let firstDay = firstDayOfMonth(currentMonthDate);
    firstDay = firstDay === 0 ? 6 : firstDay -1; 

    const blanks = Array(firstDay).fill(null);
    const days = Array.from({length: monthDays}, (_, i) => i + 1);
    const monthEvents = eventData.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getMonth() === currentMonthDate.getMonth() && eventDate.getFullYear() === currentMonthDate.getFullYear();
    });

    return (
        <div className="animate-page-content-enter flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
                <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))} className="p-2.5 rounded-full hover:bg-slate-200 transition-colors"><ChevronLeft size={22} className="text-slate-600" /></button>
                <h2 className="text-lg sm:text-xl font-bold text-slate-700 text-center">
                    {currentMonthDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))} className="p-2.5 rounded-full hover:bg-slate-200 transition-colors"><ChevronRight size={22} className="text-slate-600" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs sm:text-sm font-medium text-slate-500 mb-1.5 sm:mb-2">
                {daysOfWeek.map(day => <div key={day}>{day.slice(0,3)}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1 overflow-y-auto no-scrollbar">
                {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-slate-50/70 rounded-md sm:rounded-lg"></div>)}
                {days.map(day => {
                    const isToday = day === todayDate && currentMonthDate.getMonth() === todayMonth && currentMonthDate.getFullYear() === todayYear;
                    const dayEvents = monthEvents.filter(e => new Date(e.date).getDate() === day);
                    return (
                        <div key={day} className={`p-1.5 sm:p-2 border rounded-md sm:rounded-lg min-h-[64px] sm:min-h-[80px] flex flex-col ${isToday ? `bg-gradient-to-br from-${CORAL_PRIMARY}-200 via-${CORAL_PRIMARY}-100 to-${CORAL_PRIMARY}-50 border-${CORAL_PRIMARY}-300 shadow-md` : 'bg-white/80 border-slate-200/80 hover:shadow-sm transition-shadow'}`}>
                            <span className={`font-semibold text-xs sm:text-sm ${isToday ? `text-${CORAL_PRIMARY}-700` : 'text-slate-700'}`}>{day}</span>
                            <div className="mt-1 space-y-1 flex-1 overflow-y-auto no-scrollbar">
                                {dayEvents.map(e => (
                                    <div key={e.id} onClick={() => setSelectedEvent(e)} title={e.name}
                                         className={`text-[9px] sm:text-[10px] p-1 rounded ${e.isCharityEvent ? 'bg-pink-400/90 hover:bg-pink-500/90' : `bg-${CORAL_PRIMARY}-400/90 hover:bg-${CORAL_PRIMARY}-500/90`} text-white font-medium truncate cursor-pointer transition-colors`}>
                                        {e.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };
  
  const renderChat = () => (
    <div className="animate-page-content-enter flex-1 flex flex-col overflow-hidden space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3 px-1 flex items-center gap-1.5">
          <Bell size={20} className={`text-${CORAL_PRIMARY}-500`} />Notifiche ({unreadNotificationsCount})
        </h2>
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500 px-1">Nessuna notifica al momento.</p>
        ) : (
          <div className="space-y-2.5 sm:space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-1">
            {notifications.map(notif => {
              const NotificationIcon = notif.icon as LucideIcon; 
              return (
              <div
                key={notif.id}
                className={`py-3 px-2.5 sm:py-3.5 sm:px-3 rounded-xl border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  notif.isRead ? 'bg-white/70 border-slate-200 hover:bg-slate-100/50' : `bg-gradient-to-r from-${CORAL_PRIMARY}-50 via-${CORAL_PRIMARY}-50 to-white border-${CORAL_PRIMARY}-200 shadow-md hover:shadow-lg`
                }`}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.link) {
                    if (notif.link.itemId && notif.link.itemType === 'locale') {
                        const loc = localeData.find(l => l.id === notif.link.itemId);
                        if(loc) setSelectedLocale(loc);
                    } else if (notif.link.itemId && notif.link.itemType === 'event') {
                        const ev = eventData.find(e => e.id === notif.link.itemId);
                        if(ev) setSelectedEvent(ev);
                    }
                    setActiveTab(notif.link.tabId);
                  } else {
                    showToast(notif.title, 'info');
                  }
                }}
                role="button"
                aria-label={`Notifica: ${notif.title}. ${notif.description}`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <NotificationIcon size={20} className={`mt-0.5 flex-shrink-0 ${notif.iconColor || `text-${CORAL_PRIMARY}-500`}`} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${notif.isRead ? 'text-slate-700' : `text-${CORAL_PRIMARY}-700`} truncate`}>{notif.title}</p>
                    <p className="text-xs text-slate-500 truncate leading-snug">{notif.description}</p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 flex-shrink-0 pt-0.5">{new Date(notif.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-3 sm:pt-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3 px-1 flex items-center gap-1.5">
          <MessageSquare size={20} className="text-sky-500" />Messaggi ({unreadMessagesCount})
        </h2>
        {chatMessages.length === 0 ? (
          <p className="text-sm text-slate-500 px-1">Nessun messaggio.</p>
        ) : (
          <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1"> {/* Removed pb-28/32 here */}
            {chatMessages.map(chat => (
              <div
                key={chat.id}
                className={`py-3 px-2.5 sm:py-3.5 sm:px-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 sm:gap-3.5 active:scale-[0.98] ${
                  chat.unreadCount > 0 ? `bg-sky-50 border-sky-200 shadow-md hover:shadow-lg` : 'bg-white/70 border-slate-200 hover:bg-slate-100/50'
                }`}
                onClick={() => {
                    markChatAsRead(chat.id);
                    showToast(`Chat con ${chat.senderName} (Demo)`, 'info');
                }}
                role="button"
                aria-label={`Chat con ${chat.senderName}. Ultimo messaggio: ${chat.lastMessage}. ${chat.unreadCount > 0 ? `${chat.unreadCount} messaggi non letti.` : '' }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.avatar} alt={chat.senderName} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full" />
                  {chat.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white/80" aria-label={`${chat.unreadCount} messaggi non letti`}>
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`text-sm sm:text-md font-semibold ${chat.unreadCount > 0 ? 'text-sky-700' : 'text-slate-800'} truncate`}>{chat.senderName}</p>
                    <span className="text-xs text-slate-400 flex-shrink-0">{new Date(chat.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className={`text-xs text-slate-500 truncate leading-snug ${chat.isTyping ? 'italic text-sky-600' : ''}`}>
                    {chat.isTyping ? 'Sta scrivendo...' : chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
  const renderFavorites = () => { 
    const favoriteItems = Array.from(favorites.values()); 
    const heartIconPropsLarge: LucideProps = { size: 64, className: `mb-4 opacity-30 text-${CORAL_PRIMARY}-300` };
    const heartIconPropsSmall: LucideProps = { size: 14, className: `inline text-${CORAL_PRIMARY}-400` };

    return ( 
      <div className="animate-page-content-enter flex flex-col flex-1"> 
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-4 sm:mb-5 px-1">I Tuoi Preferiti ({favoriteItems.length})</h2> 
        {favoriteItems.length === 0 ? ( 
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-4"> 
            <Heart {...heartIconPropsLarge} /> 
            <p className="text-center text-sm leading-relaxed">Non hai ancora aggiunto nessun preferito. <br/>Esplora e clicca sull'icona <Heart {...heartIconPropsSmall}/> per salvarli qui!</p> 
          </div> 
        ) : ( 
          <div className="flex flex-col gap-4 sm:gap-5 overflow-y-auto no-scrollbar flex-1">  {/* Removed pb-28/32 here */}
            {favoriteItems.map((item, index) => {
              const isLocale = item.itemType === 'locale';
              return (
                <ListCard 
                    key={item.id} 
                    onClick={() => isLocale ? setSelectedLocale(item as Locale) : setSelectedEvent(item as Event)}
                    itemType={item.itemType}
                    index={index}
                    isCharity={!isLocale && (item as Event).isCharityEvent}
                >
                  <ImageWithFallback itemKey={`fav_img_${item.id}`} src={item.img!} alt={`Foto di ${item.name}`} errorText="Foto N/A" imgClassName="h-28 sm:h-32 w-full sm:w-28 md:w-36 rounded-xl object-cover flex-shrink-0" containerClassName="h-28 sm:h-32 w-full sm:w-28 md:w-36 rounded-xl flex-shrink-0" />
                  <div className="flex flex-col justify-center py-1 flex-1 min-w-0">
                    <h3 className="font-bold text-md sm:text-lg text-slate-800 mb-0.5 sm:mb-1 truncate">{item.name}</h3>
                    {isLocale ? (
                      <>
                        <p className="text-xs text-slate-500 mb-1 sm:mb-1.5 truncate">{(item as Locale).cuisine} • {(item as Locale).price}</p>
                        <div className="flex items-center text-xs sm:text-sm text-amber-600 font-bold mt-1">
                          <Star size={16} className="mr-1 sm:mr-1.5 fill-amber-500 text-amber-500" /> {(item as Locale).rating?.toFixed(1)}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-slate-500 mb-0.5 truncate">{(item as Event).category} • {new Date((item as Event).date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</p>
                        <p className="text-xs text-slate-500 truncate"><MapPinIconLucide size={10} className="inline mr-1"/>{(item as Event).location || "N/D"}</p>
                      </>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item as Locale | Event, item.itemType); }} className={`p-2.5 sm:p-3 rounded-full hover:bg-red-100/80 transition-all duration-200 self-center focus:outline-none focus:ring-2 focus:ring-red-300 active:scale-90`} aria-label="Rimuovi dai preferiti">
                    <Trash2 size={20} className={`text-red-500`} />
                  </button>
                </ListCard>
              );
            })}
          </div> 
        )} 
      </div> 
    ); 
  };
  
  const renderProfile = () => {
    const joinedUpcomingEvents = eventData
        .filter(e => {
            const eventDate = new Date(e.date);
            const today = new Date(); today.setHours(0,0,0,0);
            return joinedEvents.has(e.id) && eventDate >= today;
        })
        .sort((a,b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
    
    const activeGamificationObjectives = objectives.filter(obj => !obj.isCompleted).slice(0, 5); 
    
    const activeJoinedTables = localeData.filter(l => joinedRestaurantTables.has(l.id));

    return (
        <div className="animate-page-content-enter flex-1 overflow-y-auto space-y-5 sm:space-y-6"> {/* Removed pb-28/32 here */}
            {/* User Info Card with Level & Progress */}
            <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 p-5 sm:p-6 rounded-b-3xl shadow-xl text-white">
                <div className="flex items-center gap-3.5 sm:gap-4">
                    <img src={userAvatar} alt="Mario Rossi" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-3 border-white/50 shadow-lg"/>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Mario Rossi {isPremiumUser && <span title="Utente Premium"><Sparkles size={18} className="inline fill-yellow-300 text-yellow-400 ml-1" /></span>}</h2>
                        <p className="text-xs sm:text-sm text-slate-300">mario.rossi@example.com</p>
                        <button onClick={() => showToast("Modifica Profilo (Demo)", "info")} className="mt-2 sm:mt-2.5 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 active:scale-95">
                            <Edit size={14}/> Modifica
                        </button>
                    </div>
                </div>
                <div className="mt-4 sm:mt-5">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-semibold text-slate-200">Livello & Progresso</h3>
                        <span className="text-sm font-bold text-amber-400 bg-black/20 px-2.5 py-0.5 rounded-full">Liv. {levelDetails.level}</span>
                    </div>
                    <div className="w-full bg-slate-600/70 rounded-full h-3 sm:h-3.5 shadow-inner overflow-hidden">
                        <div className={`bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500 ease-out text-white text-[9px] sm:text-[10px] flex items-center justify-center font-bold`} style={{ width: `${levelDetails.progressPercentage}%` }}>
                            {levelDetails.progressPercentage > 20 && `${Math.round(levelDetails.progressPercentage)}%`}
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-right">
                        {levelDetails.xpForNextLevelStart === Infinity ? "Livello Massimo!" : `${levelDetails.xpNeededForNextLevel - levelDetails.xpIntoCurrentLevel} XP al Liv. ${levelDetails.level + 1}`}
                    </p>
                </div>
            </div>

            {/* Il Mio Credito */}
            <div className="bg-white shadow-lg rounded-xl p-4 sm:p-5 mx-1 sm:mx-0">
                <h3 className="text-md font-semibold text-slate-700 mb-2 sm:mb-2.5 flex items-center gap-1.5"><PiggyBank size={20} className="text-sky-500"/>Il Mio Credito</h3>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <p className="text-3xl sm:text-4xl font-bold text-sky-600">€{userCredit.toFixed(2)}</p>
                    <div className="flex gap-2 sm:gap-2.5">
                        <button onClick={() => setShowAddCreditModal(true)} className="p-2 sm:p-2.5 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 transition-colors active:scale-90 shadow-sm" title="Aggiungi Credito">
                            <PlusSquare size={20}/>
                        </button>
                        <button onClick={() => setShowWithdrawModal(true)} className="p-2 sm:p-2.5 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 transition-colors active:scale-90 shadow-sm" title="Ritira Credito">
                            <Banknote size={20}/>
                        </button>
                    </div>
                </div>
                <p className="text-xs text-slate-500 leading-snug">Usa il tuo credito per pagare quote eventi o conti al tavolo.</p>
            </div>
            
            {/* Tavoli a cui sei Unito */}
            {activeJoinedTables.length > 0 && (
              <div className="bg-white shadow-lg rounded-xl p-4 sm:p-5 mx-1 sm:mx-0">
                  <h3 className="text-md font-semibold text-slate-700 mb-2.5 sm:mb-3 flex items-center gap-1.5">
                      <UtensilsCrossed size={20} className="text-amber-500" />Tavoli a cui sei Unito
                  </h3>
                  {activeJoinedTables.map(localeItem => (
                    <div key={localeItem.id} className="mb-3 last:mb-0 p-2.5 bg-slate-50/70 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedLocale(localeItem)}>
                      <div className="flex items-center gap-3 sm:gap-3.5">
                          <ImageWithFallback src={localeItem.img} alt={localeItem.name} imgClassName="h-14 w-14 sm:h-16 sm:w-16 rounded-md object-cover" containerClassName="h-14 w-14 sm:h-16 sm:w-16 rounded-md flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{localeItem.name}</p>
                              <p className="text-xs text-slate-500">{localeItem.currentGuests}/{localeItem.capacity} persone al tavolo</p>
                                {billDetailsByLocaleId.get(localeItem.id)?.status === 'paid_with_credit' && (
                                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={12}/>Conto Pagato</p>
                                )}
                                {billDetailsByLocaleId.get(localeItem.id)?.status === 'ready_to_finalize' && (
                                  <p className="text-xs text-sky-600 mt-1 flex items-center gap-1"><CreditCardIcon size={12}/>Pronto per Finalizzare</p>
                                )}
                                {billDetailsByLocaleId.get(localeItem.id)?.status === 'awaiting_credit_application' && (
                                  <p className="text-xs text-purple-600 mt-1 flex items-center gap-1"><CreditCardIcon size={12}/>Applica Credito</p>
                                )}
                          </div>
                          <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Prossimi Eventi a cui Partecipi */}
            {joinedUpcomingEvents.length > 0 && (
                <div className="bg-white shadow-lg rounded-xl p-4 sm:p-5 mx-1 sm:mx-0">
                    <h3 className="text-md font-semibold text-slate-700 mb-2.5 sm:mb-3 flex items-center gap-1.5"><Ticket size={20} className={`text-${CORAL_PRIMARY}-500`}/>Prossimi Eventi a cui Partecipi</h3>
                    <div className="space-y-3 sm:space-y-3.5">
                        {joinedUpcomingEvents.map(event => (
                            <div key={event.id} className="p-2.5 sm:p-3 bg-slate-50/70 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]" onClick={() => setSelectedEvent(event)}>
                                <div className="flex items-center gap-3 sm:gap-3.5">
                                    <ImageWithFallback src={event.img} alt={event.name} imgClassName="h-14 w-14 sm:h-16 sm:w-16 rounded-md object-cover" containerClassName="h-14 w-14 sm:h-16 sm:w-16 rounded-md flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{event.name}</p>
                                        <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })} - {event.time}</p>
                                         {event.partecipationFee && !event.paidWithCredit && isPayableTodayOrTomorrow(event.date) && userCredit >= parseFloat(event.partecipationFee.replace('€','')) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowPayWithCreditAmountModalData({ itemType: 'event', itemId: event.id, itemName: event.name, maxAmount: parseFloat(event.partecipationFee!.replace('€', '')), isEventFee: true });
                                                }}
                                                className="mt-1.5 text-xs bg-sky-500 hover:bg-sky-600 text-white font-semibold px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                                            >
                                                <Banknote size={14} /> Paga Quota con Credito
                                            </button>
                                        )}
                                         {event.partecipationFee && !event.paidWithCredit && isPayableTodayOrTomorrow(event.date) && userCredit < parseFloat(event.partecipationFee.replace('€','')) && (
                                             <p className="text-[10px] text-red-500 mt-1">Credito insuff. per pagare ora</p>
                                         )}
                                         {event.paidWithCredit && (
                                             <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={12}/>Quota pagata</p>
                                         )}
                                    </div>
                                    <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Eventi Passati (Accordion) */}
            {pastJoinedEvents.length > 0 && (
                <div className="bg-white shadow-lg rounded-xl mx-1 sm:mx-0 overflow-hidden">
                    <button
                        onClick={() => setShowPastJoinedEvents(!showPastJoinedEvents)}
                        className="w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-slate-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
                        aria-expanded={showPastJoinedEvents}
                        aria-controls="past-events-section"
                    >
                        <h3 className="text-md font-semibold text-slate-700 flex items-center gap-1.5">
                            <Clock size={20} className="text-indigo-500"/>Eventi Passati Partecipati ({pastJoinedEvents.length})
                        </h3>
                        {showPastJoinedEvents ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                    </button>
                    {showPastJoinedEvents && (
                        <div id="past-events-section" className="p-4 sm:p-5 border-t border-slate-200 animate-slide-down">
                            <div className="space-y-3 sm:space-y-3.5 max-h-96 overflow-y-auto no-scrollbar">
                                {pastJoinedEvents.map(event => (
                                  <div key={event.id} className="p-2.5 sm:p-3 bg-slate-50/70 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]" onClick={() => setSelectedEvent(event)}>
                                    <div className="flex items-center gap-3 sm:gap-3.5">
                                        <ImageWithFallback src={event.img} alt={event.name} imgClassName="h-14 w-14 sm:h-16 sm:w-16 rounded-md object-cover" containerClassName="h-14 w-14 sm:h-16 sm:w-16 rounded-md flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{event.name}</p>
                                            <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            {!event.userReviews?.find(r => r.userId === 'currentUser') && (
                                                <button onClick={(e) => { e.stopPropagation(); setShowReviewModal({ type: 'event', item: event }); }} className="mt-1.5 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 shadow-sm active:scale-95">
                                                    <Star size={14}/> Lascia Recensione
                                                </button>
                                            )}
                                        </div>
                                        <ChevronRight size={20} className="text-slate-400 flex-shrink-0"/>
                                    </div>
                                  </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Obiettivi Attivi (Accordion) */}
            {activeGamificationObjectives.length > 0 && (
                 <div className="bg-white shadow-lg rounded-xl mx-1 sm:mx-0 overflow-hidden">
                    <button
                        onClick={() => setShowActiveObjectives(!showActiveObjectives)}
                        className="w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-slate-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1"
                        aria-expanded={showActiveObjectives}
                        aria-controls="active-objectives-section"
                    >
                        <h3 className="text-md font-semibold text-slate-700 flex items-center gap-1.5">
                            <Target size={20} className="text-green-500"/>Obiettivi Attivi ({activeGamificationObjectives.length})
                        </h3>
                        {showActiveObjectives ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                    </button>
                    {showActiveObjectives && (
                        <div id="active-objectives-section" className="p-4 sm:p-5 border-t border-slate-200 animate-slide-down">
                            <div className="space-y-2.5 sm:space-y-3 max-h-96 overflow-y-auto no-scrollbar">
                                {activeGamificationObjectives.map(obj => (
                                    <div key={obj.id} className="p-2.5 sm:p-3 bg-green-50/70 rounded-lg border border-green-200 shadow-sm">
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <span className="p-2 bg-white rounded-full shadow-sm">{obj.icon}</span>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{obj.title} <span className="text-green-600 font-bold">(+{obj.xpValue} XP)</span></p>
                                                <p className="text-xs text-slate-500 leading-snug">{obj.description}</p>
                                                {obj.targetCount > 1 && obj.currentProgress !== undefined && (
                                                  <div className="mt-1.5 w-full bg-slate-200 rounded-full h-2 sm:h-2.5">
                                                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${(obj.currentProgress / obj.targetCount) * 100}%` }}></div>
                                                  </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* I Tuoi Badge (Accordion) */}
            {USER_BADGES.length > 0 && (
                <div className="bg-white shadow-lg rounded-xl mx-1 sm:mx-0 overflow-hidden">
                    <button
                        onClick={() => setShowUserBadgesSection(!showUserBadgesSection)}
                        className="w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-slate-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
                        aria-expanded={showUserBadgesSection}
                        aria-controls="user-badges-section"
                    >
                        <h3 className="text-md font-semibold text-slate-700 flex items-center gap-1.5">
                            <BadgePercent size={20} className="text-blue-500"/>I Tuoi Badge
                        </h3>
                        {showUserBadgesSection ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                    </button>
                    {showUserBadgesSection && (
                        <div id="user-badges-section" className="p-4 sm:p-5 border-t border-slate-200 animate-slide-down">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
                                {USER_BADGES.map(badge => {
                                   const hasBadge = objectives.some(obj => {
                                        if (badge.id === 'badge1' && obj.actionType === 'ADD_REVIEW_LOCALE' && obj.isCompleted && obj.targetCount >=3) return true;
                                        if (badge.id === 'badge2' && obj.actionType === 'ADD_REVIEW' && obj.isCompleted && obj.targetCount >=3) return true;
                                        if (badge.id === 'badge3' && obj.actionType === 'JOIN_EVENT' && obj.isCompleted && obj.targetCount >=3) return true;
                                        if (badge.id === 'badge4' && obj.actionType === 'MAKE_DONATION' && obj.isCompleted) return true;
                                        if (badge.id === 'badge5' && obj.actionType === 'JOIN_TABLE' && obj.isCompleted) return true;
                                        return false;
                                   });

                                   return (
                                    <div key={badge.id} title={badge.description} className={`p-3 sm:p-3.5 rounded-lg border-2 ${hasBadge ? `border-${badge.color}-300 bg-gradient-to-br from-${badge.color}-100 via-${badge.color}-50 to-white shadow-lg` : 'border-slate-200 bg-slate-100 opacity-60'} text-center transition-all`}>
                                        <div className={`mx-auto mb-1.5 sm:mb-2 p-2 rounded-full ${hasBadge ? `bg-${badge.color}-500/20` : 'bg-slate-200'} inline-block`}>
                                          {React.cloneElement(badge.icon, {
                                              size: 22,
                                              className: hasBadge ? `text-${badge.color}-700` : 'text-slate-400'
                                          })}
                                        </div>
                                        <p className={`text-xs font-semibold ${hasBadge ? `text-${badge.color}-700` : 'text-slate-500'}`}>{badge.name}</p>
                                    </div>
                                   );
                                })}
                                 <div title="Colleziona più badge completando obiettivi!" className={`p-3 sm:p-3.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 text-center shadow-sm flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-colors cursor-pointer active:scale-95`}>
                                    <PlusCircle size={22} className={`mb-1.5 sm:mb-2`}/>
                                    <p className={`text-xs font-semibold`}>Altri Badge...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Premi (Accordion) */}
            <div className="bg-white shadow-lg rounded-xl mx-1 sm:mx-0 overflow-hidden">
                <button
                    onClick={() => setShowRewardsSection(!showRewardsSection)}
                    className={`w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-slate-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-${CORAL_PRIMARY}-300 focus:ring-offset-1`}
                    aria-expanded={showRewardsSection}
                    aria-controls="rewards-section"
                >
                    <h3 className="text-md font-semibold text-slate-700 flex items-center gap-1.5">
                        <ShoppingBag size={20} className={`text-${CORAL_PRIMARY}-500`}/>Premi (XP: {userXP})
                    </h3>
                    {showRewardsSection ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                </button>
                {showRewardsSection && (
                    <div id="rewards-section" className="p-4 sm:p-5 border-t border-slate-200 animate-slide-down">
                        <div className="space-y-3 sm:space-y-3.5 max-h-96 overflow-y-auto no-scrollbar">
                           {rewardsData.map(reward => {
                                const isClaimed = claimedRewards.has(reward.id);
                                const canAfford = userXP >= reward.xpCost;
                                return (
                                    <div key={reward.id} className={`p-3 sm:p-3.5 rounded-lg border-2 flex items-center gap-3 sm:gap-3.5
                                        ${isClaimed ? `border-${reward.color}-200 bg-${reward.color}-50/50 opacity-70` 
                                                   : `border-${reward.color}-300 bg-gradient-to-br from-${reward.color}-100 via-${reward.color}-50 to-white shadow-md`} `}>
                                        <div className={`p-2.5 rounded-full ${isClaimed ? `bg-${reward.color}-200` : `bg-${reward.color}-500/20`}`}>
                                            {React.cloneElement(reward.icon as React.ReactElement<LucideProps>, { className: `text-${reward.color}-${isClaimed ? '400' : '700'}` })}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-semibold ${isClaimed ? `text-${reward.color}-600` : `text-${reward.color}-800`}`}>{reward.name}</p>
                                            <p className="text-xs text-slate-600 leading-snug">{reward.description}</p>
                                            <p className={`text-xs font-bold mt-1 ${isClaimed ? `text-${reward.color}-500` : `text-${reward.color}-700`}`}>Costo: {reward.xpCost} XP</p>
                                        </div>
                                        <button
                                            onClick={() => handleClaimReward(reward.id)}
                                            disabled={isClaimed || !canAfford}
                                            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors shadow-sm active:scale-95
                                                ${isClaimed ? `bg-slate-300 text-slate-500 cursor-not-allowed` 
                                                           : canAfford ? `bg-${reward.color}-500 hover:bg-${reward.color}-600 text-white` 
                                                                       : `bg-slate-200 text-slate-400 cursor-not-allowed`}`}
                                        >
                                            {isClaimed ? "Riscattato" : "Riscatta"}
                                        </button>
                                    </div>
                                );
                           })}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Impostazioni & Azioni */}
             <div className="bg-white shadow-lg rounded-xl p-4 sm:p-5 mx-1 sm:mx-0">
                <h3 className="text-md font-semibold text-slate-700 mb-2.5 sm:mb-3 flex items-center gap-1.5"><Settings size={20} className="text-slate-500"/>Impostazioni & Azioni</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-sm">
                    {[
                        { label: "Diventa Ambassador", icon: Award, action: () => setShowAmbassadorModal(true), color: "amber" },
                        { label: "Abbonamento Premium", icon: Shield, action: () => setShowSubscriptionModal(true), color: "purple" },
                        { label: "Invita Amici App", icon: UsersRound, action: () => showToast("Invita Amici all'App (Demo)", "info"), color: "indigo" },
                        { label: "Centro Assistenza", icon: HelpCircle, action: () => showToast("Centro Assistenza (Demo)", "info"), color: "green" },
                        { label: "Esci", icon: LogOut, action: () => showToast("Logout Effettuato (Demo)", "info"), color: "red" },
                    ].map(item => {
                        const ActionIcon = item.icon as LucideIcon; 
                        return (
                         <button key={item.label} onClick={item.action} className={`p-3 sm:p-3.5 rounded-lg border border-${item.color}-200 bg-${item.color}-50/70 hover:bg-${item.color}-100/80 text-${item.color}-700 font-medium transition-colors shadow-sm hover:shadow-md flex flex-col items-center justify-center gap-1.5 sm:gap-2 active:scale-95 min-h-[80px] sm:min-h-[90px]`}>
                            <ActionIcon size={20} />
                            {item.label}
                        </button>
                    );
                    })}
                </div>
            </div>
        </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home": return renderHome();
      case "calendar": return renderCalendar();
      case "chat": return renderChat();
      case "favorites": return renderFavorites();
      case "profile": return renderProfile();
      default: return <p>Tab non trovato</p>;
    }
  };
  
  const totalActiveFilters = activeLocaleFilters.size + activeEventFilters.size;

  // Calculate dynamic padding for the <main> element
  let mainPaddingBottomPx = NAV_BAR_BASE_HEIGHT_PX;
  if (activeTab === 'home') {
    mainPaddingBottomPx += BOTTOM_SEARCH_BAR_HEIGHT_PX;
    if (showFilterPanel) {
      mainPaddingBottomPx += HOME_FILTER_PANEL_MAX_HEIGHT_PX;
    }
  }

  // Calculate dynamic bottom position for FAB
  let fabBottomPx = NAV_BAR_BASE_HEIGHT_PX + BASE_MARGIN_PX;
  if (activeTab === 'home') {
    fabBottomPx += BOTTOM_SEARCH_BAR_HEIGHT_PX;
    // Removed filter panel height from FAB positioning as it's separate from main scroll
  }
  const fabContainerStyle = { bottom: `${fabBottomPx}px` };

  // Calculate dynamic bottom position for Toast
  // Toast should be above FAB, so its calculation depends on FAB's position
  const toastBottomPx = fabBottomPx + FAB_BUTTON_HEIGHT_PX + (BASE_MARGIN_PX / 2) ;
  const toastStyle = { bottom: `${toastBottomPx}px` };


  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden">
      
      <main 
        className="flex-1 overflow-y-auto p-3.5 sm:p-4 pt-6 sm:pt-8 animate-page-content-enter"
        style={{ paddingBottom: `${mainPaddingBottomPx}px` }}
      >
        {renderContent()}
      </main>

      {/* Filter Panel (Home Tab Only) - Positioned above Search Bar */}
      {activeTab === 'home' && (
        <div 
          className="fixed left-0 right-0 bg-slate-100 shadow-lg z-10 transition-all duration-300 ease-in-out overflow-y-auto no-scrollbar border-t border-b border-slate-200"
          style={{
            bottom: `${NAV_BAR_BASE_HEIGHT_PX + BOTTOM_SEARCH_BAR_HEIGHT_PX}px`,
            maxHeight: showFilterPanel ? `${HOME_FILTER_PANEL_MAX_HEIGHT_PX}px` : '0px',
            opacity: showFilterPanel ? 1 : 0,
            visibility: showFilterPanel ? 'visible' : 'hidden',
          }}
        >
          <FilterSectionComponent 
              displayCategory={displayCategory}
              restaurantCuisineTypes={localeCuisineTypes}
              eventData={eventData}
              activeRestaurantFilters={activeLocaleFilters}
              toggleRestaurantFilter={toggleLocaleFilter}
              resetRestaurantFilters={resetLocaleFilters}
              activeEventFilters={activeEventFilters}
              toggleEventFilter={toggleEventFilter}
              resetEventFilters={resetEventFilters}
              showRestaurantFilterSection={showLocaleFilterSection}
              setShowRestaurantFilterSection={setShowLocaleFilterSection}
              showEventFilterSection={showEventFilterSection}
              setShowEventFilterSection={setShowEventFilterSection}
          />
        </div>
      )}


      {/* Bottom Search Bar (Home Tab Only) */}
      <div 
        className={`bg-white/95 backdrop-blur-md px-3 sm:px-3.5 
                    fixed left-0 right-0 z-20 transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-200/70
                    ${activeTab === 'home' ? 'py-2.5 bottom-search-bar-visible' : 'max-h-0 opacity-0 py-0 border-t-0 bottom-search-bar-hidden'}`}
        style={{ bottom: `${NAV_BAR_BASE_HEIGHT_PX}px`, height: activeTab === 'home' ? `${BOTTOM_SEARCH_BAR_HEIGHT_PX}px` : '0px' }} 
      >
        {activeTab === 'home' && (
          <div className="flex items-center gap-2 sm:gap-2.5 h-full">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cerca locali, eventi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full h-9 sm:h-10 pl-9 pr-7 py-1.5 text-xs sm:text-sm bg-slate-100 border border-slate-300 rounded-lg focus:ring-1 focus:ring-${CORAL_PRIMARY}-500 focus:border-${CORAL_PRIMARY}-400 shadow-sm transition-shadow duration-200 focus:shadow-md focus:bg-white placeholder-slate-400`}
                aria-label="Cerca locali ed eventi"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                  aria-label="Cancella ricerca"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
                onClick={() => {
                  if (isFunnelButtonDisabled) {
                    showToast("Nessun filtro disponibile per la categoria corrente.", "info");
                  } else {
                    setShowFilterPanel(!showFilterPanel);
                  }
                }}
                className={`relative p-2 sm:p-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 flex-shrink-0
                            ${showFilterPanel && !isFunnelButtonDisabled
                              ? `bg-${CORAL_PRIMARY}-500 text-white shadow-md hover:bg-${CORAL_PRIMARY}-600 focus:ring-${CORAL_PRIMARY}-400` 
                              : `bg-slate-100 text-slate-600 hover:bg-slate-200 focus:ring-slate-400 border border-slate-300`
                            }
                            ${isFunnelButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Mostra o nascondi filtri"
                aria-expanded={showFilterPanel}
                disabled={isFunnelButtonDisabled}
              >
                <ListFilter size={18} />
                {totalActiveFilters > 0 && !isFunnelButtonDisabled && (
                   <span className={`absolute -top-1 -right-1 h-4 w-4 text-[9px] rounded-full bg-${showFilterPanel ? 'white' : CORAL_PRIMARY}-500 text-${showFilterPanel ? CORAL_PRIMARY : 'white'}-700 border-2 border-white flex items-center justify-center font-bold`}>
                     {totalActiveFilters}
                   </span>
                )}
              </button>
          </div>
        )}
      </div>


      <nav className="bg-white/95 backdrop-blur-md shadow-top-strong sticky bottom-0 py-1.5 sm:py-2 z-20 border-t border-slate-200/70" style={{height: `${NAV_BAR_BASE_HEIGHT_PX}px`}}>
        <div className="flex justify-around h-full" role="tablist" aria-label="Navigazione principale">
          {navTabs.map((tab) => {
            const NavIcon = tab.icon; 
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center w-1/5 py-1.5 sm:py-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none group ${ 
                activeTab === tab.id
                  ? `text-${CORAL_PRIMARY}-600 scale-105` 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/60 active:bg-slate-200/60"
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`} 
              id={`${tab.id}-tab`}
            >
              <NavIcon size={activeTab === tab.id ? 24 : 22} className={`transition-all duration-200 ${activeTab === tab.id ? `fill-${CORAL_PRIMARY}-100/70` : ''}`} strokeWidth={activeTab === tab.id ? 2.5 : 2} aria-hidden="true"/>
              <span className={`text-[10px] sm:text-xs mt-0.5 font-medium transition-opacity duration-200 ${activeTab === tab.id ? 'opacity-100 font-bold' : 'opacity-80 group-hover:opacity-100'}`}>{tab.label}</span>
              {tab.badgeCount && tab.badgeCount > 0 && (
                 <span className="absolute top-0 right-1.5 sm:right-2.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white/80" aria-label={`${tab.badgeCount} notifiche non lette`}>
                    {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
                 </span>
              )}
            </button>
          );
        })}
        </div>
      </nav>

      <div ref={fabMenuRef} 
           className="fixed left-1/2 -translate-x-1/2 z-30 flex flex-col items-center transition-all duration-300 ease-in-out"
           style={fabContainerStyle}
      >
        {showFabMenu && (
          <div className="flex items-center mb-3.5 space-x-12 animate-fab-menu-open"> 
            <button
              onClick={() => { setShowProposeTableModal(true); setShowFabMenu(false); }}
              title="Proponi Tavolo"
              aria-label="Proponi un tavolo"
              className="bg-sky-500 hover:bg-sky-600 text-white p-3.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ClipboardList size={24} />
            </button>
            <button
              onClick={() => { setShowCreateEventModal(true); setShowFabMenu(false); }}
              title="Crea Evento"
              aria-label="Crea un evento"
              className={`bg-${CORAL_PRIMARY}-500 hover:bg-${CORAL_PRIMARY}-600 text-white p-3.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95`}
            >
              <PlusCircle size={24} />
            </button>
          </div>
        )}
        <button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className={`p-4 rounded-full text-white transition-all duration-300 transform active:scale-90 shadow-xl hover:shadow-2xl
                      ${showFabMenu ? `bg-gradient-to-br from-slate-600 to-slate-700 scale-105` : `bg-gradient-to-br from-${CORAL_PRIMARY}-500 to-pink-500 scale-100`}`}
          style={{ height: `${FAB_BUTTON_HEIGHT_PX}px`, width: `${FAB_BUTTON_HEIGHT_PX}px` }}
          aria-expanded={showFabMenu}
          aria-controls="fab-submenu" 
          aria-label={showFabMenu ? "Chiudi menu creazione" : "Apri menu creazione"}
        >
          <Plus size={28} className={`${showFabMenu ? 'rotate-45' : ''} transition-transform duration-300`} />
        </button>
      </div>


      {selectedLocale && (
            <LocaleModal 
                locale={selectedLocale} 
                onClose={() => setSelectedLocale(null)} 
                isFavorite={isFavorite} 
                toggleFavorite={toggleFavorite as any} 
                joinedRestaurantTables={joinedRestaurantTables} 
                handleJoinTable={handleJoinTable} 
                handleLeaveTable={handleLeaveTable}
                onCancelPaymentAndRefund={handleCancelPaymentAndRefund} 
                handleAddMenuPhoto={handleAddMenuPhoto} 
                setShowReviewModal={setShowReviewModal as any} 
                nearbyFriends={NEARBY_FRIENDS_DATA}
                billDetails={billDetailsByLocaleId.get(selectedLocale.id)}
                onInitiatePayBill={handleInitiatePayBill}
                onOpenCreditApplicationModal={handleOpenCreditApplicationModal}
                onFinalizeBillPayment={handleFinalizeBillPayment}
                showToast={showToast}
            />
      )}
      {selectedEvent && (
            <EventModal 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
                isFavorite={isFavorite} 
                toggleFavorite={toggleFavorite as any} 
                joinedEvents={joinedEvents} 
                handleJoinEventAttempt={handleJoinEventAttempt} 
                handleLeaveEvent={handleLeaveEvent} 
                setShowReviewModal={setShowReviewModal as any} 
                setShowDonationModal={setShowDonationModal} 
                showToast={showToast} 
                userCredit={userCredit}
                isPayableTodayOrTomorrow={isPayableTodayOrTomorrow}
                setShowPayWithCreditAmountModal={setShowPayWithCreditAmountModalData}
                locali={localeData} 
                nearbyFriends={NEARBY_FRIENDS_DATA}
                currentUserAvatar={userAvatar} 
            />
      )}

      {showCreateEventModal && (
        <FullScreenModalWrapper open={showCreateEventModal} onClose={() => setShowCreateEventModal(false)}>
          <CreateEventModal 
            onClose={() => setShowCreateEventModal(false)} 
            onCreate={handleCreateEvent} 
            showToast={showToast} 
            setShowInviteFriendsModal={setShowInviteFriendsModal} 
            invitedFriendsCount={invitedFriends.size} 
          />
        </FullScreenModalWrapper>
      )}
      {showProposeTableModal && (
        <FullScreenModalWrapper open={showProposeTableModal} onClose={() => setShowProposeTableModal(false)}>
          <ProposeTableModal 
            onClose={() => setShowProposeTableModal(false)} 
            onPropose={handleProposeTable} 
            locali={localeData} 
            showToast={showToast} 
          />
        </FullScreenModalWrapper>
      )}

      {showGlobalMap && <ModalWrapper open={true} onClose={() => setShowGlobalMap(false)} customClasses="w-full max-w-4xl"><GlobalMapModal onClose={() => setShowGlobalMap(false)} /></ModalWrapper>}
      {showInviteFriendsModal && <ModalWrapper open={true} onClose={() => setShowInviteFriendsModal(false)} customClasses="max-w-md w-full"><InviteFriendsModal onClose={() => setShowInviteFriendsModal(false)} currentInvited={invitedFriends} onInviteToggle={(name) => setInvitedFriends(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next;})} /></ModalWrapper>}
      {showAmbassadorModal && <ModalWrapper open={true} onClose={() => setShowAmbassadorModal(false)}><AmbassadorModal onClose={() => setShowAmbassadorModal(false)} showToast={showToast} /></ModalWrapper>}
      {showSubscriptionModal && <ModalWrapper open={true} onClose={() => setShowSubscriptionModal(false)}><SubscriptionModal onClose={() => setShowSubscriptionModal(false)} showToast={showToast} /></ModalWrapper>}
      {showReviewModal && <ModalWrapper open={true} onClose={() => setShowReviewModal(null)}><ReviewModal itemType={showReviewModal.type} item={showReviewModal.item} onClose={() => setShowReviewModal(null)} onSubmitReview={handleAddReview} showToast={showToast} /></ModalWrapper>}
      {showDonationModal && <ModalWrapper open={true} onClose={() => setShowDonationModal(null)}><DonationModal event={showDonationModal} onClose={() => setShowDonationModal(null)} onDonate={handleMakeDonation} showToast={showToast} /></ModalWrapper>}
      {showWithdrawModal && <ModalWrapper open={true} onClose={() => setShowWithdrawModal(false)}><WithdrawCreditModal currentCredit={userCredit} onClose={() => setShowWithdrawModal(false)} onWithdraw={handleWithdrawCredit} showToast={showToast}/></ModalWrapper>}
      {showAddCreditModal && <ModalWrapper open={true} onClose={() => setShowAddCreditModal(false)}><AddCreditModal onClose={() => setShowAddCreditModal(false)} onAddCredit={handleAddCredit} showToast={showToast} /></ModalWrapper>}
      {paymentCodeModalData && <ModalWrapper open={true} onClose={() => setPaymentCodeModalData(null)} customClasses="max-w-md w-full"><PaymentCodeModal data={paymentCodeModalData} onClose={() => setPaymentCodeModalData(null)} /></ModalWrapper>}
      {showPayWithCreditAmountModalData && <ModalWrapper open={true} onClose={() => setShowPayWithCreditAmountModalData(null)} customClasses="max-w-sm w-full"><PayWithCreditAmountModal data={showPayWithCreditAmountModalData} userCredit={userCredit} onClose={() => setShowPayWithCreditAmountModalData(null)} onConfirmPayment={(itemType, itemId, amount, isEventFee) => { if (isEventFee) { handlePayEventFeeWithCredit(itemId, amount); } else { handleApplyCreditToBill(itemId, amount); } }} showToast={showToast}/></ModalWrapper>}
      {inputModalConfig && (
        <ModalWrapper open={true} onClose={() => setInputModalConfig(null)} customClasses="max-w-md w-full">
            <InputModal
            title={inputModalConfig.title}
            message={inputModalConfig.message}
            inputLabel={inputModalConfig.inputLabel}
            inputType={inputModalConfig.inputType}
            inputMode={inputModalConfig.inputMode}
            placeholder={inputModalConfig.placeholder}
            initialValue={inputModalConfig.initialValue}
            confirmText={inputModalConfig.confirmText}
            min={inputModalConfig.min}
            step={inputModalConfig.step}
            onConfirm={inputModalConfig.onConfirm}
            onClose={() => setInputModalConfig(null)}
            showToast={showToast}
            />
        </ModalWrapper>
      )}

      {toast && (
        <div 
          className={`fixed left-1/2 -translate-x-1/2 max-w-xs sm:max-w-sm w-full px-4 py-3.5 rounded-xl shadow-2xl text-white text-sm sm:text-md font-semibold flex items-center gap-2.5 sm:gap-3 animate-toast-pop z-50
          ${toast.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
          ${toast.type === "error" ? "bg-gradient-to-r from-red-500 to-rose-600" : ""}
          ${toast.type === "info" ? "bg-gradient-to-r from-sky-500 to-blue-600" : ""}`}
          style={toastStyle}
          role="alert" aria-live="assertive"
        >
           {toast.icon ? toast.icon : (toast.type === "success" ? <CheckCircle size={22} /> : toast.type === "error" ? <AlertTriangle size={22}/> : <Info size={22}/>)}
          {toast.text}
        </div>
      )}
    </div>
  );
}