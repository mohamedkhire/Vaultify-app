import { toast, ToastOptions } from 'react-hot-toast';

type NotificationType = 'success' | 'error' | 'info';

const useNotification = () => {
  const showNotification = (message: string, type: NotificationType = 'info') => {
    const options: ToastOptions = {
      duration: 3000,
      position: 'top-right',
      style: {
        background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      icon: type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️',
    };

    toast(message, options);
  };

  return {
    showSuccess: (message: string) => showNotification(message, 'success'),
    showError: (message: string) => showNotification(message, 'error'),
    showInfo: (message: string) => showNotification(message, 'info'),
  };
};

export default useNotification;

