import { describe, it, expect, beforeEach } from 'vitest';
import {
  getWishlist,
  toggleWishlist,
  isInWishlist,
  clearWishlist,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  getCartTotalDeposit,
} from '../src/modules/store';
import { CartItem } from '../src/types';

// In-memory Mock LocalStorage & Window Event for Node/Vitest test runner
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

if (typeof globalThis.window === 'undefined') {
  // @ts-expect-error Mocking window for store events in test
  globalThis.window = {
    dispatchEvent: () => true,
  };
  // @ts-expect-error Mocking CustomEvent
  globalThis.CustomEvent = class CustomEvent {
    constructor(public type: string) {}
  };
}

describe('Store Module (Wishlist & Cart State Management)', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should toggle items in and out of the wishlist', () => {
    expect(isInWishlist('hx-9-stealth')).toBe(false);

    const added = toggleWishlist('hx-9-stealth');
    expect(added).toBe(true);
    expect(isInWishlist('hx-9-stealth')).toBe(true);
    expect(getWishlist()).toContain('hx-9-stealth');

    const removed = toggleWishlist('hx-9-stealth');
    expect(removed).toBe(false);
    expect(isInWishlist('hx-9-stealth')).toBe(false);
    expect(getWishlist().length).toBe(0);
  });

  it('should clear all wishlist items', () => {
    toggleWishlist('hx-9-stealth');
    toggleWishlist('h-600-skylifter');
    expect(getWishlist().length).toBe(2);

    clearWishlist();
    expect(getWishlist().length).toBe(0);
  });

  it('should add configured items to cart and compute total deposit', () => {
    const item1: CartItem = {
      aircraftId: 'hx-9-stealth',
      aircraftName: 'Helicorp HX-9 Stealth Phantom',
      categoryLabel: 'VIP Executive',
      selectedInteriorId: 'presidential-suite',
      interiorName: 'Presidential Sky Lounge',
      depositUsd: 50000,
      totalConfiguredPriceUsd: 8950000,
      customLiveryColor: 'Obsidian Titanium',
      quantity: 1,
      addedAt: new Date().toISOString(),
    };

    const item2: CartItem = {
      aircraftId: 'vt-4-veloce',
      aircraftName: 'Helicorp Veloce VT-4 Horizon',
      categoryLabel: 'Urban Air Mobility',
      selectedInteriorId: 'exclusive-coupe',
      interiorName: 'Private Grand Tourer',
      depositUsd: 25000,
      totalConfiguredPriceUsd: 3410000,
      customLiveryColor: 'Obsidian Titanium',
      quantity: 2,
      addedAt: new Date().toISOString(),
    };

    addToCart(item1);
    addToCart(item2);

    const cart = getCart();
    expect(cart.length).toBe(2);

    // Total deposit: 50,000 * 1 + 25,000 * 2 = 100,000 USD
    expect(getCartTotalDeposit()).toBe(100000);

    removeFromCart('hx-9-stealth');
    expect(getCart().length).toBe(1);
    expect(getCartTotalDeposit()).toBe(50000);

    clearCart();
    expect(getCart().length).toBe(0);
    expect(getCartTotalDeposit()).toBe(0);
  });
});
