# Mini Seller Console

A lightweight React application for managing leads and converting them into opportunities. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

### Core Requirements (MVP)
- **Leads List**: Load from local JSON file with 100 sample leads
- **Search & Filter**: Search by name/company, filter by status
- **Sorting**: Sort by score (desc), name, or company
- **Lead Detail Panel**: Click to open slide-over panel with inline editing
- **Email Validation**: Real-time email format validation
- **Convert to Opportunity**: Convert leads to opportunities with random amounts
- **Opportunities Table**: Display converted opportunities with total value
- **UX States**: Loading, empty, and error states with retry functionality

### Nice-to-Have Features
- **localStorage Persistence**: Filter and sort preferences saved across sessions
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Optimistic Updates**: Immediate UI updates with rollback on failure

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Local JSON** data (no backend required)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── LeadsList.tsx          # Main leads table with search/filter/sort
│   ├── LeadDetailPanel.tsx    # Slide-over panel for lead details
│   └── OpportunitiesTable.tsx # Opportunities display table
├── types.ts                   # TypeScript interfaces
├── App.tsx                    # Main application component
└── index.css                  # Tailwind CSS imports

public/
└── leads.json                 # Sample leads data (100 records)
```

## Usage

1. **View Leads**: The main table shows all leads with search and filter capabilities
2. **Search**: Type in the search box to filter by name or company
3. **Filter**: Use the status dropdown to filter by lead status
4. **Sort**: Click column headers to sort by name, company, or score
5. **Edit Lead**: Click any row to open the detail panel and edit status/email
6. **Convert**: Use the "Convert to Opportunity" button to create an opportunity
7. **View Opportunities**: See all converted opportunities in the right panel

## Features in Detail

### Search & Filtering
- Real-time search across lead names and companies
- Status filtering (New, Contacted, Qualified)
- Persistent filter state using localStorage

### Lead Management
- Inline editing of lead status and email
- Email format validation with error messages
- Optimistic updates with error handling

### Opportunity Conversion
- One-click conversion from leads to opportunities
- Random amount generation (10k-110k range)
- Automatic lead status update to "Qualified"

### Responsive Design
- Mobile-first approach
- Progressive column hiding on smaller screens
- Touch-friendly interface elements

## Development

- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Vite**: Fast development server with HMR
- **ESLint**: Code quality and consistency

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)