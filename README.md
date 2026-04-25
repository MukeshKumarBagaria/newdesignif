# IFMIS-NG — Deposit Interest Master

An implementation of the IFMIS-NG "Deposit Interest Master" Figma screen.

**Figma source:** [node `3130-32091`](https://www.figma.com/design/8ETItiJopY8FYe3pqVjRyq/IFMIS-NG_BPL?node-id=3130-32091&m=dev)

## Stack

- [Vite](https://vitejs.dev/) + React 19 + TypeScript
- [Tailwind CSS 3](https://tailwindcss.com/) with design tokens mapped from the Figma file (brand blues, greys, accents, radii)
- Inline SVG icons (no external icon package) so assets stay self-contained

## Get started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## Project structure

```
src/
  App.tsx                         # Page layout — assembles header, sidebar, sections
  components/
    Header.tsx                    # Top bar (logo, search, bell, avatar) + banner
    Sidebar.tsx                   # Left navigation with collapse toggle
    ProgressTracker.tsx           # "Approval Status" stepper + return remark banner
    FormSection.tsx               # Reusable collapsible section (blue header, 1-4 badge)
    form.tsx                      # FormInput, FormSelect, FormTextarea, RadioOption,
                                  # Checkbox, Button primitives
    icons.tsx                     # Inline SVG icon set + IFMIS emblem
    sections/
      LegislativeTrigger.tsx      # Section 1
      DepositInterestConfig.tsx   # Section 2
      RemarksAttachment.tsx       # Section 3 (file table included)
      ESign.tsx                   # Section 4 (DSC preview)
```

## Design tokens

The Tailwind config (`tailwind.config.js`) extends the default theme with the
colour palette defined in the Figma variables payload, so classes like
`bg-brand-500`, `text-grey-800`, `bg-accent-yellow-25`, `border-accent-red-500`
map directly to Figma tokens.
