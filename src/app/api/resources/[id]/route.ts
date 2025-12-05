import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE handler for deleting user's own resources
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid resource ID format' },
        { status: 400 }
      );
    }

    if (!type || !['material', 'session'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid resource type. Must be "material" or "session"' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const table = type === 'material' ? 'materials' : 'sessions';

    // First, verify the resource belongs to this user
    const { data: resource, error: fetchError } = await supabase
      .from(table)
      .select('id, contributor_id')
      .eq('id', id)
      .single();

    if (fetchError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (resource.contributor_id !== user.id) {
      // Check if user is admin (you can implement admin check here)
      const isAdmin = await checkIsAdmin(supabase, user.id);
      
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'You can only delete your own resources' },
          { status: 403 }
        );
      }
    }

    // Delete the resource
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting resource:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete resource' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully',
    });

  } catch (error) {
    console.error('Unexpected error deleting resource:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET handler for fetching a single resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid resource ID format' },
        { status: 400 }
      );
    }

    if (!type || !['material', 'session'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid resource type' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const table = type === 'material' ? 'materials' : 'sessions';

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Unexpected error fetching resource:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to check if user is admin
async function checkIsAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<boolean> {
  // Check if user has admin role in a separate admin table
  // For now, we'll check against a list of admin emails or a separate table
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) return false;
  
  // You can implement admin check logic here
  // Option 1: Check admin emails from environment variable
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (user.user.email && adminEmails.includes(user.user.email)) {
    return true;
  }
  
  // Option 2: Check an admins table in database
  // const { data: adminRecord } = await supabase
  //   .from('admins')
  //   .select('id')
  //   .eq('user_id', userId)
  //   .single();
  // return !!adminRecord;
  
  return false;
}
