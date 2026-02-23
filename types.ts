export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes: string[];
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