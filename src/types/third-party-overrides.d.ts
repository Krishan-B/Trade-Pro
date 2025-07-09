// This file overrides problematic type definitions in node_modules

// Fix for @supabase/postgrest-js
declare module "@supabase/postgrest-js" {
  // Provide minimal types to satisfy imports
  export namespace PostgrestFilterBuilder {}
  export namespace PostgrestBuilder {}
}

// Fix for React export
declare module "@types/react" {
  // Empty declaration to override the problematic one
}
