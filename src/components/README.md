# Components Organization

This directory contains all reusable components organized by category for better maintainability and discoverability.

## Directory Structure

### 📁 `layout/`

Components that define the overall page structure:

- `Header.tsx` - Main navigation header with menu and language switcher
- `Footer.tsx` - Site footer with links and copyright
- `Footer.scss` - Footer styles

### 📁 `modals/`

Dialog and modal components:

- `CarReservationModal.tsx` - Car booking form modal with multi-step process
- `CallContactsModal.tsx` - Contact information modal
- `CallContactsModal.scss` - Contact modal styles

### 📁 `sections/`

Main page section components:

- `About.tsx` - About us section with company information
- `Contact.tsx` - Contact form and information section
- `Cars.tsx` - Car catalog section with filtering and search

### 📁 `car/`

Car-related functionality components:

- `CarCard.tsx` - Individual car display card
- `RentSearch.tsx` - Car search and filtering interface
- `RentSearchCalendar.tsx` - Date picker for rental periods


### 📁 `ui/`

Low-level UI building blocks organized in subcategories:

- `forms/` - Form controls (checkbox, radio-group, form)
- `inputs/` - Input components (input, textarea, select, etc.)
- `layout/` - Layout components (card, separator, sidebar, etc.)
- `navigation/` - Navigation components (breadcrumb, tabs, pagination, etc.)
- `feedback/` - User feedback (toast, alert, progress, etc.)
- `data-display/` - Data presentation (table, chart, calendar, etc.)
- `overlays/` - Overlay components (dialog, popover, tooltip, etc.)
- `media/` - Media components (carousel)
- `utils/` - Utility components (button, label, toggle, etc.)

## Usage

All components can be imported from the main components index:

```typescript
import {
  Header,
  Footer,
  CarCard,
  Cars,
  About,
  Contact,
  CarReservationModal,
  Button,
  Card,
} from "@/components";
```

Or from specific categories:

```typescript
import { Header, Footer } from "@/components/layout";
import { CarCard, RentSearch } from "@/components/car";
import { Button, Input } from "@/components/ui";
```

## Benefits

1. **Better Organization** - Components are grouped by purpose and functionality
2. **Improved Discoverability** - Easy to find related components
3. **Cleaner Imports** - Centralized exports through index files
4. **Maintainability** - Related components are co-located
5. **Scalability** - Easy to add new components to appropriate categories

## Guidelines

- Place components in the most appropriate category based on their primary purpose
- Update index files when adding new components
- Keep styles close to their components when possible
- Use absolute imports with the `@/components` alias for consistency
