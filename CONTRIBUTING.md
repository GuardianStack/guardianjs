# Contributing to GuardianJS Free

Thank you for your interest in contributing to GuardianJS Free! We welcome contributions from the community and appreciate your time and effort.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title** for the issue
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what behavior you expected
- **Include screenshots or code snippets** if relevant
- **Specify your environment**: OS, browser, browser version

**Bug Report Template:**

```markdown
**Description:**
A clear description of the bug.

**Steps to Reproduce:**
1. Step one
2. Step two
3. ...

**Expected Behavior:**
What you expected to happen.

**Actual Behavior:**
What actually happened.

**Environment:**
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- GuardianJS Version: [e.g., 0.1.0]

**Additional Context:**
Any other relevant information.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the proposed enhancement
- **Explain why this enhancement would be useful**
- **Include examples** of how the feature would be used
- **List any alternatives** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding guidelines
3. **Add tests** if you're adding new functionality
4. **Update documentation** if necessary
5. **Ensure all tests pass** before submitting
6. **Write a clear commit message** following our guidelines
7. **Submit a pull request** with a comprehensive description

**Pull Request Template:**

```markdown
**Description:**
Brief description of changes.

**Motivation and Context:**
Why is this change needed?

**Type of Change:**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing:**
How has this been tested?

**Checklist:**
- [ ] My code follows the project's coding guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/guardianstack/guardianjs-free.git
   cd guardianjs-free
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development build:**
   ```bash
   npm run build:watch
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Coding Guidelines

### TypeScript Style

- Use **TypeScript** for all new code
- Prefer **interfaces** over type aliases where possible
- Use **meaningful variable and function names**
- Keep functions **small and focused** on a single task
- Avoid using `any` - use `unknown` when type is truly unknown

### Code Formatting

- We use **Prettier** for code formatting (configuration in the project)
- Indentation: **2 spaces**
- Line length: **120 characters max**
- Use **single quotes** for strings
- Use **semicolons**

### Documentation

- **Add JSDoc comments** for all exported functions, types, and classes
- Include **examples** in JSDoc when helpful
- Document **parameters and return types**
- Explain **complex logic** with inline comments

Example:
```typescript
/**
 * Computes a stable hash from the given value.
 * 
 * @param {unknown} value - The value to hash.
 * @returns {string} A 16-character hexadecimal hash.
 * 
 * @example
 * ```typescript
 * const hash = stableHash({ a: 1, b: 2 });
 * console.log(hash); // '3a2b1c4d5e6f7g8h'
 * ```
 * 
 * @public
 */
export function stableHash(value: unknown): string {
  // Implementation
}
```

### File Organization

- Keep files **focused on a single responsibility**
- Place shared utilities in `src/utils/`
- Place signal collectors in `src/sources/`
- Export public APIs through `src/index.ts`

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat(audio): add Safari 17 detection for audio fingerprinting
fix(webgl): handle missing getParameter method gracefully
docs(readme): update installation instructions
```

## Testing

Currently, GuardianJS Free doesn't have a comprehensive test suite. We welcome contributions to improve test coverage!

When adding tests:
- Place test files adjacent to source files with `.test.ts` extension
- Write clear test descriptions
- Test edge cases and error conditions
- Ensure tests are deterministic and don't depend on timing

## Documentation

### Code Documentation

- Add JSDoc comments to all public APIs
- Keep documentation up-to-date with code changes
- Include practical examples

### README Updates

If your changes affect the public API or usage:
- Update the README.md with examples
- Update API documentation
- Add migration notes for breaking changes

## Questions?

If you have questions about contributing:
- Open a GitHub issue with the `question` label
- Check existing issues and discussions
- Review the README and documentation

Thank you for contributing to GuardianJS Free! 🎉

