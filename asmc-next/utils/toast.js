import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * 
 * @param {string} message 
 * @param {string} type
 */
export const toast_popup = (message, type = 'info') => {
    if (type === 'success')
        toast.success(message);
    else if (type === 'error')
        toast.error(message);
    else if (type === 'warning')
        toast.warning(message);
    else
        toast.info(message);
}