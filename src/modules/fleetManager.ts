import { FLEET_DATA } from '../data/fleetData';
import { Aircraft, AircraftCategory, CartItem } from '../types';
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
  getRecentlyViewed,
  addRecentlyViewed,
  STORE_EVENTS,
} from './store';
import { showToast } from './toast';
import { logTelemetryEvent } from './telemetry';

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export class FleetManager {
  private activeCategory: AircraftCategory | 'all' = 'all';

  constructor() {
    this.bindStoreEvents();
    this.bindHeaderDrawerButtons();
  }

  public init(): void {
    this.renderFleetGrid();
    this.setupCategoryFilters();
    this.updateBadges();
    this.renderWishlistDrawer();
    this.renderCartDrawer();
    this.renderRecentlyViewedStrip();
  }

  private bindStoreEvents(): void {
    window.addEventListener(STORE_EVENTS.WISHLIST_UPDATED, () => {
      this.updateBadges();
      this.renderFleetGrid();
      this.renderWishlistDrawer();
    });

    window.addEventListener(STORE_EVENTS.CART_UPDATED, () => {
      this.updateBadges();
      this.renderCartDrawer();
    });

    window.addEventListener(STORE_EVENTS.RECENT_UPDATED, () => {
      this.renderRecentlyViewedStrip();
    });
  }

  private updateBadges(): void {
    const wishlistBadge = document.getElementById('wishlistCountBadge');
    const cartBadge = document.getElementById('cartCountBadge');

    if (wishlistBadge) {
      wishlistBadge.textContent = getWishlist().length.toString();
    }
    if (cartBadge) {
      const totalCartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
      cartBadge.textContent = totalCartCount.toString();
    }
  }

  private setupCategoryFilters(): void {
    const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter') as AircraftCategory | 'all';
        this.activeCategory = filter || 'all';
        this.renderFleetGrid();
        logTelemetryEvent('click', `Filter fleet: ${filter}`);
      });
    });
  }

  public renderFleetGrid(): void {
    const container = document.getElementById('fleetGridContainer');
    if (!container) return;

    const filtered = this.activeCategory === 'all'
      ? FLEET_DATA
      : FLEET_DATA.filter((aircraft) => aircraft.category === this.activeCategory);

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state">Không có mẫu máy bay nào trong danh mục này.</div>`;
      return;
    }

    container.innerHTML = filtered
      .map((aircraft) => {
        const inWishlist = isInWishlist(aircraft.id);
        return `
          <article class="aircraft-card" data-id="${aircraft.id}">
            <div class="aircraft-thumb-box">
              <img 
                src="${aircraft.heroImage}" 
                alt="${aircraft.name}" 
                width="800" 
                height="450" 
                loading="lazy" 
                decoding="async" 
                class="aircraft-thumb-img" 
              />
              <span class="aircraft-card-category">${aircraft.categoryLabel}</span>
              <button 
                type="button" 
                class="wishlist-toggle-btn ${inWishlist ? 'in-wishlist' : ''}" 
                data-wishlist-id="${aircraft.id}" 
                aria-label="${inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}"
                title="${inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <div class="aircraft-info-box">
              <h3 class="aircraft-card-name">${aircraft.name}</h3>
              <p class="aircraft-card-tagline">${aircraft.tagline}</p>

              <div class="aircraft-quick-specs">
                <div class="quick-spec-item">
                  <span class="quick-spec-val">${aircraft.specs.cruiseSpeedKmh} km/h</span>
                  <span class="quick-spec-lbl">Vận tốc bay</span>
                </div>
                <div class="quick-spec-item">
                  <span class="quick-spec-val">${aircraft.specs.rangeKm} km</span>
                  <span class="quick-spec-lbl">Tầm bay</span>
                </div>
                <div class="quick-spec-item">
                  <span class="quick-spec-val">${aircraft.specs.noiseLevelDb} dBA</span>
                  <span class="quick-spec-lbl">Mức ồn</span>
                </div>
              </div>

              <div class="aircraft-pricing-row">
                <div class="pricing-group">
                  <span class="price-label">Giá niêm yết từ</span>
                  <span class="price-amount">${formatUsd(aircraft.basePriceUsd)}</span>
                  <span class="deposit-note">Cọc giữ suất: ${formatUsd(aircraft.depositUsd)}</span>
                </div>

                <button type="button" class="btn btn-primary btn-sm configure-modal-trigger" data-aircraft-id="${aircraft.id}">
                  Cấu hình & Cọc
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    // Attach Event Handlers
    container.querySelectorAll<HTMLButtonElement>('.wishlist-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-wishlist-id');
        if (id) {
          const added = toggleWishlist(id);
          const aircraft = FLEET_DATA.find((a) => a.id === id);
          if (added) {
            showToast(`Đã thêm ${aircraft?.name || 'máy bay'} vào danh sách yêu thích!`, 'success');
            logTelemetryEvent('wishlist_action', `Added ${id} to wishlist`);
          } else {
            showToast(`Đã bỏ ${aircraft?.name || 'máy bay'} khỏi danh sách yêu thích.`, 'info');
            logTelemetryEvent('wishlist_action', `Removed ${id} from wishlist`);
          }
        }
      });
    });

    container.querySelectorAll<HTMLButtonElement>('.configure-modal-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-aircraft-id');
        if (id) {
          const aircraft = FLEET_DATA.find((a) => a.id === id);
          if (aircraft) {
            this.openConfiguratorModal(aircraft);
            addRecentlyViewed(id);
            logTelemetryEvent('view_model', `Opened configurator for ${aircraft.name}`);
          }
        }
      });
    });
  }

  public openConfiguratorModal(aircraft: Aircraft): void {
    const modal = document.getElementById('aircraftDetailModal');
    const backdrop = document.getElementById('aircraftModalBackdrop');
    const modalName = document.getElementById('modalAircraftName');
    const modalBody = document.getElementById('modalAircraftBody');

    if (!modal || !backdrop || !modalName || !modalBody) return;

    modalName.textContent = `Cấu hình ${aircraft.name}`;

    let selectedInterior = aircraft.interiorOptions[0];
    let selectedLivery = 'Obsidian Titanium';

    function calculateTotal(): number {
      return aircraft.basePriceUsd + (selectedInterior ? selectedInterior.priceUsd : 0);
    }

    const renderModalContent = (): void => {
      modalBody!.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
          <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: var(--radius-md); overflow: hidden;">
            <img src="${aircraft.heroImage}" alt="${aircraft.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <div>
            <h4 style="font-family: var(--font-heading); font-size: 1.125rem; font-weight: 700;">${aircraft.tagline}</h4>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: var(--space-xs);">${aircraft.description}</p>
          </div>

          <!-- Features -->
          <div>
            <h5 style="font-size: 0.875rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">Trang bị nổi bật:</h5>
            <ul style="padding-left: var(--space-lg); margin-top: var(--space-xs); font-size: 0.8125rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
              ${aircraft.features.map((f) => `<li>${f}</li>`).join('')}
            </ul>
          </div>

          <!-- Interior Configurator -->
          <div>
            <h5 style="font-size: 0.875rem; font-weight: 700; margin-bottom: var(--space-xs);">Tùy chọn gói nội thất cabin:</h5>
            <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
              ${aircraft.interiorOptions
                .map(
                  (opt) => `
                <label style="display: flex; align-items: start; gap: var(--space-sm); padding: var(--space-sm); border: 1px solid ${opt.id === selectedInterior.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); background-color: var(--surface-card); cursor: pointer;">
                  <input type="radio" name="interiorOption" value="${opt.id}" ${opt.id === selectedInterior.id ? 'checked' : ''} style="margin-top: 4px;" />
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.875rem;">
                      <span>${opt.name}</span>
                      <span style="font-family: var(--font-mono); color: var(--accent-cyan);">+${formatUsd(opt.priceUsd)}</span>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${opt.description}</div>
                  </div>
                </label>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Price & Deposit Summary -->
          <div style="padding: var(--space-md); background-color: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: var(--radius-md);">
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
              <span>Tổng giá trị sau cấu hình:</span>
              <strong style="font-family: var(--font-mono); font-size: 1.125rem;">${formatUsd(calculateTotal())}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-top: 4px;">
              <span style="color: var(--accent-amber);">Tiền cọc giữ suất bàn giao:</span>
              <strong style="font-family: var(--font-mono); color: var(--accent-amber); font-size: 1.125rem;">${formatUsd(aircraft.depositUsd)}</strong>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="confirmAddToCartBtn" style="width: 100%;">
            Thêm Suất Bàn Giao Vào Giỏ Cọc
          </button>
        </div>
      `;

      // Radio input changes
      modalBody!.querySelectorAll<HTMLInputElement>('input[name="interiorOption"]').forEach((radio) => {
        radio.addEventListener('change', () => {
          const found = aircraft.interiorOptions.find((opt) => opt.id === radio.value);
          if (found) {
            selectedInterior = found;
            renderModalContent();
          }
        });
      });

      // Add to Cart
      const confirmBtn = document.getElementById('confirmAddToCartBtn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          const item: CartItem = {
            aircraftId: aircraft.id,
            aircraftName: aircraft.name,
            categoryLabel: aircraft.categoryLabel,
            selectedInteriorId: selectedInterior.id,
            interiorName: selectedInterior.name,
            depositUsd: aircraft.depositUsd,
            totalConfiguredPriceUsd: calculateTotal(),
            customLiveryColor: selectedLivery,
            quantity: 1,
            addedAt: new Date().toISOString(),
          };

          addToCart(item);
          showToast(`Đã thêm ${aircraft.name} (${selectedInterior.name}) vào giỏ cọc!`, 'success');
          logTelemetryEvent('cart_action', `Added ${aircraft.name} to cart`);
          closeModal();
          this.openCartDrawer();
        });
      }
    }

    function closeModal(): void {
      modal!.classList.remove('is-open');
      backdrop!.classList.remove('is-open');
    }

    renderModalContent();
    modal.classList.add('is-open');
    backdrop.classList.add('is-open');

    const closeBtn = document.getElementById('closeAircraftModalBtn');
    if (closeBtn) closeBtn.onclick = closeModal;
    backdrop.onclick = closeModal;
  }

  private bindHeaderDrawerButtons(): void {
    const wishlistTrigger = document.getElementById('wishlistTriggerBtn');
    const cartTrigger = document.getElementById('cartTriggerBtn');
    const wishlistBackdrop = document.getElementById('wishlistBackdrop');
    const cartBackdrop = document.getElementById('cartBackdrop');
    const closeWishlist = document.getElementById('closeWishlistBtn');
    const closeCart = document.getElementById('closeCartBtn');

    if (wishlistTrigger) {
      wishlistTrigger.addEventListener('click', () => this.openWishlistDrawer());
    }
    if (cartTrigger) {
      cartTrigger.addEventListener('click', () => this.openCartDrawer());
    }

    if (wishlistBackdrop && closeWishlist) {
      const close = () => {
        document.getElementById('wishlistDrawer')?.classList.remove('is-open');
        wishlistBackdrop.classList.remove('is-open');
      };
      wishlistBackdrop.onclick = close;
      closeWishlist.onclick = close;
    }

    if (cartBackdrop && closeCart) {
      const close = () => {
        document.getElementById('cartDrawer')?.classList.remove('is-open');
        cartBackdrop.classList.remove('is-open');
      };
      cartBackdrop.onclick = close;
      closeCart.onclick = close;
    }

    const clearWishlistBtn = document.getElementById('clearWishlistBtn');
    if (clearWishlistBtn) {
      clearWishlistBtn.addEventListener('click', () => {
        clearWishlist();
        showToast('Đã xóa toàn bộ danh sách yêu thích.', 'info');
      });
    }

    const checkoutBtn = document.getElementById('checkoutPreOrderBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
          showToast('Giỏ cọc hiện đang trống. Quý khách vui lòng chọn máy bay từ hạm đội!', 'error');
          return;
        }

        const total = getCartTotalDeposit();
        showToast(`Xác nhận giữ suất thành công! Mã Voucher VIP: HC-VOUCHER-${Date.now().toString(36).toUpperCase()}. Ban Điều Hành Bay sẽ liên hệ hoàn tất thủ tục bàn giao.`, 'success', 7000);
        logTelemetryEvent('form_submit', 'Pre-order voucher checkout completed', { totalDeposit: total });
        clearCart();
        document.getElementById('cartDrawer')?.classList.remove('is-open');
        document.getElementById('cartBackdrop')?.classList.remove('is-open');
      });
    }
  }

  public openWishlistDrawer(): void {
    this.renderWishlistDrawer();
    document.getElementById('wishlistDrawer')?.classList.add('is-open');
    document.getElementById('wishlistBackdrop')?.classList.add('is-open');
    logTelemetryEvent('click', 'Opened Wishlist Drawer');
  }

  public openCartDrawer(): void {
    this.renderCartDrawer();
    document.getElementById('cartDrawer')?.classList.add('is-open');
    document.getElementById('cartBackdrop')?.classList.add('is-open');
    logTelemetryEvent('click', 'Opened Cart Drawer');
  }

  public renderWishlistDrawer(): void {
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;

    const wishlistIds = getWishlist();
    if (wishlistIds.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted);"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <p>Chưa có mẫu máy bay nào trong danh sách yêu thích.</p>
        </div>
      `;
      return;
    }

    const aircraftList = FLEET_DATA.filter((a) => wishlistIds.includes(a.id));

    container.innerHTML = aircraftList
      .map(
        (a) => `
      <div style="display: flex; gap: var(--space-sm); padding: var(--space-sm); background-color: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); align-items: center;">
        <img src="${a.heroImage}" alt="${a.name}" style="width: 70px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);" />
        <div style="flex: 1;">
          <h4 style="font-size: 0.875rem; font-weight: 700;">${a.name}</h4>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan);">${formatUsd(a.basePriceUsd)}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <button type="button" class="btn btn-primary btn-sm wishlist-book-btn" data-id="${a.id}" style="padding: 4px 8px; font-size: 0.6875rem;">Cấu hình</button>
          <button type="button" class="wishlist-remove-btn" data-id="${a.id}" style="color: var(--text-muted); font-size: 0.6875rem; cursor: pointer; text-align: center;">Xóa</button>
        </div>
      </div>
    `
      )
      .join('');

    container.querySelectorAll<HTMLButtonElement>('.wishlist-book-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = FLEET_DATA.find((a) => a.id === id);
        if (found) {
          document.getElementById('wishlistDrawer')?.classList.remove('is-open');
          document.getElementById('wishlistBackdrop')?.classList.remove('is-open');
          this.openConfiguratorModal(found);
        }
      });
    });

    container.querySelectorAll<HTMLButtonElement>('.wishlist-remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) toggleWishlist(id);
      });
    });
  }

  public renderCartDrawer(): void {
    const container = document.getElementById('cartItemsContainer');
    const totalDisplay = document.getElementById('cartTotalDepositDisplay');
    if (!container) return;

    const cart = getCart();
    if (totalDisplay) {
      totalDisplay.textContent = formatUsd(getCartTotalDeposit());
    }

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted);"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <p>Giỏ cọc máy bay của quý khách đang trống.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = cart
      .map(
        (item) => `
      <div style="display: flex; flex-direction: column; gap: var(--space-xs); padding: var(--space-md); background-color: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h4 style="font-size: 0.9375rem; font-weight: 700;">${item.aircraftName}</h4>
            <div style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 600;">Nội thất: ${item.interiorName}</div>
          </div>
          <button type="button" class="cart-remove-item-btn" data-aircraft-id="${item.aircraftId}" data-interior-id="${item.selectedInteriorId}" style="color: var(--accent-rose); font-size: 0.75rem; cursor: pointer;">✕ Xóa</button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-subtle); padding-top: var(--space-xs); font-size: 0.8125rem;">
          <span style="color: var(--text-muted);">Mức cọc: ${formatUsd(item.depositUsd)} x ${item.quantity}</span>
          <strong style="font-family: var(--font-mono); color: var(--accent-amber);">${formatUsd(item.depositUsd * item.quantity)}</strong>
        </div>
      </div>
    `
      )
      .join('');

    container.querySelectorAll<HTMLButtonElement>('.cart-remove-item-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const aId = btn.getAttribute('data-aircraft-id');
        const iId = btn.getAttribute('data-interior-id');
        if (aId) {
          removeFromCart(aId, iId || undefined);
          showToast('Đã xóa mục khỏi giỏ cọc.', 'info');
        }
      });
    });
  }

  public renderRecentlyViewedStrip(): void {
    const strip = document.getElementById('recentlyViewedStrip');
    const container = document.getElementById('recentItemsList');
    if (!strip || !container) return;

    const recentIds = getRecentlyViewed();
    if (recentIds.length === 0) {
      strip.classList.remove('is-visible');
      return;
    }

    const items = FLEET_DATA.filter((a) => recentIds.includes(a.id));
    container.innerHTML = items
      .map(
        (a) => `
      <button type="button" class="recent-item-pill recent-click-btn" data-id="${a.id}">
        <img src="${a.heroImage}" alt="${a.name}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;" />
        <span>${a.name}</span>
      </button>
    `
      )
      .join('');

    strip.classList.add('is-visible');

    container.querySelectorAll<HTMLButtonElement>('.recent-click-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = FLEET_DATA.find((a) => a.id === id);
        if (found) {
          this.openConfiguratorModal(found);
        }
      });
    });
  }
}
