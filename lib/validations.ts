import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  company: z.string().optional(),
  role: z.string().optional(),
  message: z.string().min(10, 'Please share a bit more about your needs.'),
  jobOpportunity: z.boolean().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
