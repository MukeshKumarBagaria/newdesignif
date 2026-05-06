# Unified Major Head / Sub Major Head / Minor Head Creation Screen Prompt

Design a single dynamic enterprise-grade IFMIS screen for handling:

* Major Head
* Sub Major Head
* Minor Head

The screen should support both:

1. Creating new hierarchy levels
2. Mapping existing parent hierarchy while creating child hierarchy

The UI must be clean, highly dynamic, scalable, and suitable for government financial systems.

---

# Core Functional Requirement

The screen should intelligently support all combinations of:

| Scenario                                               | Major Head             | Sub Major Head         | Minor Head |
| ------------------------------------------------------ | ---------------------- | ---------------------- | ---------- |
| Create only Major Head                                 | Create                 | —                      | —          |
| Create Sub Major under existing Major                  | Map                    | Create                 | —          |
| Create Major + Sub Major together                      | Create                 | Create                 | —          |
| Create Minor under existing Major + Sub Major          | Map                    | Map                    | Create     |
| Create Major + Sub Major + Minor together              | Create                 | Create                 | Create     |
| Create Sub Major + Minor together under existing Major | Map                    | Create                 | Create     |
| Mixed workflow                                         | Create/Map dynamically | Create/Map dynamically | Create     |

---

# UI Layout Requirements

## Overall Screen

* Single-page workflow
* Accordion or step-card layout
* Dynamic sections
* Minimal clutter
* Responsive enterprise UI
* Strong parent-child visual hierarchy

---

# Header Section

Title:
Unified Account Head Creation

Subtitle:
Create or map Major, Sub Major, and Minor Heads in one workflow.

Breadcrumb:
Budget Module > Account Head Management

---

# Section 1 — Major Head

Top Mode Selection:

( ) Create New Major Head
( ) Use Existing Major Head

---

## If "Use Existing Major Head"

Show:

* Searchable dropdown

  * Major Head Code + Name

Example:
2202 - Education

---

## If "Create New Major Head"

Show fields:

* Major Head Code
* English Nomenclature
* Hindi Nomenclature
* Sector
* Sub Sector
* Revenue / Capital / Both
* Voted / Charged / Both
* Active Status
* Remarks

---

# Section 2 — Sub Major Head

This section activates only after Major Head selection/creation.

Top Mode Selection:

( ) Create New Sub Major Head
( ) Use Existing Sub Major Head

---

## If "Use Existing Sub Major Head"

Show:

* Searchable dropdown filtered by selected Major Head

Example:
01 - Elementary Education

---

## If "Create New Sub Major Head"

Show fields:

* Sub Major Head Code
* English Nomenclature
* Hindi Nomenclature
* Active Status
* Remarks

---

# Section 3 — Minor Head

This section activates only after Sub Major Head selection/creation.

Top Mode Selection:

( ) Create New Minor Head
( ) Use Existing Minor Head

---

## If "Use Existing Minor Head"

Show:

* Searchable dropdown filtered by:

  * Major Head
  * Sub Major Head

Example:
102 - Government Schools

---

## If "Create New Minor Head"

Show fields:

* Minor Head Code
* English Nomenclature
* Hindi Nomenclature
* Active Status
* Remarks

---

# Dynamic Behaviour Rules

## Visibility Rules

### If user selects:

Use Existing Major Head
→ Only Major Head dropdown visible

### If user selects:

Create New Major Head
→ Full Major Head form visible

Same logic applies to:

* Sub Major Head
* Minor Head

---

# Dependency Rules

## Sub Major Head

Cannot be created unless Major Head is selected or created.

## Minor Head

Cannot be created unless Sub Major Head is selected or created.

---

# Smart UX Features

## Live Hierarchy Summary Panel

Sticky right-side summary panel showing:

Major Head:
2202 - Education

Sub Major Head:
01 - Elementary Education

Minor Head:
102 - Government Schools

Also show badges:

* CREATED
* MAPPED

---

# Recommended UI Components

* Accordion cards
* Searchable dropdowns
* Dynamic field rendering
* Smart hierarchy preview
* Step indicators
* Active status toggles
* Auto validation

---

# Validation Rules

* Duplicate code validation
* Parent-child uniqueness validation
* Mandatory hierarchy validation
* Dynamic dropdown filtering
* Code length validation

---

# Footer Actions

Buttons:

* Reset
* Save Draft
* Submit Hierarchy

---

# Design Style

Use:

* Government ERP style
* Modern card-based layout
* Blue gradient headers
* Rounded cards
* Soft shadows
* Sticky hierarchy summary

Color Palette:

* Primary Blue: #1565C0
* Secondary Blue: #1976D2
* Success Green: #A5D66F
* Background: #F4F6F8

---

# Recommended Frontend Stack

* React.js / Next.js
* TailwindCSS
* React Hook Form
* Zod Validation

---

# Final UX Goal

The screen should feel like:

“Build hierarchy dynamically in one flow”

instead of:

“Fill multiple disconnected forms.”

The workflow must support both:

* Full hierarchy creation
* Partial hierarchy mapping
* Mixed create + map combinations

all within one clean dynamic screen.
