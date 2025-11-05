import { z } from 'zod';

export const authSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export const profileSchema = z.object({
  full_name: z.string()
    .trim()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters'),
  bio: z.string()
    .max(1000, 'Bio must be less than 1000 characters'),
  avatar_url: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
});

export const skillSchema = z.string()
  .trim()
  .min(1, 'Skill cannot be empty')
  .max(50, 'Skill must be less than 50 characters');

export const skillsArraySchema = z.array(skillSchema)
  .max(20, 'Maximum 20 skills allowed');

export const educationSchema = z.object({
  institution: z.string().trim().max(200, 'Institution name too long'),
  degree: z.string().trim().max(100, 'Degree name too long'),
  field: z.string().trim().max(100, 'Field name too long'),
  year: z.string().trim().max(50, 'Year format too long'),
});

export const experienceSchema = z.object({
  company: z.string().trim().max(200, 'Company name too long'),
  position: z.string().trim().max(100, 'Position name too long'),
  duration: z.string().trim().max(100, 'Duration format too long'),
  description: z.string().trim().max(1000, 'Description too long'),
});

export const messageSchema = z.string()
  .trim()
  .min(1, 'Message cannot be empty')
  .max(2000, 'Message must be less than 2000 characters');
