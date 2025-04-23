# Public Mini Gallery

## Getting Started

First, run the development server:

```bash
cd public-mini-gallery

npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎥 Demo Preview

| Gallery View                                                                                                                                                                                                                      | Detail View                                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Gallery View](https://firebasestorage.googleapis.com/v0/b/commit-genie.firebasestorage.app/o/public-mini-gallery%2FScreenshot%202025-04-22%20at%2011.21.00%E2%80%AFPM.png?alt=media&token=e3652c58-3bca-4c79-a799-ccc0f2921f07) | ![Detail View](https://firebasestorage.googleapis.com/v0/b/commit-genie.firebasestorage.app/o/public-mini-gallery%2FScreenshot%202025-04-22%20at%2011.21.16%E2%80%AFPM.png?alt=media&token=9b0c3b9c-f842-4be5-8d88-1a16b611050d) |

> 🔄 Scroll to navigate media — the centered thumbnail updates the main viewer and the URL in real time.

### 🏠 Homepage (`/`)

- Displays a **masonry grid layout** of thumbnails
- Uses `react-masonry-css` for responsive columns with varying heights
- Implements **infinite scroll** using intersection observer
- Data is fetched in batches from `/api/gallery` using:
  - `?limit=10&offset=0`
- Gallery state is stored in a global **React Context**, preventing re-fetching

### 🔍 Detail Page (`/[id]`)

- Shows the **full-size image or video** in the main viewer
- Displays metadata (author, prompt, tags, upload date, likes) in column 2
- Column 3 is a **scrollable vertical carousel of ranked thumbnails**
  - Scroll through thumbnails to change the active item
  - The **centered thumbnail is the active item**
  - The **main viewer updates automatically**
  - **URL updates dynamically** with `router.replace("/[id]")`
- Ghost spacers (`height: 45vh`) allow the first/last item to scroll into center

### 📦 API

- Gallery items are served from `/api/gallery`
- The API supports pagination via query parameters:
  - `?limit=10&offset=30`
- Items are sorted by:
  - **Descending like count**
  - Then by **earliest upload date**

## 📂 Structure Highlights

```bash
src/
├── app/
│   ├── page.tsx              # Homepage
│   └── [id]/page.tsx         # Detail viewer
├── components/
│   └── DetailClient.tsx      # Full scroll-driven client-side UI
├── context/
│   └── GalleryContext.tsx    # Global gallery state
├── data/
│   └── gallery-data.ts       # Mock image/video data
├── api/
│   └── api/gallery.ts        # Gallery API route
```
