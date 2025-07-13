export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          account_type: "DEMO" | "COMPETITION"
          balance: number
          equity: number
          margin_used: number
          unrealized_pnl: number
          created_at: string
          reset_count: number
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          account_type: "DEMO" | "COMPETITION"
          balance?: number
          margin_used?: number
          unrealized_pnl?: number
          created_at?: string
          reset_count?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          account_type?: "DEMO" | "COMPETITION"
          balance?: number
          margin_used?: number
          unrealized_pnl?: number
          created_at?: string
          reset_count?: number
          is_active?: boolean
        }
      }
      assets: {
        Row: {
          id: string
          symbol: string
          name: string
          asset_type: string
          exchange: string
          market_hours: string
          is_tradable: boolean
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          asset_type: string
          exchange: string
          market_hours: string
          is_tradable?: boolean
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          asset_type?: string
          exchange?: string
          market_hours?: string
          is_tradable?: boolean
        }
      }
      courses: {
        Row: {
          id: string
          educator_id: string
          title: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          educator_id: string
          title: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          educator_id?: string
          title?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
        }
      }
      kyc_documents: {
        Row: {
          user_id: string
          id_url: string | null
          address_url: string | null
          status: string | null
          submitted_at: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          rejection_reason: string | null
        }
        Insert: {
          user_id: string
          id_url?: string | null
          address_url?: string | null
          status?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          rejection_reason?: string | null
        }
        Update: {
          user_id?: string
          id_url?: string | null
          address_url?: string | null
          status?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          rejection_reason?: string | null
        }
      }
      lesson_progress: {
        Row: {
          id: string
          enrollment_id: string
          lesson_id: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          enrollment_id: string
          lesson_id: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          enrollment_id?: string
          lesson_id?: string
          completed_at?: string | null
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string
          lesson_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content: string
          lesson_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string
          lesson_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          account_id: string
          asset_id: string
          order_type: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT"
          side: "BUY" | "SELL"
          quantity: number
          price: number | null
          stop_price: number | null
          status: "PENDING" | "FILLED" | "CANCELLED" | "REJECTED"
          filled_quantity: number | null
          avg_fill_price: number | null
          created_at: string
          filled_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          account_id: string
          asset_id: string
          order_type: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT"
          side: "BUY" | "SELL"
          quantity: number
          price?: number | null
          stop_price?: number | null
          status?: "PENDING" | "FILLED" | "CANCELLED" | "REJECTED"
          filled_quantity?: number | null
          avg_fill_price?: number | null
          created_at?: string
          filled_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          account_id?: string
          asset_id?: string
          order_type?: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT"
          side?: "BUY" | "SELL"
          quantity?: number
          price?: number | null
          stop_price?: number | null
          status?: "PENDING" | "FILLED" | "CANCELLED" | "REJECTED"
          filled_quantity?: number | null
          avg_fill_price?: number | null
          created_at?: string
          filled_at?: string | null
          expires_at?: string | null
        }
      }
      positions: {
        Row: {
          id: string
          account_id: string
          asset_id: string
          side: "LONG" | "SHORT"
          quantity: number
          entry_price: number
          current_price: number | null
          leverage: number | null
          margin_required: number | null
          unrealized_pnl: number | null
          rollover_charges: number | null
          take_profit: number | null
          stop_loss: number | null
          opened_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          asset_id: string
          side: "LONG" | "SHORT"
          quantity: number
          entry_price: number
          current_price?: number | null
          leverage?: number | null
          margin_required?: number | null
          unrealized_pnl?: number | null
          rollover_charges?: number | null
          take_profit?: number | null
          stop_loss?: number | null
          opened_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          asset_id?: string
          side?: "LONG" | "SHORT"
          quantity?: number
          entry_price?: number
          current_price?: number | null
          leverage?: number | null
          margin_required?: number | null
          unrealized_pnl?: number | null
          rollover_charges?: number | null
          take_profit?: number | null
          stop_loss?: number | null
          opened_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name: string | null
          last_name: string | null
          experience_level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null
          created_at: string
          last_login: string | null
          is_verified: boolean | null
          kyc_status: "PENDING" | "APPROVED" | "REJECTED" | null
          preferences: Json | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name?: string | null
          last_name?: string | null
          experience_level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null
          created_at?: string
          last_login?: string | null
          is_verified?: boolean | null
          kyc_status?: "PENDING" | "APPROVED" | "REJECTED" | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string | null
          last_name?: string | null
          experience_level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null
          created_at?: string
          last_login?: string | null
          is_verified?: boolean | null
          kyc_status?: "PENDING" | "APPROVED" | "REJECTED" | null
          preferences?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}