// Add real client quotes only. Keep each quote to 1-3 short sentences.
// The testimonials section stays hidden in production until at least one quote is filled in.

export interface Testimonial {
  quote: string
  name: string
  role: string // e.g. 'Owner, Sharma Dental Clinic, Panvel'
}

export const testimonials: Testimonial[] = [
  { quote: '[ADD TESTIMONIAL]', name: '[CLIENT NAME]', role: '[ROLE, BUSINESS, CITY]' },
  { quote: '[ADD TESTIMONIAL]', name: '[CLIENT NAME]', role: '[ROLE, BUSINESS, CITY]' },
]
