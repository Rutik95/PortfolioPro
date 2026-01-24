# Rutik Tarerkar's Portfolio

A modern, responsive portfolio website for a Frontend Engineer specializing in Vue.js, enterprise applications, and AI-enhanced development. Built with Vue.js 3, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Vue 3, TypeScript, Vite, Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Fast Performance**: Optimized with Vite for lightning-fast development
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Project Showcase**: Filterable project gallery with detailed descriptions
- **Contact Form**: Functional contact form with validation
- **Experience Timeline**: Interactive timeline of professional experience

## 🛠️ Tech Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Icons**: Custom SVG components

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── assets/         # Static assets and styles
│   ├── components/     # Reusable Vue components
│   ├── views/         # Page components
│   ├── router/        # Vue Router configuration
│   └── stores/        # Pinia stores
├── public/            # Public assets
└── dist/             # Build output
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customization

### Personal Information

Update the following files with your information:
- `src/views/HomeView.vue` - Hero section and personal details
- `src/views/AboutView.vue` - About section and experience
- `src/views/ContactView.vue` - Contact information and social links

### Projects

Edit the `projects` array in `src/views/ProjectsView.vue` to showcase your work.

### Styling

The design uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.js` - Tailwind configuration
- `src/assets/main.css` - Additional styles

## 📱 Sections

1. **Home**: Hero section with introduction and featured projects
2. **About**: Personal story, skills, and professional experience
3. **Projects**: Detailed project showcase with filtering
4. **Contact**: Contact form and social media links

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add deploy script to package.json
3. Run: `npm run deploy`

## 🤝 Contributing

Feel free to fork this project and customize it for your needs. If you find any issues or have suggestions, please open an issue or submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by Rutik