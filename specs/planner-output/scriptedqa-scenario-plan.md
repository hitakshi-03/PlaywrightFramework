# Scripted QA Business-Focused Test Plan Draft

## Application Overview

Plan browser-level scenarios for the verified Scripted QA practice playground and its Shopping catalog/cart. The public entry page requires sign-in; catalog and cart behavior was established by the current framework documentation and prior observed page snapshots. No credentials are included. Unknown behavior and order submission remain out of scope or To Be Confirmed.

## Test Scenarios

### 1. Authentication and Access Control

**Seed:** `tests/smoke/opens-application.spec.ts`

#### 1.1. AUTH-001 Sign in to the authenticated home

**File:** `tests/smoke/authentication.spec.ts`

**Steps:**
  1. Open the application entry page.
    - expect: The sign-in form is displayed with Username, Password, and Sign In controls.
  2. Sign in using a dedicated approved test identity provided through the secret store.
    - expect: The authenticated home page is displayed at /home.
    - expect: The home navigation includes the observed practice categories.

#### 1.2. AUTH-002 Reject invalid credentials

**File:** `tests/regression/authentication.spec.ts`

**Steps:**
  1. Open the application entry page.
    - expect: The sign-in form is displayed.
  2. Submit a deliberately invalid, non-secret test identity.
    - expect: Authentication is not granted.
    - expect: A user-visible validation or error outcome is shown; exact wording and behavior require application-owner confirmation.

#### 1.3. AUTH-003 Handle empty sign-in submission

**File:** `tests/regression/authentication.spec.ts`

**Steps:**
  1. Open the application entry page and submit with both fields empty.
    - expect: Authentication is not granted.
    - expect: User-visible required-field or validation behavior is confirmed; native required constraints were not present on the inspected Username field, so exact behavior is To Be Confirmed.

#### 1.4. ACCESS-001 Redirect unauthenticated Shopping access

**File:** `tests/smoke/navigation.spec.ts`

**Steps:**
  1. In a fresh unauthenticated context, navigate directly to /shopping.
    - expect: The user is redirected to the sign-in entry page at /.

### 2. Shopping Catalog Discovery

**Seed:** `tests/smoke/opens-application.spec.ts`

#### 2.1. SHOP-001 Render catalog controls and products

**File:** `tests/smoke/shopping.spec.ts`

**Steps:**
  1. Sign in and navigate to Shopping.
    - expect: The Products heading, product cards, product search, category filter, price filter, Add to Cart buttons, and cart-count control are visible.

#### 2.2. SHOP-002 Search for an observed catalog product

**File:** `tests/regression/shopping-search.spec.ts`

**Steps:**
  1. Enter the exact name of a product currently listed in the catalog in the search field.
    - expect: The matching product is displayed; matching semantics and case behavior should be confirmed against product requirements.

#### 2.3. SHOP-003 Handle a search with no matching product

**File:** `tests/regression/shopping-search.spec.ts`

**Steps:**
  1. Enter a unique term not present in the displayed catalog.
    - expect: No unrelated products are shown; the empty-state message and clearing behavior are To Be Confirmed.

#### 2.4. SHOP-004 Filter the catalog by category

**File:** `tests/regression/shopping-filters.spec.ts`

**Steps:**
  1. Select one visible category option, such as electronics.
    - expect: Displayed products are limited to the selected category; exact empty/reset behavior is To Be Confirmed.

#### 2.5. SHOP-005 Filter the catalog by price range

**File:** `tests/regression/shopping-filters.spec.ts`

**Steps:**
  1. Select each supported price-range option across independent scenarios.
    - expect: Displayed products conform to the selected visible range.
    - expect: Inclusion behavior at exact boundary prices requires confirmation.

#### 2.6. SHOP-006 Add one product and update cart count

**File:** `tests/regression/shopping.spec.ts`

**Steps:**
  1. Add one identified product using its Add to Cart control.
    - expect: The cart count increases by one.
    - expect: The product control visibly reflects its added quantity, as observed after adding a product.

#### 2.7. SHOP-007 Add the same product repeatedly

**File:** `tests/regression/shopping.spec.ts`

**Steps:**
  1. Add the same product twice in a clean cart.
    - expect: Cart count and product quantity behavior match the application owner's confirmed quantity semantics; repeated-add behavior is To Be Confirmed.

### 3. Cart Management

**Seed:** `tests/smoke/opens-application.spec.ts`

#### 3.1. CART-001 Review cart item and totals

**File:** `tests/smoke/cart.spec.ts`

**Steps:**
  1. Add a known product, then open the cart using the cart-count control.
    - expect: The cart shows item, price, quantity, line total, and grand total.
    - expect: The cart contents correspond to the product added.

#### 3.2. CART-002 Clear a populated cart

**File:** `tests/regression/cart.spec.ts`

**Steps:**
  1. Add a product, open the cart, and select Clear Cart.
    - expect: The cart is empty and the displayed totals reflect the empty state; exact empty-state content is To Be Confirmed.

#### 3.3. CART-003 Return to shopping from cart

**File:** `tests/regression/cart.spec.ts`

**Steps:**
  1. Open the cart and select Back to Shopping.
    - expect: The Shopping catalog is displayed.

#### 3.4. CART-004 Open cart with no items

**File:** `tests/regression/cart.spec.ts`

**Steps:**
  1. Use a clean cart and open /cart.
    - expect: An empty-cart state is displayed; exact message and available actions are To Be Confirmed.

### 4. Practice Category Navigation and Deferred Commerce

**Seed:** `tests/smoke/opens-application.spec.ts`

#### 4.1. NAV-001 Open observed practice categories

**File:** `tests/regression/navigation.spec.ts`

**Steps:**
  1. From authenticated home, open each observed category: Table, Dropdown, Alerts & Windows, Frame, Form, Calender, Mouse Actions, and Shopping.
    - expect: Each navigation item opens its corresponding linked page.
    - expect: Category-specific behavior and page content expectations must be planned after direct inspection.

#### 4.2. CHECKOUT-001 Confirm Place Order control without submitting

**File:** `tests/regression/checkout-presence.spec.ts`

**Steps:**
  1. Open a prepared cart in an approved non-production environment and inspect the Place Order control without activating it.
    - expect: The control is present on the cart page, as observed.
    - expect: Post-submit behavior, side effects, environment, and reset policy remain To Be Confirmed; do not click Place Order.
