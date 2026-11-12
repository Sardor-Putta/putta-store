export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  /** Optional gallery for the product detail page. Falls back to `image` if omitted. */
  images?: string[];
  description: string;
  sizes: string[];
  /**
   * Transparent cut-out images for the homepage clothing rack. Products without it are not shown on the rack.
   * palette: which garment base the 5 colourways in /products/rack/colors/ are made from.
   */
  rack?: { front: string; back?: string; palette?: 'tee' | 'hoodie' | 'pants' | 'pantswide' };
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum PageState {
  HOME = 'HOME',
  SHOP = 'SHOP',
  COLLECTIONS = 'COLLECTIONS',
  ABOUT = 'ABOUT'
}