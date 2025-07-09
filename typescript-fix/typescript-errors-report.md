# TypeScript Error Report
Generated on Wed Jul  9 14:08:22 UTC 2025

## Error Summary by Type
- **@typescript-eslint/no-unsafe-member-access**: 282 occurrences
- **@typescript-eslint/no-unsafe-assignment**: 165 occurrences
- **@typescript-eslint/no-unsafe-call**: 106 occurrences
- **@typescript-eslint/no-unsafe-argument**: 66 occurrences
- **@typescript-eslint/no-floating-promises**: 55 occurrences
- **@typescript-eslint/no-misused-promises**: 48 occurrences
- **@typescript-eslint/no-unsafe-return**: 46 occurrences
- **@typescript-eslint/only-throw-error**: 17 occurrences
- **@typescript-eslint/require-await**: 13 occurrences
- **@typescript-eslint/no-redundant-type-constituents**: 4 occurrences
- **@typescript-eslint/prefer-promise-reject-errors**: 1 occurrences
- **@typescript-eslint/parser**: 1 occurrences
- **@typescript-eslint/await-thenable**: 1 occurrences

## Files with Most Errors

## Error Examples by Type

### @typescript-eslint/no-unsafe-member-access
```typescript
  32:15  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
  32:21  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
  39:17  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
  40:19  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<MarketAlert[]>`                                                                       @typescript-eslint/no-unsafe-argument
  40:24  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
  59:5   error  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises

--
  36:15  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
  36:21  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
```

#### Recommendations for fixing @typescript-eslint/no-unsafe-member-access:
- Add type guards before accessing properties
- Define proper interfaces for objects
- Use optional chaining (`?.`) when appropriate

### @typescript-eslint/no-unsafe-assignment
```typescript

/workspaces/Trade-Pro/src/components/AlertsWidget.tsx
  32:15  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
  32:21  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
  39:17  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
  40:19  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<MarketAlert[]>`                                                                       @typescript-eslint/no-unsafe-argument
--

/workspaces/Trade-Pro/src/components/EnhancedNewsWidget.tsx
  36:15  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
```

#### Recommendations for fixing @typescript-eslint/no-unsafe-assignment:
- Replace `any` type with proper interface or type
- Add type guards to validate the data shape
- Use proper typing for API responses

### @typescript-eslint/no-unsafe-call
```typescript

/workspaces/Trade-Pro/src/__tests__/useOrderApi.test.tsx
  32:3  error  Unsafe call of a(n) `error` type typed value  @typescript-eslint/no-unsafe-call
  56:5  error  Unsafe call of a(n) `error` type typed value  @typescript-eslint/no-unsafe-call
  65:5  error  Unsafe call of a(n) `error` type typed value  @typescript-eslint/no-unsafe-call

/workspaces/Trade-Pro/src/components/AlertsWidget.tsx
--
  102:9   error  Unsafe argument of type error typed assigned to a parameter of type `number`                                                                                        @typescript-eslint/no-unsafe-argument
  105:7   error  Unsafe assignment of an error typed value                                                                                                                           @typescript-eslint/no-unsafe-assignment
```

#### Recommendations for fixing @typescript-eslint/no-unsafe-call:
- Review TypeScript documentation for this rule
- Consider adding more specific types

### @typescript-eslint/no-unsafe-argument
```typescript
  32:21  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
  39:17  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
  40:19  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<MarketAlert[]>`                                                                       @typescript-eslint/no-unsafe-argument
  40:24  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
  59:5   error  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises
--
  36:21  error  Unsafe array destructuring of a tuple element with an `any` value                                                                                                   @typescript-eslint/no-unsafe-assignment
  43:17  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
  44:17  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<NewsItem[]>`                                                                          @typescript-eslint/no-unsafe-argument
  44:22  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
```

#### Recommendations for fixing @typescript-eslint/no-unsafe-argument:
- Review TypeScript documentation for this rule
- Consider adding more specific types

### @typescript-eslint/no-floating-promises
```typescript
  40:19  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<MarketAlert[]>`                                                                       @typescript-eslint/no-unsafe-argument
  40:24  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
  59:5   error  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises

/workspaces/Trade-Pro/src/components/EnhancedNewsWidget.tsx
--
  44:17  error  Unsafe argument of type `any` assigned to a parameter of type `SetStateAction<NewsItem[]>`                                                                          @typescript-eslint/no-unsafe-argument
  44:22  error  Unsafe member access .data on an `any` value                                                                                                                        @typescript-eslint/no-unsafe-member-access
  61:5   error  Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises

```

#### Recommendations for fixing @typescript-eslint/no-floating-promises:
- Add `await` keyword to promise calls
- Add `.catch()` error handling
- Use `void` operator for intentionally unhandled promises: `void promise()`
