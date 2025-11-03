# 🛒 E-Commerce Web App (Next.js + Tailwind)

A modern, mobile-friendly e-commerce application built with **Next.js App Router**, **React**, and **TailwindCSS**. Designed to showcase scalable architecture, reusable components, and real-world features like cart management and product browsing.

## 🚀 Features

- Modular file structure with `app/` routing
- Reusable components: `Header`, `Footer`, `BannerCarousel`, `ProductCard`
- Cart system powered by global `CartContext` with localStorage persistence
- Dynamic product listing from mock data (ready for database integration)
- Responsive UI with TailwindCSS
- Prepared for backend integration and gesture-based UX

## 🛠️ Tech Stack

- [Next.js 13+](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- Supabase (in progress)
- TypeScript (planned)

## 📌 Notes

This project is structured for scalability and clarity. Each module is designed to be extensible, maintainable, and ready for real-world integration. Filtering logic, cart state, and layout components are modular and reusable.

## 🗺️ Roadmap

✅ Completed
- Product filtering system (tags, rating, price range)
- Responsive product card layout
- CartContext with localStorage persistence

🔄 In Progress
- Supabase integration for dynamic product data
- Authentication and role-based access control

🧭 Upcoming
- Admin dashboard for product management (CRUD)
- Customer vs admin role separation
- Order history and checkout flow
- Pagination and search
- SEO optimization and metadata

## 📦 Getting Started

- Live Demo: https://mini-ecommerce-alpha-three.vercel.app/
- for open http://localhost:3000 in your browser you need to
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
