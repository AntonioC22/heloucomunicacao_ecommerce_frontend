import toast from 'react-hot-toast';

export const showToast = {
    success: (message) => {
        toast.success(message, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#10b981',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '16px',
            },
        });
    },

    error: (message) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#ef4444',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '16px',
            },
        });
    },

    loading: (message) => {
        return toast.loading(message, {
            position: 'top-right',
            style: {
                background: '#3b82f6',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '16px',
            },
        });
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },
};