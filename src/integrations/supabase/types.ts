export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          account_type: string | null;
          balance: number | null;
          created_at: string | null;
          equity: number | null;
          id: string;
          is_active: boolean | null;
          margin_used: number | null;
          reset_count: number | null;
          user_id: string | null;
        };
        Insert: {
          account_type?: string | null;
          balance?: number | null;
          created_at?: string | null;
          equity?: number | null;
          id?: string;
          is_active?: boolean | null;
          margin_used?: number | null;
          reset_count?: number | null;
          user_id?: string | null;
        };
        Update: {
          account_type?: string | null;
          balance?: number | null;
          created_at?: string | null;
          equity?: number | null;
          id?: string;
          is_active?: boolean | null;
          margin_used?: number | null;
          reset_count?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      assets: {
        Row: {
          asset_class: string | null;
          base_currency: string | null;
          contract_size: number | null;
          id: string;
          is_active: boolean | null;
          leverage_max: number | null;
          name: string;
          quote_currency: string | null;
          spread_base: number | null;
          symbol: string;
          user_id: string | null;
        };
        Insert: {
          asset_class?: string | null;
          base_currency?: string | null;
          contract_size?: number | null;
          id?: string;
          is_active?: boolean | null;
          leverage_max?: number | null;
          name: string;
          quote_currency?: string | null;
          spread_base?: number | null;
          symbol: string;
          user_id?: string | null;
        };
        Update: {
          asset_class?: string | null;
          base_currency?: string | null;
          contract_size?: number | null;
          id?: string;
          is_active?: boolean | null;
          leverage_max?: number | null;
          name?: string;
          quote_currency?: string | null;
          spread_base?: number | null;
          symbol?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      kyc_documents: {
        Row: {
          category: string | null;
          comments: string | null;
          document_type: string | null;
          file_name: string | null;
          file_url: string;
          id: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string | null;
          uploaded_at: string | null;
          user_id: string | null;
        };
        Insert: {
          category?: string | null;
          comments?: string | null;
          document_type?: string | null;
          file_name?: string | null;
          file_url: string;
          id?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string | null;
          uploaded_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string | null;
          comments?: string | null;
          document_type?: string | null;
          file_name?: string | null;
          file_url?: string;
          id?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string | null;
          uploaded_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      market_data: {
        Row: {
          id: number;
          price: number;
          symbol: string;
          timestamp: string;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          price: number;
          symbol: string;
          timestamp?: string;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          price?: number;
          symbol?: string;
          timestamp?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          asset_class: string | null;
          created_at: string | null;
          direction: string | null;
          id: string;
          margin_required: number | null;
          order_type: string | null;
          position_value: number | null;
          price: number | null;
          quantity: number | null;
          requested_price: number | null;
          side: string | null;
          status: string | null;
          stop_loss_price: number | null;
          symbol: string;
          take_profit_price: number | null;
          user_id: string | null;
        };
        Insert: {
          asset_class?: string | null;
          created_at?: string | null;
          direction?: string | null;
          id?: string;
          margin_required?: number | null;
          order_type?: string | null;
          position_value?: number | null;
          price?: number | null;
          quantity?: number | null;
          requested_price?: number | null;
          side?: string | null;
          status?: string | null;
          stop_loss_price?: number | null;
          symbol: string;
          take_profit_price?: number | null;
          user_id?: string | null;
        };
        Update: {
          asset_class?: string | null;
          created_at?: string | null;
          direction?: string | null;
          id?: string;
          margin_required?: number | null;
          order_type?: string | null;
          position_value?: number | null;
          price?: number | null;
          quantity?: number | null;
          requested_price?: number | null;
          side?: string | null;
          status?: string | null;
          stop_loss_price?: number | null;
          symbol?: string;
          take_profit_price?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      orders_ext: {
        Row: {
          account_id: string | null;
          asset_id: string | null;
          avg_fill_price: number | null;
          created_at: string | null;
          expires_at: string | null;
          filled_at: string | null;
          filled_quantity: number | null;
          id: string;
          order_type: string | null;
          price: number | null;
          quantity: number;
          side: string | null;
          status: string | null;
          stop_price: number | null;
        };
        Insert: {
          account_id?: string | null;
          asset_id?: string | null;
          avg_fill_price?: number | null;
          created_at?: string | null;
          expires_at?: string | null;
          filled_at?: string | null;
          filled_quantity?: number | null;
          id?: string;
          order_type?: string | null;
          price?: number | null;
          quantity: number;
          side?: string | null;
          status?: string | null;
          stop_price?: number | null;
        };
        Update: {
          account_id?: string | null;
          asset_id?: string | null;
          avg_fill_price?: number | null;
          created_at?: string | null;
          expires_at?: string | null;
          filled_at?: string | null;
          filled_quantity?: number | null;
          id?: string;
          order_type?: string | null;
          price?: number | null;
          quantity?: number;
          side?: string | null;
          status?: string | null;
          stop_price?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_ext_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_ext_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      positions: {
        Row: {
          created_at: string | null;
          entry_price: number | null;
          id: string;
          leverage: number | null;
          liquidation_price: number | null;
          quantity: number | null;
          symbol: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          entry_price?: number | null;
          id?: string;
          leverage?: number | null;
          liquidation_price?: number | null;
          quantity?: number | null;
          symbol: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          entry_price?: number | null;
          id?: string;
          leverage?: number | null;
          liquidation_price?: number | null;
          quantity?: number | null;
          symbol?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      positions_ext: {
        Row: {
          account_id: string | null;
          asset_id: string | null;
          current_price: number | null;
          entry_price: number;
          id: string;
          leverage: number | null;
          margin_required: number | null;
          opened_at: string | null;
          quantity: number;
          rollover_charges: number | null;
          side: string | null;
          stop_loss: number | null;
          take_profit: number | null;
          unrealized_pnl: number | null;
          updated_at: string | null;
        };
        Insert: {
          account_id?: string | null;
          asset_id?: string | null;
          current_price?: number | null;
          entry_price: number;
          id?: string;
          leverage?: number | null;
          margin_required?: number | null;
          opened_at?: string | null;
          quantity: number;
          rollover_charges?: number | null;
          side?: string | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          unrealized_pnl?: number | null;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string | null;
          asset_id?: string | null;
          current_price?: number | null;
          entry_price?: number;
          id?: string;
          leverage?: number | null;
          margin_required?: number | null;
          opened_at?: string | null;
          quantity?: number;
          rollover_charges?: number | null;
          side?: string | null;
          stop_loss?: number | null;
          take_profit?: number | null;
          unrealized_pnl?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "positions_ext_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "positions_ext_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          experience_level: string | null;
          first_name: string | null;
          id: string;
          is_verified: boolean | null;
          kyc_status: string | null;
          last_login: string | null;
          last_name: string | null;
          password_hash: string;
          preferences: Json | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          experience_level?: string | null;
          first_name?: string | null;
          id?: string;
          is_verified?: boolean | null;
          kyc_status?: string | null;
          last_login?: string | null;
          last_name?: string | null;
          password_hash: string;
          preferences?: Json | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          experience_level?: string | null;
          first_name?: string | null;
          id?: string;
          is_verified?: boolean | null;
          kyc_status?: string | null;
          last_login?: string | null;
          last_name?: string | null;
          password_hash?: string;
          preferences?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
};
