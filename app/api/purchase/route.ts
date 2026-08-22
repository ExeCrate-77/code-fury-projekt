import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { buyerId, modelId } = await req.json();
    const generatedKey = `mh_${crypto.randomBytes(16).toString('hex')}`;

    const { data, error } = await supabase
      .from('purchases')
      .insert([{ buyer_id: buyerId, model_id: modelId, api_key: generatedKey }])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, apiKey: generatedKey, purchase: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}