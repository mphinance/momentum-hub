# 🤝 Contributing to mphinance Dashboard

Thank you for your interest in contributing to the mphinance Dashboard! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## 📜 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be collaborative**: Work together to improve the project
- **Be constructive**: Provide helpful feedback and suggestions

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/mphinance-dashboard.git
   cd mphinance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

#### 🐛 Bug Fixes
- Fix existing bugs
- Improve error handling
- Resolve performance issues

#### ✨ New Features
- Add new trading indicators
- Implement additional chart types
- Create new analytics views
- Add integration with other brokers

#### 📚 Documentation
- Improve README files
- Add code comments
- Create tutorials
- Update API documentation

#### 🎨 UI/UX Improvements
- Enhance visual design
- Improve accessibility
- Optimize mobile experience
- Add animations and transitions

#### ⚡ Performance Optimizations
- Reduce bundle size
- Improve loading times
- Optimize API calls
- Enhance caching strategies

### What We're Looking For

#### High Priority
- **Mobile responsiveness improvements**
- **Additional broker integrations** (TD Ameritrade, E*TRADE, etc.)
- **Advanced charting features**
- **Real-time data improvements**
- **Performance optimizations**

#### Medium Priority
- **Additional trading strategies**
- **Export/import functionality**
- **Dark/light theme toggle**
- **Keyboard shortcuts**
- **Accessibility improvements**

#### Low Priority
- **UI polish and animations**
- **Additional color themes**
- **Social features**
- **Advanced filtering options**

## 🔄 Pull Request Process

### Before Submitting

1. **Check existing issues** to avoid duplicates
2. **Test your changes** thoroughly
3. **Update documentation** if needed
4. **Follow coding standards** (see below)
5. **Write clear commit messages**

### Submitting a Pull Request

1. **Create a descriptive title**
   ```
   feat: Add real-time options chain data
   fix: Resolve watchlist sorting issue
   docs: Update installation instructions
   ```

2. **Provide detailed description**
   - What changes were made?
   - Why were these changes necessary?
   - How were the changes tested?
   - Any breaking changes?

3. **Include screenshots** for UI changes

4. **Reference related issues**
   ```
   Closes #123
   Fixes #456
   Related to #789
   ```

### Review Process

1. **Automated checks** must pass (linting, building)
2. **Code review** by maintainers
3. **Testing** on different devices/browsers
4. **Approval** and merge

## 🐛 Issue Guidelines

### Reporting Bugs

Use the bug report template and include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, device)
- **Console errors** if any

### Feature Requests

Use the feature request template and include:

- **Clear description** of the feature
- **Use case** and benefits
- **Proposed implementation** (if you have ideas)
- **Mockups or examples** if applicable

### Questions and Discussions

- Use GitHub Discussions for general questions
- Check existing issues and documentation first
- Provide context for your question

## 💻 Coding Standards

### TypeScript Guidelines

```typescript
// Use explicit types
interface TradeData {
  symbol: string;
  price: number;
  quantity: number;
}

// Use meaningful variable names
const calculateProfitLoss = (entry: number, exit: number): number => {
  return exit - entry;
};

// Use proper error handling
try {
  const data = await fetchStockData(symbol);
  return data;
} catch (error) {
  console.error('Failed to fetch stock data:', error);
  throw new Error('Stock data unavailable');
}
```

### React Component Guidelines

```tsx
// Use functional components with hooks
const WatchlistRow: React.FC<WatchlistRowProps> = ({ 
  stock, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Use meaningful function names
  const handleSaveChanges = useCallback(() => {
    // Implementation
  }, []);
  
  return (
    <tr className="hover:bg-[#2A2A2A] transition-colors">
      {/* Component JSX */}
    </tr>
  );
};
```

### CSS/Tailwind Guidelines

```tsx
// Use consistent color scheme
const colors = {
  profit: '#39FF14',
  loss: '#BF00FF',
  background: '#1A1A1A',
  surface: '#2C2C2C',
  text: '#F0F0F0'
};

// Use semantic class names
<div className="bg-[#2C2C2C] rounded-lg p-4 hover:bg-[#383838] transition-colors">
  <span className="text-[#39FF14] font-mono">+$123.45</span>
</div>
```

### File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── services/           # API services
└── constants/          # App constants
```

### Naming Conventions

- **Files**: PascalCase for components (`WatchlistRow.tsx`)
- **Variables**: camelCase (`stockPrice`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`StockData`, `TradeProps`)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

```typescript
// Component tests
import { render, screen, fireEvent } from '@testing-library/react';
import WatchlistRow from './WatchlistRow';

describe('WatchlistRow', () => {
  it('displays stock information correctly', () => {
    const mockStock = {
      symbol: 'AAPL',
      price: 150.00,
      change: 2.50
    };
    
    render(<WatchlistRow stock={mockStock} />);
    
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
  });
});
```

### Test Coverage

Aim for:
- **80%+ overall coverage**
- **90%+ for critical components**
- **100% for utility functions**

## 📝 Documentation

### Code Comments

```typescript
/**
 * Calculates the profit/loss for a trade
 * @param entryPrice - The price at which the position was entered
 * @param exitPrice - The price at which the position was exited
 * @param quantity - The number of shares/contracts
 * @returns The total profit or loss
 */
const calculatePnL = (
  entryPrice: number, 
  exitPrice: number, 
  quantity: number
): number => {
  return (exitPrice - entryPrice) * quantity;
};
```

### README Updates

When adding features, update:
- Feature list in README.md
- Screenshots if UI changed
- Installation instructions if needed
- Configuration options

## 🏷️ Commit Message Guidelines

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(watchlist): add real-time price updates
fix(journal): resolve sorting issue with dates
docs(readme): update installation instructions
style(components): improve button hover states
```

## 🎯 Development Workflow

1. **Check issues** for what needs to be done
2. **Create feature branch** from main
3. **Make changes** following coding standards
4. **Test thoroughly** on different devices
5. **Update documentation** if needed
6. **Submit pull request** with clear description
7. **Address review feedback** promptly
8. **Celebrate** when merged! 🎉

## 📞 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: [Join our community](https://discord.gg/mphinance) (if available)
- **Email**: contribute@mphinance.com

## 🙏 Recognition

Contributors will be:
- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes**
- **Given credit in documentation**
- **Invited to maintainer team** (for significant contributions)

---

**Thank you for contributing to mphinance Dashboard! Your efforts help make trading more accessible and efficient for everyone.**

*Happy coding! 🚀*