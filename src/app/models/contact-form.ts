export interface ContactForm {
  name: string;
  email: string;
  id: string;
  subject: 'question' | 'order-error' | 'other';
  phoneNumber: string;
  message: string;
}
