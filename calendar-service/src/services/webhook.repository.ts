import { supabase } from '../config/supabase.js';

export interface WebhookChannelData {
  webhook_channel_id: string;
  webhook_resource_id: string;
  webhook_expiration: number;
}

export interface EmployeeWebhookRecord {
  id: number;
  employee_email: string;
  refresh_token: string;
  webhook_channel_id: string | null;
  webhook_resource_id: string | null;
  webhook_expiration: number | null;
  sync_token: string | null;
}

export async function saveWebhookChannel(
  employee_id: number,
  channelData: WebhookChannelData
): Promise<void> {
  const { error } = await supabase
    .from('Employee_token')
    .update({
      webhook_channel_id: channelData.webhook_channel_id,
      webhook_resource_id: channelData.webhook_resource_id,
      webhook_expiration: channelData.webhook_expiration,
      updated_at: new Date().toISOString(),
    })
    .eq('id', employee_id);

  if (error) {
    throw new Error(`Failed to save webhook channel: ${error.message}`);
  }
}

export async function saveSyncToken(
  employee_id: number,
  syncToken: string
): Promise<void> {
  const { error } = await supabase
    .from('Employee_token')
    .update({
      sync_token: syncToken,
      updated_at: new Date().toISOString(),
    })
    .eq('id', employee_id);

  if (error) {
    throw new Error(`Failed to save sync token: ${error.message}`);
  }
}

export async function getEmployeeByChannelId(
  channelId: string
): Promise<EmployeeWebhookRecord | null> {
  const { data, error } = await supabase
    .from('Employee_token')
    .select('id, employee_email, refresh_token, webhook_channel_id, webhook_resource_id, webhook_expiration, sync_token')
    .eq('webhook_channel_id', channelId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getExpiringChannels(
  thresholdMs: number
): Promise<EmployeeWebhookRecord[]> {
  const { data, error } = await supabase
    .from('Employee_token')
    .select('id, employee_email, refresh_token, webhook_channel_id, webhook_resource_id, webhook_expiration, sync_token')
    .eq('status', 'ACTIVE')
    .not('webhook_channel_id', 'is', null)
    .lt('webhook_expiration', thresholdMs);

  if (error) {
    throw new Error(`Failed to fetch expiring channels: ${error.message}`);
  }

  return data ?? [];
}