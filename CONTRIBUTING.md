# Contributing to Sendable

First off, thank you for considering contributing to Sendable! 🎉

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. Please be respectful and professional in all interactions.

### Our Standards

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Collaborative**: Work together towards the common goal
- **Be Patient**: Help others learn and grow
- **Accept Feedback**: Be open to constructive criticism
- **Focus on What's Best**: Prioritize the project and community

---

##  Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js (v20.x or higher)
- pnpm (v9.x or higher)
- Git
- A Convex account ([Sign up free](https://convex.dev))
- A code editor (VS Code recommended)

### Initial Setup

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/hasnaintypes/sendable-ai.git
   cd sendable-ai
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/hasnaintypes/sendable-ai.git
   ```

4. **Install Dependencies**
   ```bash
   pnpm install
   ```

5. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

6. **Initialize Database**
   ```bash
   npx convex dev --once
   ```

7. **Start Development Server**
   ```bash
   pnpm run dev
   ```

---

## 🔄 Development Workflow

### Branching Strategy

We follow a feature-branch workflow:

```
main (production)
  ↓
develop (staging)
  ↓
feature/your-feature-name (your work)
```

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/what-you-are-documenting
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/lead-scoring`)
- `fix/` - Bug fixes (e.g., `fix/email-validation`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-flow`)
- `test/` - Adding tests (e.g., `test/campaign-creation`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Keep Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch onto upstream/main
git rebase upstream/main

# If there are conflicts, resolve them and continue
git add .
git rebase --continue

# Force push to your fork (only for your feature branches!)
git push origin feature/your-feature-name --force
```

---

## Project Structure

```
sendable-ai/
├── convex/                    # Backend (Convex)
│   ├── auth/                  # Authentication mutations & queries
│   ├── betterAuth/           # Better Auth adapter & config
│   ├── emails/               # Email templates (React Email)
│   ├── leads/                # Lead management (future)
│   ├── campaigns/            # Campaign logic (future)
│   ├── _generated/           # Auto-generated files (don't edit)
│   └── schema.ts             # Database schema definitions
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Protected routes
│   │   ├── (unauth)/        # Public routes
│   │   └── api/             # API routes
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── layout/          # Layout components
│   │   ├── ui/              # shadcn/ui components
│   │   └── providers/       # Context providers
│   └── lib/                 # Shared utilities
└── public/                   # Static assets
```

### Key Files

- `convex/schema.ts` - Database schema (modify carefully)
- `src/app/layout.tsx` - Root layout
- `src/lib/auth/client.tsx` - Client-side auth
- `convex/auth/helpers.ts` - Server-side auth

---

## Coding Standards

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Define types explicitly** - Avoid `any` unless absolutely necessary
- **Use interfaces for objects** - Prefer `interface` over `type` for object shapes
- **Export types** - Make types reusable across files

```typescript
// Good
interface Lead {
  id: string;
  email: string;
  company: string;
  status: "new" | "contacted" | "replied";
}

// Bad
const lead: any = { ... };
```

### React Components

- **Use functional components** - No class components
- **Use hooks** - Leverage React hooks for state and effects
- **One component per file** - Keep files focused
- **Export named components** - Avoid default exports for components

```tsx
// Good
export function LeadCard({ lead }: { lead: Lead }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
}

// Bad
export default ({ lead }) => <div>...</div>
```

### Convex Functions

- **Use clear function names** - Describe what the function does
- **Validate inputs** - Always check arguments
- **Use transactions** - For multi-document operations
- **Handle errors gracefully** - Return meaningful error messages

```typescript
// Good
export const createLead = mutation({
  args: {
    email: v.string(),
    company: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate email format
    if (!args.email.includes("@")) {
      throw new Error("Invalid email format");
    }
    
    // Check for duplicates
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
      
    if (existing) {
      throw new Error("Lead already exists");
    }
    
    return await ctx.db.insert("leads", {
      ...args,
      createdAt: Date.now(),
      status: "new",
    });
  },
});
```

### Styling

- **Use Tailwind CSS** - Utility-first approach
- **Follow shadcn/ui patterns** - For consistent component styling
- **Mobile-first** - Design for mobile, enhance for desktop
- **Dark mode support** - Use theme-aware classes

```tsx
// Good
<div className="flex flex-col gap-4 p-6 md:flex-row md:gap-6 md:p-8">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Click me
  </button>
</div>

// Bad
<div style={{ display: "flex", padding: "24px" }}>
  <button style={{ background: "#007bff" }}>Click me</button>
</div>
```

### File Naming

- **React components**: PascalCase (e.g., `LeadCard.tsx`)
- **Utilities/hooks**: camelCase (e.g., `useLeadFilter.ts`)
- **Convex functions**: camelCase (e.g., `mutations.ts`, `queries.ts`)
- **Pages**: lowercase with hyphens (e.g., `forget-password/page.tsx`)

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(leads): add CSV import functionality"

# Bug fix
git commit -m "fix(auth): correct redirect after password reset"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(campaigns): simplify email generation logic"

# Multiple paragraphs
git commit -m "feat(analytics): add campaign performance dashboard

- Add funnel visualization
- Implement reply rate tracking
- Add sentiment analysis chart

Closes #123"
```

### Commit Best Practices

- **Atomic commits** - Each commit should be a single logical change
- **Present tense** - "Add feature" not "Added feature"
- **Imperative mood** - "Fix bug" not "Fixes bug"
- **Be descriptive** - Explain what and why, not just what
- **Reference issues** - Use "Closes #123" or "Fixes #456"

---

## 🔀 Pull Request Process

### Before Submitting

1. **Update your branch** with the latest main
2. **Run all checks** locally:
   ```bash
   pnpm run lint
   pnpm run build
   # Run type checking
   npx tsc --noEmit
   ```
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Add tests** for new features

### Creating a Pull Request

1. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a PR** on GitHub
   - Use a clear, descriptive title
   - Reference related issues
   - Fill out the PR template completely

3. **PR Title Format**
   ```
   feat(leads): add bulk delete functionality
   fix(auth): resolve email verification bug
   docs(contributing): improve setup instructions
   ```

### PR Template

When you open a PR, include:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Added X functionality
- Fixed Y bug
- Updated Z documentation

## Testing Done
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested on multiple browsers
- [ ] Tested mobile responsiveness

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have added tests that prove my fix/feature works
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have checked my code and corrected any misspellings
```

### Review Process

1. **Automated checks** must pass (linting, type checking, build)
2. **At least one approval** from a maintainer required
3. **Address feedback** promptly and professionally
4. **Resolve conflicts** if any arise
5. **Squash commits** may be required before merge

### After Merge

1. **Delete your branch** (both local and remote)
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your main** branch
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage
pnpm test -- --coverage
```

### Writing Tests

- **Test user flows** - Focus on user-facing functionality
- **Test edge cases** - Handle errors and unexpected inputs
- **Keep tests simple** - One concept per test
- **Use descriptive names** - Clearly state what is being tested

```typescript
// Example test structure
describe("Lead Creation", () => {
  it("should create a new lead with valid data", async () => {
    // Arrange
    const leadData = { email: "test@example.com", company: "ACME" };
    
    // Act
    const result = await createLead(leadData);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe(leadData.email);
  });
  
  it("should reject invalid email format", async () => {
    // Arrange
    const leadData = { email: "invalid-email", company: "ACME" };
    
    // Act & Assert
    await expect(createLead(leadData)).rejects.toThrow("Invalid email");
  });
});
```

---

## Documentation

### Code Documentation

- **Add JSDoc comments** for complex functions
- **Explain "why" not "what"** - Code shows what, comments explain why
- **Keep comments updated** - Outdated comments are worse than none

```typescript
/**
 * Calculates lead score based on engagement metrics
 * 
 * Uses a weighted algorithm that prioritizes recent activity:
 * - Email opens: 1 point
 * - Email clicks: 3 points
 * - Replies: 5 points
 * - Positive sentiment: 2x multiplier
 * 
 * @param lead - The lead to score
 * @returns Score between 0-100
 */
export function calculateLeadScore(lead: Lead): number {
  // Implementation
}
```

### Documentation Files

When updating docs:
- **Keep README.md current** - Reflect actual functionality
- **Update CHANGELOG.md** - Document notable changes
- **Add inline examples** - Show usage in comments
- **Create guides** - For complex features

---

## Questions?

If you have questions:
1. Check existing [Issues](https://github.com/hasnaintypes/sendable-ai/issues)
2. Search [Discussions](https://github.com/hasnaintypes/sendable-ai/discussions)
3. Open a new issue with the `question` label

---

## Thank You!

Your contributions make Sendable better for everyone. We appreciate your time and effort!

---

**Happy Coding!**