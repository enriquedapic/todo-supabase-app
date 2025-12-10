// app/api/webhook/route.ts

import { NextResponse } from 'next/server';
// 
import { supabase } from '@/lib/supabase'; // 

// 
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 
    const { title, user_email } = body; 

    if (!title || !user_email) {
      return NextResponse.json(
        { error: 'Missing required fields: title and user_email' }, 
        { status: 400 }
      );
    }

    // 
    const { error } = await supabase
      .from('tasks') // 
      .insert([
        { title: title, user_email: user_email, is_completed: false }
      ]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ error: 'Database insertion failed' }, { status: 500 });
    }

    // 
    return NextResponse.json({ status: 'success', message: 'Task added successfully' }, { status: 200 });

  } catch (error) {
    console.error('API execution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 
export async function GET() {
  return NextResponse.json({ message: 'GET method not supported for this endpoint' }, { status: 405 });
}