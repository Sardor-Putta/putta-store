import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'CORE OVERSIZED TEE - NOIR',
    price: 85,
    category: 'Tops',
    image: 'https://picsum.photos/seed/putta_tee_black/600/800',
    description: 'Heavyweight organic cotton. Drop shoulder. The absolute standard.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '2',
    name: 'CORE OVERSIZED TEE - BONE',
    price: 85,
    category: 'Tops',
    image: 'https://picsum.photos/seed/putta_tee_white/600/800',
    description: 'Pigment dyed. Vintage wash. Soft structure.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '3',
    name: 'ESSENTIAL HOODIE - SLATE',
    price: 160,
    category: 'Tops',
    image: 'https://picsum.photos/seed/putta_hoodie_gray/600/800',
    description: '480gsm french terry. Double lined hood. Cropped waist.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '4',
    name: 'ESSENTIAL HOODIE - VOID',
    price: 160,
    category: 'Tops',
    image: 'https://picsum.photos/seed/putta_hoodie_black/600/800',
    description: 'Jet black dye. Boxy fit. Kangaroo pocket removed for clean lines.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '5',
    name: 'PLEATED WIDE TROUSER',
    price: 210,
    category: 'Bottoms',
    image: 'https://picsum.photos/seed/putta_pants/600/800',
    description: 'Japanese wool blend. Deep double pleats. Flowing silhouette.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '6',
    name: 'TECH WINDBREAKER - ASH',
    price: 240,
    category: 'Outerwear',
    image: 'https://picsum.photos/seed/putta_jacket/600/800',
    description: 'Water-repellent nylon. Matte hardware. High collar structure.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  }
];

export const COLLECTIONS = [
  {
    id: 'c1',
    title: 'SEASON 01: GENESIS',
    image: 'https://picsum.photos/seed/collection1/1200/800',
    description: 'The beginning of the end. Monochromatic studies in form.'
  },
  {
    id: 'c2',
    title: 'CAPSULE: NOCTURNE',
    image: 'https://picsum.photos/seed/collection2/1200/800',
    description: 'Designed for the city at night. Reflective details and deep blacks.'
  }
];