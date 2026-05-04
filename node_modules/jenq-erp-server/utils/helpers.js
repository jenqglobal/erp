import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const paginate = (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  return { limit: parseInt(limit), offset: parseInt(offset) };
};

export const sanitizeUser = (user) => {
  const { password, ...sanitized } = user;
  return sanitized;
};

export const calculateTax = (subtotal, taxRate = 0.1) => {
  return subtotal * taxRate;
};

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

export const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `INV-${timestamp}-${random}`.toUpperCase();
};