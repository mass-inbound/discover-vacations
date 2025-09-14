import {createContext, useContext, useEffect, useMemo, useState} from 'react';

export type CartFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // formatted
  phoneRaw: string; // digits only
  adults: number;
  kids: number;
  consent: boolean;
  checkIn: string | null; // ISO string
  checkOut: string | null; // ISO string
};

type CartFormContextValue = {
  form: CartFormState;
  setForm: (updater: (prev: CartFormState) => CartFormState) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
  clearForm: () => void;
};

const CartFormContext = createContext<CartFormContextValue | undefined>(
  undefined,
);

const FORM_STORAGE_KEY = 'cartForm';
const DATE_PICKER_KEY = 'cartShowDatePicker';

const defaultFormState: CartFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phoneRaw: '',
  adults: 0,
  kids: 0,
  consent: false,
  checkIn: null,
  checkOut: null,
};

export function CartFormProvider({children}: {children: React.ReactNode}) {
  const [form, _setForm] = useState<CartFormState>(() => {
    if (typeof window === 'undefined') return defaultFormState;
    try {
      const raw = window.sessionStorage.getItem(FORM_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartFormState) : defaultFormState;
    } catch {
      return defaultFormState;
    }
  });

  const [showDatePicker, _setShowDatePicker] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = window.sessionStorage.getItem(DATE_PICKER_KEY);
      return raw ? raw === 'true' : false;
    } catch {
      return false;
    }
  });

  // Persist to sessionStorage when values change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(DATE_PICKER_KEY, String(showDatePicker));
    } catch {}
  }, [showDatePicker]);

  const setForm = (updater: (prev: CartFormState) => CartFormState) => {
    _setForm((prev) => updater(prev));
  };

  const setShowDatePicker = (value: boolean) => {
    _setShowDatePicker(value);
  };

  const clearForm = () => {
    _setForm(defaultFormState);
    _setShowDatePicker(false);
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(FORM_STORAGE_KEY);
        window.sessionStorage.removeItem(DATE_PICKER_KEY);
      } catch {}
    }
  };

  const value = useMemo<CartFormContextValue>(
    () => ({form, setForm, showDatePicker, setShowDatePicker, clearForm}),
    [form, showDatePicker],
  );

  return (
    <CartFormContext.Provider value={value}>
      {children}
    </CartFormContext.Provider>
  );
}

export function useCartForm() {
  const ctx = useContext(CartFormContext);
  if (!ctx) {
    throw new Error('useCartForm must be used within a CartFormProvider');
  }
  return ctx;
}
