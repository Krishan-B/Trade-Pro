export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          experience_level: string;
          preferences?: Record<string, unknown>;
          password_hash: string;
          created_at?: string;
          updated_at?: string;
          last_login?: string;
          is_verified?: boolean;
          kyc_status?: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      // Add other tables as needed
    };
    Views: Record<string, {
        Row: Record<string, unknown>;
      }>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
}
