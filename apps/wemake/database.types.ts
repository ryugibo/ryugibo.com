export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  wemake: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: never
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: never
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: Database["wemake"]["Enums"]["event_type"]
          id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: Database["wemake"]["Enums"]["event_type"]
          id?: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: Database["wemake"]["Enums"]["event_type"]
          id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string | null
          following_id: string | null
        }
        Insert: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
        }
        Update: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_profiles_id_fk"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_profiles_id_fk"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_likes: {
        Row: {
          idea_id: number
          profile_id: string
        }
        Insert: {
          idea_id: number
          profile_id: string
        }
        Update: {
          idea_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_likes_idea_id_ideas_id_fk"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_likes_idea_id_ideas_id_fk"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_likes_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          id: number
          idea: string
          views: number
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          id?: never
          idea: string
          views?: number
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          id?: never
          idea?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "ideas_claimed_by_profiles_id_fk"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          apply_url: string
          benefits: string
          company_location: string
          company_logo: string
          company_name: string
          created_at: string
          id: number
          job_type: Database["wemake"]["Enums"]["job_type"]
          location: Database["wemake"]["Enums"]["location"]
          overview: string
          position: string
          qualifications: string
          responsibilities: string
          salary_range: Database["wemake"]["Enums"]["salary_range"]
          skills: string
          updated_at: string
        }
        Insert: {
          apply_url: string
          benefits: string
          company_location: string
          company_logo: string
          company_name: string
          created_at?: string
          id?: never
          job_type: Database["wemake"]["Enums"]["job_type"]
          location: Database["wemake"]["Enums"]["location"]
          overview: string
          position: string
          qualifications: string
          responsibilities: string
          salary_range: Database["wemake"]["Enums"]["salary_range"]
          skills: string
          updated_at?: string
        }
        Update: {
          apply_url?: string
          benefits?: string
          company_location?: string
          company_logo?: string
          company_name?: string
          created_at?: string
          id?: never
          job_type?: Database["wemake"]["Enums"]["job_type"]
          location?: Database["wemake"]["Enums"]["location"]
          overview?: string
          position?: string
          qualifications?: string
          responsibilities?: string
          salary_range?: Database["wemake"]["Enums"]["salary_range"]
          skills?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_room_members: {
        Row: {
          created_at: string
          message_room_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          message_room_id: number
          profile_id: string
        }
        Update: {
          created_at?: string
          message_room_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_room_members_message_room_id_message_rooms_id_fk"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_rooms: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: never
        }
        Update: {
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: number
          message_room_id: number
          profile_id: string
          seen: boolean
        }
        Insert: {
          content: string
          created_at?: string
          id?: never
          message_room_id: number
          profile_id: string
          seen?: boolean
        }
        Update: {
          content?: string
          created_at?: string
          id?: never
          message_room_id?: number
          profile_id?: string
          seen?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_message_room_id_message_rooms_id_fk"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          post_id: number | null
          product_id: number | null
          source_id: string | null
          target_id: string
          type: Database["wemake"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string
          id: string
          post_id?: number | null
          product_id?: number | null
          source_id?: string | null
          target_id: string
          type: Database["wemake"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: number | null
          product_id?: number | null
          source_id?: string | null
          target_id?: string
          type?: Database["wemake"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_detail_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_list_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_overview_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_source_id_profiles_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_target_id_profiles_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_replies: {
        Row: {
          content: string
          created_at: string
          id: number
          parent_id: number | null
          post_id: number | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: never
          parent_id?: number | null
          post_id?: number | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: never
          parent_id?: number | null
          post_id?: number | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_replies_parent_id_post_replies_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_replies_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_detail_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_replies_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_list_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_replies_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_replies_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_upvotes: {
        Row: {
          post_id: number
          profile_id: string
        }
        Insert: {
          post_id: number
          profile_id: string
        }
        Update: {
          post_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_upvotes_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_detail_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_upvotes_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_post_list_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_upvotes_post_id_posts_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_upvotes_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: number
          profile_id: string | null
          title: string
          topic_id: number
          updated_at: string
          upvotes: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: never
          profile_id?: string | null
          title: string
          topic_id: number
          updated_at?: string
          upvotes?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: never
          profile_id?: string | null
          title?: string
          topic_id?: number
          updated_at?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_topic_id_topics_id_fk"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      product_upvotes: {
        Row: {
          created_at: string
          product_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          product_id: number
          profile_id: string
        }
        Update: {
          created_at?: string
          product_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_upvotes_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_overview_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_upvotes_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_upvotes_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string
          description: string
          how_it_works: string
          icon: string
          id: number
          name: string
          profile_id: string
          stats: Json
          tagline: string
          updated_at: string
          url: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description: string
          how_it_works: string
          icon: string
          id?: never
          name: string
          profile_id: string
          stats?: Json
          tagline: string
          updated_at?: string
          url: string
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string
          how_it_works?: string
          icon?: string
          id?: never
          name?: string
          profile_id?: string
          stats?: Json
          tagline?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_categories_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          headline: string | null
          id: string
          name: string
          role: Database["wemake"]["Enums"]["role"]
          stats: Json | null
          updated_at: string
          username: string
          views: Json | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          headline?: string | null
          id: string
          name: string
          role?: Database["wemake"]["Enums"]["role"]
          stats?: Json | null
          updated_at?: string
          username: string
          views?: Json | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          name?: string
          role?: Database["wemake"]["Enums"]["role"]
          stats?: Json | null
          updated_at?: string
          username?: string
          views?: Json | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: number
          product_id: number
          profile_id: string
          rating: number
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: never
          product_id: number
          profile_id: string
          rating: number
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: never
          product_id?: number
          profile_id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_overview_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          equity_split: number
          id: number
          product_description: string
          product_name: string
          product_stage: Database["wemake"]["Enums"]["product_stage"]
          roles: string
          team_leader_id: string
          team_size: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          equity_split: number
          id?: never
          product_description: string
          product_name: string
          product_stage: Database["wemake"]["Enums"]["product_stage"]
          roles: string
          team_leader_id: string
          team_size: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          equity_split?: number
          id?: never
          product_description?: string
          product_name?: string
          product_stage?: Database["wemake"]["Enums"]["product_stage"]
          roles?: string
          team_leader_id?: string
          team_size?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_team_leader_id_profiles_id_fk"
            columns: ["team_leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      community_post_detail_view: {
        Row: {
          author_avatar: string | null
          author_created_at: string | null
          author_name: string | null
          author_products: number | null
          author_role: Database["wemake"]["Enums"]["role"] | null
          content: string | null
          created_at: string | null
          id: number | null
          replies: number | null
          title: string | null
          topic_name: string | null
          topic_slug: string | null
          upvotes: number | null
        }
        Relationships: []
      }
      community_post_list_view: {
        Row: {
          author: string | null
          author_avatar: string | null
          author_username: string | null
          created_at: string | null
          id: number | null
          title: string | null
          topic: string | null
          topic_slug: string | null
          upvotes: number | null
        }
        Relationships: []
      }
      ideas_view: {
        Row: {
          created_at: string | null
          id: number | null
          idea: string | null
          is_claimed: boolean | null
          likes: number | null
          views: number | null
        }
        Relationships: []
      }
      product_overview_view: {
        Row: {
          average_rating: number | null
          description: string | null
          how_it_works: string | null
          icon: string | null
          id: number | null
          name: string | null
          reviews: string | null
          tagline: string | null
          upvotes: string | null
          url: string | null
          views: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      track_event: {
        Args: {
          event_data: Json
          event_type: Database["wemake"]["Enums"]["event_type"]
        }
        Returns: undefined
      }
    }
    Enums: {
      event_type: "product_view" | "product_visit" | "profile_view"
      job_type:
        | "full-time"
        | "part-time"
        | "contract"
        | "internship"
        | "freelance"
      location: "remote" | "in-person" | "hybrid"
      notification_type: "follow" | "review" | "reply" | "mention"
      product_stage: "idea" | "prototype" | "mvp" | "production"
      role:
        | "developer"
        | "designer"
        | "marketer"
        | "founder"
        | "product-manager"
      salary_range:
        | "$0 - $50,000"
        | "$50,000 - $70,000"
        | "$70,000 - $100,000"
        | "$100,000 - $120,000"
        | "$120,000 - $150,000"
        | "$150,000 - $250,000"
        | "$250,000+"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  wemake: {
    Enums: {
      event_type: ["product_view", "product_visit", "profile_view"],
      job_type: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
      ],
      location: ["remote", "in-person", "hybrid"],
      notification_type: ["follow", "review", "reply", "mention"],
      product_stage: ["idea", "prototype", "mvp", "production"],
      role: ["developer", "designer", "marketer", "founder", "product-manager"],
      salary_range: [
        "$0 - $50,000",
        "$50,000 - $70,000",
        "$70,000 - $100,000",
        "$100,000 - $120,000",
        "$120,000 - $150,000",
        "$150,000 - $250,000",
        "$250,000+",
      ],
    },
  },
} as const
