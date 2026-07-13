export type Profile = {
  id: string;
  subdomain: string;
  display_name: string | null;
  plan: string | null;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  social_url: string | null;
  social_label: string | null;
  venmo: string | null;
  paypal: string | null;
  zelle: string | null;
  created_at?: string | null;
};

export type Master = { id: string; owner: string; name: string; created_at: string };
export type Channel = { id: string; owner: string; master_id: string; name: string; created_at: string };
export type Product = {
  id: string;
  owner: string;
  channel_id: string | null;
  name: string;
  price_cents: number;
  description: string | null;
  photos: string[];
  sold: boolean;
  on_sheet: boolean;
  created_at: string;
};
