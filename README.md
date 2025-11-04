# star-wars-character-app
A small React + Tailwind CSS application that lists Star Wars characters fetched from the SWAPI API. Clicking a character card opens a modal with more details about that character.

# How to Run the Project
1. Clone the repository.
2. Install dependencies using "npm install".
3. Start the development server using "npm run dev".
4. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

# What’s Implemented

* Fetches data from SWAPI (Star Wars API).
* Displays characters as responsive cards.
* Clicking a card opens a modal showing:
  * Name
  * Height
  * Gender
  * Birth Year
* Includes a loading indicator while fetching data.
* Combined Search + Filter: Support combined filtering and searching.

# Design Choices & Trade-offs
* Tailwind CSS for quick and consistent styling.
* Functional components + hooks (React’s latest patterns).
* Modal state managed at the list level to simplify logic.
