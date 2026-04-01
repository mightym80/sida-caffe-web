import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Category {
  id: string
  name: string
  image: string
  display_order: number
  active: boolean
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  image: string
  description: string
  display_order: number
  active: boolean
  created_at: string
}

export interface OrderItem {
  product_name: string
  quantity: number
}

export interface Order {
  id: string
  customer_name: string
  customer_surname: string
  customer_address: string
  customer_phone: string
  customer_town: string
  items: OrderItem[]
  total_items: number
  order_type: string
  notes: string
  status: string
  created_at: string
  delivered_at: string | null
}

export interface Promotion {
  id: string
  title: string
  description: string
  image: string
  active: boolean
  created_at: string
}
