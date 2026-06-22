import { supabase } from './supabase'

export interface UserSubscription {
  user_id: string
  status: 'free' | 'active' | 'cancelled'
  plan: 'freemium' | 'premium'
  lemon_squeezy_order_id?: string
  created_at: string
  updated_at: string
  renewal_date?: string
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      return null
    }

    if (error) throw error
    return data as UserSubscription
  } catch (err) {
    console.error('Error fetching subscription:', err)
    return null
  }
}

export async function createOrUpdateSubscription(
  userId: string,
  plan: 'freemium' | 'premium',
  status: 'free' | 'active' | 'cancelled',
  lemonOrderId?: string
): Promise<UserSubscription | null> {
  try {
    const existing = await getUserSubscription(userId)

    if (existing) {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          plan,
          status,
          lemon_squeezy_order_id: lemonOrderId,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data as UserSubscription
    } else {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan,
          status,
          lemon_squeezy_order_id: lemonOrderId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data as UserSubscription
    }
  } catch (err) {
    console.error('Error creating/updating subscription:', err)
    return null
  }
}

export async function isPremiumUser(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)
  return subscription?.plan === 'premium' && subscription?.status === 'active'
}
