# ZEMLO AI Context & Progress

## Current Objective
The goal is to continuously build and refine the "Master Itinerary Engine" (`app/qmake/[id]/[itineraryCode]/page.tsx`). We are currently working on optimizing the layout and UX for each day of the itinerary.

## Recent Work Completed
1. **Refactored Column Layout:**
   - The itinerary builder table has been successfully split into **7 distinct columns** for each day row:
     1. `Date` (Includes the delete button)
     2. `Vehicle`
     3. `Guide`
     4. `Time` (Service time requirement)
     5. `Sightseeing Name` (Search and add activities with delete controls)
     6. `Meal` (Breakfast, Lunch, Dinner checkboxes)
     7. `Hotel & Staying City` (Moved the staying city input here along with hotel description area)

2. **Database Updates:**
   - Fixed `ObjectId` vs `queryNumber` parameter casting errors in server actions (`updateQuery`, `deleteQuery`, `updateAgent`) to allow database updates based on readable 5-digit strings instead of crashing.
   - Refactored `app/qreg/query/[id]/page.tsx` to handle React 19 / Next.js 15 asynchronous `params` properly.
   - Handled strict TypeScript and ESLint dependencies for `session.user.email` state effects.

## Next Steps
The structure for the 7 columns is now in place in `ExcelStyleBuilder`. The user intends to "work on each column individually" next.

**AI Instructions for Next Phase:**
- Review `app/qmake/[id]/[itineraryCode]/page.tsx` to see the current output for the columns.
- The user will likely focus on improving the aesthetics, interaction formatting, or logic (like adding new inputs or dynamic behaviors) inside specific columns. Wait for the user's prompt on which column to target next.
