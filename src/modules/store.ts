import { CartItem } from '../types';

const WISHLIST_KEY = 'helicorp_wishlist';
const CART_KEY = 'helicorp_cart';
const RECENT_KEY = 'helicorp_recently_viewed';

// Custom Events for Reactive State Synchronization
export const STORE_EVENTS = {
  WISHLIST_UPDATED: 'helicorp:wishlist_updated',
  CART_UPDATED: 'helicorp:cart_updated',
  RECENT_UPDATED: 'helicorp:recent_updated',
};

function dispatchStoreEvent(eventName: string): void {
  window.dispatchEvent(new CustomEvent(eventName));
}

/* ==========================================================================
   WISHLIST STORE
   ========================================================================== */
export function getWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(aircraftId: string): boolean {
  return getWishlist().includes(aircraftId);
}

export function toggleWishlist(aircraftId: string): boolean {
  const list = getWishlist();
  const index = list.indexOf(aircraftId);
  let added = false;

  if (index >= 0) {
    list.splice(index, 1);
    added = false;
  } else {
    list.push(aircraftId);
    added = true;
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  dispatchStoreEvent(STORE_EVENTS.WISHLIST_UPDATED);
  return added;
}

export function clearWishlist(): void {
  localStorage.removeItem(WISHLIST_KEY);
  dispatchStoreEvent(STORE_EVENTS.WISHLIST_UPDATED);
}

/* ==========================================================================
   CART / PRE-ORDER STORE
   ========================================================================== */
export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (c) => c.aircraftId === item.aircraftId && c.selectedInteriorId === item.selectedInteriorId
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatchStoreEvent(STORE_EVENTS.CART_UPDATED);
}

export function removeFromCart(aircraftId: string, interiorId?: string): void {
  let cart = getCart();
  if (interiorId) {
    cart = cart.filter((c) => !(c.aircraftId === aircraftId && c.selectedInteriorId === interiorId));
  } else {
    cart = cart.filter((c) => c.aircraftId !== aircraftId);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatchStoreEvent(STORE_EVENTS.CART_UPDATED);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  dispatchStoreEvent(STORE_EVENTS.CART_UPDATED);
}

export function getCartTotalDeposit(): number {
  return getCart().reduce((sum, item) => sum + item.depositUsd * item.quantity, 0);
}

/* ==========================================================================
   RECENTLY VIEWED STORE
   ========================================================================== */
export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(aircraftId: string): void {
  const recent = getRecentlyViewed().filter((id) => id !== aircraftId);
  recent.unshift(aircraftId);
  if (recent.length > 5) {
    recent.pop();
  }
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  dispatchStoreEvent(STORE_EVENTS.RECENT_UPDATED);
}
