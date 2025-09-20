import React, { useState, useEffect } from 'react';
import { Locale } from '../../types'; 
import { ChevronLeft, ClipboardList, Send, AlertTriangle, Building, CalendarDays, Clock, Users, FileText, Info as InfoIconLucide, LucideProps, ImageOff as ImageIconLucide, DollarSign } from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';
import { CORAL_PRIMARY } from '../../constants';

interface ProposeTableModalProps {
  onClose: () => void;
  onPropose: (tableData: { localeName: string; date: string; time: string; numPeople: number; notes: string }) => void; 
  locali: Locale[]; 
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
}

const ProposeTableModal: React.FC<ProposeTableModalProps> = ({ onClose, onPropose, locali, showToast }) => { 
  const [selectedLocaleId, setSelectedLocaleId] = useState(locali.length > 0 ? locali[0].id : "Altro");
  const [localeNameInput, setLocaleNameInput] = useState(locali.length > 0 ? locali[0].name : "");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("20:00");
  const [numPeople, setNumPeople] = useState("2");
  const [notes, setNotes] = useState("");

  const selectedLocaleDetails = locali.find(l => l.id === selectedLocaleId);

  useEffect(() => {
    if (selectedLocaleId === "Altro") {
      setLocaleNameInput(""); 
    } else {
      const loc = locali.find(l => l.id === selectedLocaleId);
      if (loc) {
        setLocaleNameInput(loc.name);
      }
    }
  }, [selectedLocaleId, locali]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocaleName = selectedLocaleId === "Altro" ? "Altro (vedi note)" : localeNameInput;

    if (!finalLocaleName || (selectedLocaleId === "Altro" && !notes.trim()) || !date || !time || !numPeople) { 
      showToast("Compila tutti i campi obbligatori (*). Se scegli 'Altro', specifica i dettagli nelle note.", "error", <AlertTriangle size={18}/>);
      return;
    }
    const numPeopleInt = parseInt(numPeople);
    if (isNaN(numPeopleInt) || numPeopleInt <=0) {
        showToast("Inserisci un numero di persone valido.", "error", <AlertTriangle size={18}/>);
        return;
    }
    onPropose({ localeName: finalLocaleName, date, time, numPeople: numPeopleInt, notes }); 
  };
  
  const FormField: React.FC<{label: string, icon?: React.ReactElement<LucideProps>, children: React.ReactNode, htmlFor?: string, required?: boolean, className?: string}> = ({label, icon, children, htmlFor, required, className = ""}) => (
    <div className={className}>
        <label htmlFor={htmlFor} className="flex items-center text-sm font-medium text-slate-700 mb-1.5">
            {icon && React.cloneElement(icon, { size: 16, className: "mr-2 text-slate-500"})}
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
    </div>
  );

  const quickTimeOptions = ["19:00", "20:00", "20:30", "21:00"];
  const quickPeopleOptions = ["2", "3", "4", "6"];
  const notesPlaceholder = selectedLocaleId === "Altro" ? "Specifica qui il nome del locale e altri dettagli importanti (es. indirizzo, telefono se lo conosci)" : "Es. Preferenze tavolo, allergie...";

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white shadow-md p-3 sm:p-4 flex items-center justify-center sticky top-0 z-20 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList size={24} className="text-sky-500" />Proponi un Tavolo
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 no-scrollbar">
          <FormField label="Locale" icon={<Building />} htmlFor="localeName" required>
            <select 
              id="localeName" 
              value={selectedLocaleId} 
              onChange={e => setSelectedLocaleId(e.target.value)} 
              required 
              className="form-input bg-white"
            > 
              {locali.map(l => <option key={l.id} value={l.id}>{l.name}</option>)} 
              <option value="Altro">Altro (specifica nelle note)</option>
            </select>
          </FormField>

          {selectedLocaleDetails && selectedLocaleId !== "Altro" && (
            <div className="p-3.5 bg-white rounded-xl shadow-lg border border-slate-200/70 flex gap-3.5 items-center animate-fade-in">
              <ImageWithFallback 
                src={selectedLocaleDetails.img} 
                alt={selectedLocaleDetails.name} 
                imgClassName="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg"
                containerClassName="h-20 w-20 sm:h-24 sm:w-24 rounded-lg flex-shrink-0 bg-slate-200 shadow-sm"
                errorIcon={ImageIconLucide}
              />
              <div className="text-sm">
                <p className="font-semibold text-slate-800 text-md">{selectedLocaleDetails.name}</p>
                <p className="text-slate-600">{selectedLocaleDetails.cuisine}</p>
                <p className="text-slate-600 flex items-center mt-0.5"><DollarSign size={13} className="mr-0.5"/> Fascia Prezzo: {selectedLocaleDetails.price}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField label="Data" icon={<CalendarDays />} htmlFor="tableDate" required>
                <input type="date" id="tableDate" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} required className="form-input" />
            </FormField>
            <div>
              <FormField label="Ora" icon={<Clock />} htmlFor="tableTime" required>
                  <input type="time" id="tableTime" value={time} onChange={e => setTime(e.target.value)} required className="form-input" />
              </FormField>
              <div className="mt-2 flex gap-2">
                {quickTimeOptions.map(opt => (
                  <button 
                    type="button" 
                    key={opt} 
                    onClick={() => setTime(opt)}
                    className={`flex-1 py-2 px-2.5 text-xs sm:text-sm rounded-lg transition-all duration-200 transform 
                                ${time === opt ? `bg-${CORAL_PRIMARY}-500 text-white shadow-md scale-105` : `bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm hover:shadow active:scale-95`}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <FormField label="Numero Persone" icon={<Users />} htmlFor="numPeople" required>
              <input type="number" id="numPeople" value={numPeople} min="1" onChange={e => setNumPeople(e.target.value)} required className="form-input" />
            </FormField>
            <div className="mt-2 flex gap-2">
                {quickPeopleOptions.map(opt => (
                  <button 
                    type="button" 
                    key={opt} 
                    onClick={() => setNumPeople(opt)}
                    className={`flex-1 py-2 px-2.5 text-xs sm:text-sm rounded-lg transition-all duration-200 transform
                                ${numPeople === opt ? `bg-${CORAL_PRIMARY}-500 text-white shadow-md scale-105` : `bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm hover:shadow active:scale-95`}`}
                  >
                    {opt} pers.
                  </button>
                ))}
              </div>
          </div>
          
          <FormField label="Note (opzionale)" icon={<FileText />} htmlFor="tableNotes" className="sm:col-span-2">
            <textarea 
              id="tableNotes" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              rows={3} 
              placeholder={notesPlaceholder} 
              className="form-input leading-relaxed"
            />
          </FormField>
          
          <div className="mt-3 sm:mt-4 p-3.5 bg-sky-50 border border-sky-200/80 rounded-lg text-xs text-sky-700 flex items-start gap-2.5 shadow-sm">
            <InfoIconLucide size={22} className="flex-shrink-0 mt-0.5 text-sky-500" />
            <span>Questa funzionalità simula una proposta di tavolo. Nella versione reale, contatteremmo il locale o useremmo un sistema di prenotazione integrato.</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white/95 backdrop-blur-sm sticky bottom-0 z-10 flex items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
          <button 
            type="submit" 
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
          >
            <Send size={20}/> Invia Proposta
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

export default ProposeTableModal;
