# 🤖 GitHub Copilot Instructions

These are guidelines to help GitHub Copilot generate consistent and production-friendly code and commits.

---

## ✅ General Coding Guidelines

- Use **TypeScript** syntax.
- Use **functional components** and **React hooks** for UI code.
- Prefer **pure functions**.
- Follow **existing patterns** in the project.
- Suggest **accessibility best practices** in components (e.g., aria labels).
- Format code according to **Biome** config.
- Follow **strict typing** — avoid `any`, use proper types or generics.

---

## 📝 TypeScript Guidelines

#### Interface Extends
- ALWAYS prefer interfaces when modelling inheritance.
- The `&` operator has terrible performance in TypeScript. Only use it where `interface extends` is not possible.

```ts
// BAD
type A = {
  a: string;
};

type B = {
  b: string;
};

type C = A & B;
```

```ts
// GOOD
interface A {
  a: string;
}

interface B {
  b: string;
}

interface C extends A, B {
  // Additional properties can be added here
}
```

#### Default Exports
- Unless explicitly required by the framework, do not use default exports.

```ts
// BAD
export default function myFunction() {
  return <div>Hello</div>;
}
```

```ts
// GOOD
export function myFunction() {
  return <div>Hello</div>;
}
```

- Default exports create confusion from the importing file.

```ts
// BAD
import myFunction from "./myFunction";
```

```ts
// GOOD
import { myFunction } from "./myFunction";
```

- There are certain situations where a framework may require a default export. For instance, Next.js requires a default export for pages.

```tsx
// This is fine, if required by the framework
export default function MyPage() {
  return <div>Hello</div>;
}
```

#### Any in Generic Functions
- Avoid using `any` inside generic functions. This defeats the purpose of generics and loses type safety.
- Use type constraints or proper generic types instead.

```ts
// BAD - defeats the purpose of generics
const processValue = <T>(value: T): any => {
  return JSON.parse(JSON.stringify(value));
};
```

```ts
// GOOD - maintains type safety
const processValue = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};
```

```ts
// EVEN BETTER - use proper typing for JSON operations
const cloneValue = <T>(value: T): T => {
  return structuredClone(value);
};
```

- When you need to work with unknown types, use `unknown` instead of `any`:

```ts
// BAD
const handleApiResponse = <T>(response: any): T => {
  return response.data;
};
```

```ts
// GOOD
const handleApiResponse = <T>(response: unknown): T => {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as { data: T }).data;
  }
  throw new Error('Invalid response format');
};
```

#### Optional Properties
- Use optional properties extremely sparingly. Only use them when the property is truly optional, and consider whether bugs may be caused by a failure to pass the property.
- In cases where you always want to pass a value (even if it's `undefined`), make the property required and use union types instead.

```ts
// BAD - allows forgetting to pass userId entirely
type AuthOptions = {
  userId?: string;
};

const func = (options: AuthOptions) => {
  const userId = options.userId;
};
```

```ts
// GOOD - forces explicit handling of undefined
type AuthOptions = {
  userId: string | undefined;
};

const func = (options: AuthOptions) => {
  const userId = options.userId;
};
```

- This approach prevents bugs caused by forgetting to pass important properties, even when their value might be `undefined`.

#### Import Type
- Use `import type` whenever you are importing a type.
- Prefer top-level `import type` over inline `import { type ... }`.

```ts
// BAD
import { type User } from "./user";
```

```ts
// GOOD
import type { User } from "./user";
```

- The reason for this is that in certain environments, the first version's import will not be erased. So you'll be left with:

```ts
// Before transpilation
import { type User } from "./user";

// After transpilation
import "./user";
```

- This can cause unnecessary side effects and module loading when you only intended to import types.

#### Discriminated Unions
- Proactively use discriminated unions to model data that can be in one of a few different shapes.

```ts
type UserCreatedEvent = {
  type: "user.created";
  data: { id: string; email: string };
};

type UserDeletedEvent = {
  type: "user.deleted";
  data: { id: string };
};

type Event = UserCreatedEvent | UserDeletedEvent;
```

- Use switch statements to handle the results of discriminated unions:

```ts
const handleEvent = (event: Event) => {
  switch (event.type) {
    case "user.created":
      console.log(event.data.email);
      break;
    case "user.deleted":
      console.log(event.data.id);
      break;
  }
};
```

- Use discriminated unions to prevent the 'bag of optionals' problem.

```ts
// BAD - allows impossible states
type FetchingState<TData> = {
  status: "idle" | "loading" | "success" | "error";
  data?: TData;
  error?: Error;
};

// GOOD - prevents impossible states
type FetchingState<TData> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: TData }
  | { status: "error"; error: Error };
```

#### Readonly Properties
- Use `readonly` properties for object types by default. This will prevent accidental mutation at runtime.
- Omit `readonly` only when the property is genuinely mutable.

```ts
// BAD
type User = {
  id: string;
};

const user: User = {
  id: "1",
};

user.id = "2";
```

```ts
// GOOD
type User = {
  readonly id: string;
};

const user: User = {
  id: "1",
};

user.id = "2"; // Error
```

#### Throwing
- Think carefully before implementing code that throws errors.
- If a thrown error produces a desirable outcome in the system, go for it. For instance, throwing a custom error inside a backend framework's request handler.
- However, for code that you would need a manual try catch for, consider using a result type instead:

```ts
type Result<T, E extends Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

- For example, when parsing JSON:

```ts
const parseJson = (
  input: string,
): Result<unknown, Error> => {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};
```

- This way you can handle the error in the caller:

```ts
const result = parseJson('{"name": "John"}');

if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

#### Return Types
- When declaring functions on the top-level of a module, declare their return types. This will help future AI assistants understand the function's purpose.

```ts
const myFunc = (): string => {
  return "hello";
};
```

- One exception to this is components which return JSX. No need to declare the return type of a component, as it is always JSX.

```tsx
const MyComponent = () => {
  return <div>Hello</div>;
};
```

#### Enums
- Do not introduce new enums into the codebase. Retain existing enums.
- If you require enum-like behaviour, use an `as const` object:

```ts
const backendToFrontendEnum = {
  xs: "EXTRA_SMALL",
  sm: "SMALL",
  md: "MEDIUM",
} as const;

type LowerCaseEnum = keyof typeof backendToFrontendEnum; // "xs" | "sm" | "md"

type UpperCaseEnum =
  (typeof backendToFrontendEnum)[LowerCaseEnum]; // "EXTRA_SMALL" | "SMALL" | "MEDIUM"
```

- Remember that numeric enums behave differently to string enums. Numeric enums produce a reverse mapping:

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const direction = Direction.Up; // 0
const directionName = Direction[0]; // "Up"
```

- This means that the enum `Direction` above will have eight keys instead of four.

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

Object.keys(Direction).length; // 8
```

#### No Unchecked Indexed Access
- If the user has this rule enabled in their `tsconfig.json`, indexing into objects and arrays will behave differently from how you expect.

```ts
const obj: Record<string, string> = {};

// With noUncheckedIndexedAccess, value will
// be `string | undefined`
// Without it, value will be `string`
const value = obj.key;
```

```ts
const arr: string[] = [];

// With noUncheckedIndexedAccess, value will
// be `string | undefined`
// Without it, value will be `string`
const value = arr[0];
```

#### JSDoc Comments
- Use JSDoc comments to annotate functions and types.
- Be concise in JSDoc comments, and only provide JSDoc comments if the function's behaviour is not self-evident.
- Use the JSDoc inline `@link` tag to link to other functions and types within the same file.

```ts
/**
 * Subtracts two numbers
 */
const subtract = (a: number, b: number) => a - b;

/**
 * Does the opposite to {@link subtract}
 */
const add = (a: number, b: number) => a + b;
```

---

## 📦 Dependencies

- Use `pnpm` for package management.
- Avoid suggesting large dependencies unless necessary.
- When installing libraries, do not rely on your own training data.
- Your training data has a cut-off date. You're probably not aware of all of the latest developments in the JavaScript and TypeScript world.
- This means that instead of picking a version manually (via updating the `package.json` file), you should use a script to install the latest version of a library.

```bash
# pnpm
pnpm add -D @typescript-eslint/eslint-plugin

# yarn
yarn add -D @typescript-eslint/eslint-plugin

# npm
npm install --save-dev @typescript-eslint/eslint-plugin
```

- This will ensure you're always using the latest version.

### Naming Conventions
- Use kebab-case for file names (e.g., `my-component.ts`)
- Use camelCase for variables and function names (e.g., `myVariable`, `myFunction()`)
- Use UpperCamelCase (PascalCase) for classes, types, and interfaces (e.g., `MyClass`, `MyInterface`)
- Use ALL_CAPS for constants and enum values (e.g., `MAX_COUNT`, `Color.RED`)
- Inside generic types, functions or classes, prefix type parameters with `T` (e.g., `TKey`, `TValue`)

```ts
type RecordOfArrays<TItem> = Record<string, TItem[]>;
```

---


## 📁 Project Structure

All code should be organized within the `src/` folder with the following structure:

```
src/
├── app/                    # Next.js App Router (pages, layouts, route handlers)
│   ├── favicon.ico         # App favicon
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page component
├── assets/                 # Static assets (images, icons, fonts)
├── components/             # Shared/reusable UI components
│   └── button/             # Button component folder
│       ├── button.tsx           # Main component file
│       ├── button.test.tsx      # Component tests
│       └── index.ts             # Barrel export file
├── config/                 # Application configuration and constants
├── contexts/               # React contexts and providers
├── features/               # Feature-specific code (domain-driven)
│   └── [feature-name]/
│       ├── api/           # Feature-specific API calls and endpoints
│       ├── assets/         # Feature-specific assets
│       ├── components/     # Feature-specific components
│       ├── contexts/       # Feature-specific contexts
│       ├── hooks/          # Feature-specific custom hooks
│       ├── lib/           # Feature-specific business logic
│       ├── schemas/        # Feature-specific validation schemas
│       ├── types/         # Feature-specific type definitions
│       ├── utils/         # Feature-specific utilities
│       ├── tests/         # Feature-specific tests
│       └── index.ts       # Feature exports
├── hooks/                 # Shared custom React hooks
├── lib/                   # Shared business logic and configurations
│   └── api-client.ts      # Global API client for making HTTP requests
├── mocks/                 # Mock data and MSW handlers for testing
├── providers/             # React providers and global state management
├── schemas/               # Shared validation schemas (Zod, Yup, etc.)
├── styles/                # Global styles and CSS files
│   └── globals.css        # Global CSS styles
├── utils/                 # Shared utility functions
│   └── cn.ts             # CSS class utility function
├── tests/                 # Global test setup and shared test utilities
│   ├── e2e/               # End-to-end tests
│   │   ├── example.spec.ts     # Example E2E test
│   │   └── setup/              # E2E test setup
│   │       └── auth.setup.ts   # Authentication setup for E2E
│   └── setup/             # Test configuration
│       ├── global-setup.ts     # Global test setup
│       └── setup-test-env.tsx  # Test environment setup
└── types/                 # Global type definitions
    └── reset.d.ts         # CSS reset type definitions
```

### Key Principles:
- **Feature-first organization**: Put feature-specific code inside the respective feature folder
- **Shared vs. Feature-specific**: Only put truly reusable code in shared folders (`components/`, `lib/`, `utils/`)
- **Co-location**: Keep related files close together
- **Barrel exports**: Use `index.ts` files to create clean import paths

### Examples:

```typescript
// ✅ GOOD: Feature-specific component
import { UserProfile } from '@/features/auth/components/user-profile';

// ✅ GOOD: Shared component
import { Button } from '@/components/button';

// ❌ BAD: Feature logic in shared folder
import { validateUser } from '@/lib/validate-user'; // Should be in features/auth/lib/
```

### Feature Organization Rules:
- **ALWAYS** put feature-specific code inside the feature folder
- **NEVER** put feature logic in shared folders (`lib/`, `utils/`, `components/`)
- **Shared code** should only contain truly reusable logic used by multiple features
- **Each feature** should be completely self-contained and deletable

---

## 🧾 Commits (Conventional Commits)

Use the following format for commit messages:

```
<type>(<scope>): <short description> (#<task-id>)
```

### Examples:
- `feat(auth): add password reset flow (#123)`
- `fix(ui): adjust button padding (#99)`
- `chore: update dependencies`

### Types:
- `feat` – new feature
- `fix` – bug fix
- `chore` – maintenance
- `docs` – documentation
- `test` – adding tests
- `refactor` – refactoring without new features or bugs
- `style` – formatting only
- `perf` – performance improvements
- `ci` – CI/CD changes

---

## 🔄 Releases

- Commits follow **semantic-release** rules.
- `feat` and `fix` trigger version bumps.
- Breaking changes must include `BREAKING CHANGE:` in the commit body.

---


