import { useEffect, useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);

  const toast = useCallback((text) => {
    setMsg(text);
    setShow(true);
    clearTimeout(window._tt);
    window._tt = setTimeout(() => setShow(false), 1800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={'toast' + (show ? ' show' : '')}>{msg}</div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
