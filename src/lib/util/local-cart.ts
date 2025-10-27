export interface LocalCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  thumbnail?: string;
  variant_id?: string;
  product_id?: string;
  isRitualProduct?: boolean;
}

const CART_KEY = 'jardin-cart';

export function getLocalCart(): LocalCartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const cartData = localStorage.getItem(CART_KEY);
    if (!cartData) {
      return [];
    }
    return JSON.parse(cartData);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

export function updateLocalCartItem(itemId: string, quantity: number) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const cart = getLocalCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      
      // Dispatch custom event for cart updates
      window.dispatchEvent(new CustomEvent('localCartUpdated', {
        detail: { items: cart }
      }));
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
  }
}

export function removeFromLocalCart(itemId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const cart = getLocalCart();
    const filteredCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem(CART_KEY, JSON.stringify(filteredCart));
    
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('localCartUpdated', {
      detail: { items: filteredCart }
    }));
  } catch (error) {
    console.error('Error removing cart item:', error);
  }
}

export function addToLocalCart(item: LocalCartItem) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const cart = getLocalCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('localCartUpdated', {
      detail: { items: cart }
    }));
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

export function clearLocalCart() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(CART_KEY);
    
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('localCartUpdated', {
      detail: { items: [] }
    }));
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}
