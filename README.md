# ✈️ Airlines Demo MVP

A modern, accessible airline booking application built with constitutional compliance principles.

## 🌐 Live Demo

🔗 **[View Live Application](https://vineet-yagnik.github.io/airlines-demo-new/)**

## 🚀 Features

### Core Functionality
- **Flight Search Interface**: Intuitive form with departure/arrival airports, dates, and passenger selection
- **Mock Flight Results**: Realistic airline data with pricing, routes, and booking options
- **Responsive Design**: Mobile-first approach with airline-themed styling

### Constitutional Compliance
- **Accessibility-First**: Screen reader support, ARIA labels, keyboard navigation
- **Performance Monitoring**: Core Web Vitals tracking and budget enforcement
- **Security by Design**: Input validation and sanitization
- **TypeScript Strict Mode**: Comprehensive type safety
- **Design System**: CSS custom properties for consistent theming

## 🛠️ Technical Stack

- **Frontend**: React 19.1.1 + TypeScript 5.9.3
- **Build Tool**: Vite with hot reload
- **Routing**: React Router DOM
- **Code Quality**: ESLint with accessibility rules
- **Testing**: Vitest + Testing Library
- **Deployment**: GitHub Pages with automated CI/CD

## 🏗️ Development

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/vineet-yagnik/airlines-demo-new.git
cd airlines-demo-new

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:run     # Run tests once
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── lib/                # Utilities and libraries
│   ├── performance.ts  # Core Web Vitals monitoring
│   └── validation.ts   # Input validation utilities
├── types/              # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point

tests/                 # Test configuration and utilities
specs/                 # Feature specifications
.github/              # GitHub workflows and documentation
```

## 🎯 Constitutional Principles

This application follows strict constitutional compliance:

1. **Accessibility-First**: WCAG 2.1 AA compliance, screen reader support
2. **Performance Budgets**: Core Web Vitals monitoring and enforcement
3. **Security by Design**: Input validation, sanitization, secure defaults
4. **Type Safety**: Strict TypeScript with comprehensive type definitions
5. **Test-Driven Development**: Comprehensive test coverage with accessibility testing

## 🚀 Deployment

The application is automatically deployed to GitHub Pages via GitHub Actions:

1. **Push to branch** → Triggers deployment pipeline
2. **Run tests** → Ensures quality gate
3. **Build application** → Optimized production build
4. **Deploy to Pages** → Live at https://vineet-yagnik.github.io/airlines-demo-new/

## 📋 Development Methodology

Built using the **Speckit** methodology:
- Constitutional compliance framework
- Systematic feature planning
- Test-driven development
- Performance-first approach
- Accessibility validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow constitutional compliance principles
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
