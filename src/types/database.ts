// Gerado a partir do schema do Supabase (generate_typescript_types). Regere após mudar migrations.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type E = Database["public"]["Enums"]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.18" }
  public: {
    Tables: {
      match_participants: {
        Row: {
          id: string
          joined_at: string
          match_id: string
          paid: boolean
          slot: E["slot_kind"]
          status: E["participant_status"]
          team: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          match_id: string
          paid?: boolean
          slot: E["slot_kind"]
          status: E["participant_status"]
          team?: number | null
          updated_at?: string
          user_id: string
        }
        Update: Partial<Database["public"]["Tables"]["match_participants"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "match_participants_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_series: {
        Row: { created_at: string; id: string; organizer_id: string }
        Insert: { created_at?: string; id?: string; organizer_id: string }
        Update: { created_at?: string; id?: string; organizer_id?: string }
        Relationships: [
          {
            foreignKeyName: "match_series_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          address: string
          cancel_reason: string | null
          city: string
          code: string
          court_type: E["court_type"]
          created_at: string
          duration_minutes: number
          field_slots: number
          goalkeeper_slots: number
          id: string
          is_public: boolean
          leave_deadline_hours: number
          level: E["skill_level"] | null
          neighborhood: string
          organizer_id: string
          pix_key: string | null
          price_cents: number
          rules: string | null
          search_text: string | null
          series_id: string | null
          starts_at: string
          status: E["match_status"]
          teams_drawn_at: string | null
          title: string
          updated_at: string
          venue_id: string | null
          venue_name: string
        }
        Insert: {
          address: string
          cancel_reason?: string | null
          city: string
          code?: string
          court_type: E["court_type"]
          created_at?: string
          duration_minutes: number
          field_slots: number
          goalkeeper_slots?: number
          id?: string
          is_public?: boolean
          leave_deadline_hours?: number
          level?: E["skill_level"] | null
          neighborhood: string
          organizer_id: string
          pix_key?: string | null
          price_cents?: number
          rules?: string | null
          series_id?: string | null
          starts_at: string
          status?: E["match_status"]
          teams_drawn_at?: string | null
          title: string
          updated_at?: string
          venue_id?: string | null
          venue_name: string
        }
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "matches_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "match_series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: E["notification_kind"]
          match_id: string | null
          read_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind: E["notification_kind"]
          match_id?: string | null
          read_at?: string | null
          user_id: string
        }
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "notifications_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_private: {
        Row: { phone: string | null; updated_at: string; user_id: string }
        Insert: { phone?: string | null; updated_at?: string; user_id: string }
        Update: { phone?: string | null; updated_at?: string; user_id?: string }
        Relationships: [
          {
            foreignKeyName: "profile_private_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string
          created_at: string
          full_name: string
          id: string
          level: E["skill_level"]
          nickname: string
          position: E["position_pref"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string
          created_at?: string
          full_name: string
          id: string
          level?: E["skill_level"]
          nickname: string
          position?: E["position_pref"]
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          city: string
          created_at: string
          id: string
          name: string
          neighborhood: string
          owner_id: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          id?: string
          name: string
          neighborhood: string
          owner_id: string
        }
        Update: Partial<Database["public"]["Tables"]["venues"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "venues_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      cancel_match: { Args: { p_match: string; p_reason?: string }; Returns: undefined }
      get_match: { Args: { p_code: string }; Returns: Json }
      explore_matches: {
        Args: {
          p_city: string
          p_from: string
          p_to?: string
          p_neighborhood?: string
          p_courts?: E["court_type"][]
          p_level?: E["skill_level"]
          p_max_price?: number
          p_need_goalkeeper?: boolean
          p_q?: string
          p_limit?: number
        }
        Returns: {
          code: string
          title: string
          court_type: E["court_type"]
          venue_name: string
          neighborhood: string
          city: string
          starts_at: string
          duration_minutes: number
          field_slots: number
          goalkeeper_slots: number
          price_cents: number
          level: E["skill_level"] | null
          linha: number
          goleiro: number
          espera: number
        }[]
      }
      join_match: { Args: { p_code: string; p_slot?: E["slot_kind"] }; Returns: E["participant_status"] }
      leave_match: { Args: { p_code: string }; Returns: undefined }
      remove_participant: { Args: { p_match: string; p_user: string }; Returns: undefined }
      save_teams: { Args: { p_assign: Json; p_match: string }; Returns: undefined }
      set_paid: { Args: { p_match: string; p_paid: boolean; p_user: string }; Returns: undefined }
    }
    Enums: {
      court_type: "society" | "futsal" | "campo" | "areia"
      match_status: "aberta" | "cancelada"
      notification_kind: "promovido" | "cancelada" | "alterada" | "removido"
      participant_status: "confirmado" | "espera" | "saiu" | "removido"
      position_pref: "goleiro" | "zagueiro" | "meio" | "atacante" | "tanto_faz"
      skill_level: "iniciante" | "intermediario" | "avancado"
      slot_kind: "linha" | "goleiro"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]
