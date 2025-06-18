export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      missing_persons: {
        Row: {
          age: number
          created_at: string | null
          gender: Database["public"]["Enums"]["person_gender"]
          health_conditions: string | null
          id: string
          last_seen_lat: number | null
          last_seen_lng: number | null
          last_seen_location: string
          name: string
          photo_url: string | null
          reporter_id: string
          status: Database["public"]["Enums"]["person_status"] | null
          updated_at: string | null
        }
        Insert: {
          age: number
          created_at?: string | null
          gender: Database["public"]["Enums"]["person_gender"]
          health_conditions?: string | null
          id?: string
          last_seen_lat?: number | null
          last_seen_lng?: number | null
          last_seen_location: string
          name: string
          photo_url?: string | null
          reporter_id: string
          status?: Database["public"]["Enums"]["person_status"] | null
          updated_at?: string | null
        }
        Update: {
          age?: number
          created_at?: string | null
          gender?: Database["public"]["Enums"]["person_gender"]
          health_conditions?: string | null
          id?: string
          last_seen_lat?: number | null
          last_seen_lng?: number | null
          last_seen_location?: string
          name?: string
          photo_url?: string | null
          reporter_id?: string
          status?: Database["public"]["Enums"]["person_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "missing_persons_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_attempts: {
        Row: {
          action: string | null
          confidence: number | null
          estimated_age: number | null
          found_location: string | null
          found_person_name: string | null
          found_time: string | null
          id: string
          matched_person_id: string | null
          police_id: string
          scan_image_url: string
          timestamp: string | null
        }
        Insert: {
          action?: string | null
          confidence?: number | null
          estimated_age?: number | null
          found_location?: string | null
          found_person_name?: string | null
          found_time?: string | null
          id?: string
          matched_person_id?: string | null
          police_id: string
          scan_image_url: string
          timestamp?: string | null
        }
        Update: {
          action?: string | null
          confidence?: number | null
          estimated_age?: number | null
          found_location?: string | null
          found_person_name?: string | null
          found_time?: string | null
          id?: string
          matched_person_id?: string | null
          police_id?: string
          scan_image_url?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_attempts_matched_person_id_fkey"
            columns: ["matched_person_id"]
            isOneToOne: false
            referencedRelation: "missing_persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_attempts_police_id_fkey"
            columns: ["police_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      person_gender: "male" | "female" | "other"
      person_status: "missing" | "found"
      user_role: "relative" | "police"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      person_gender: ["male", "female", "other"],
      person_status: ["missing", "found"],
      user_role: ["relative", "police"],
    },
  },
} as const
