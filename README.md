# frontend-interview

## Project Goal
Build a small UI that lets a user search a dataset, view results, and open item details.

## Requirements
- Search
    - Filters by name or tags (case-insensitive)
    - Input should either include a button to submit search or debounce input by ~200-300ms
- Results view
    - Render filtered results in a list
    - Show empty state if no results
    - Each result shows name, category, rating, price
- Details view
    - Clicking a result shows a details panel (can be inline or modal)
    - Details show full description and tags

## Data Structure
Each item in `src/data/items.json` has the following shape:
```ts
{
  id: number
  name: string
  category: string
  rating: string
  price: string
  description: string
  tags: string[]
}
```

## Bonus
- Show loading state while searching
- Basic accessibility (labels, focus, semantic HTML)
- Basic styling with Tailwind (clean, not bloated)

## Getting Started
```bash
git clone https://github.com/youth-inc/frontend-interview.git
cd frontend-interview
npm install
npm run dev
```
