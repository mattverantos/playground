# OMOP Cohort Builder

This is a Next.js application for building cohorts based on the OMOP common data model. The application features an interactive UI built with Material-UI (MUI) components, allowing users to define cohorts by specifying events, index dates, study periods, and inclusion/exclusion criteria.

## Features

- Interactive card-based UI for cohort definition
- Visualizations showing patient distributions
- SQL generation for cohort criteria
- Expandable/collapsible cards for improved UX
- Patient count updates as criteria change

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/components` - React components
  - `/cards` - Card components for different cohort elements
- `/pages` - Next.js pages
- `/utils` - Utility functions for SQL generation, data fetching, etc.
- `/styles` - Global styles and theme configuration
- `/public` - Static assets

## Backend Integration

This frontend application connects to a Python backend built with the outlines library that processes natural language descriptions of cohorts and converts them to structured definitions. The backend code is located in the `../ra` directory.
