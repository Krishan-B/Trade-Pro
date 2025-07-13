import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/utils";

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    global: { headers: { Authorization: req.headers.get('Authorization')! } },
  });

  const { url, method } = req;
  const { pathname, searchParams } = new URL(url);
  const pathParts = pathname.split('/');
  const endpoint = pathParts[pathParts.length - 1];

  try {
    switch (endpoint) {
      case 'courses':
        switch (method) {
          case 'GET': {
            const { data, error } = await supabaseClient.from('courses').select('*');
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
          }
          case 'POST': {
            const course = await req.json();
            const { data, error } = await supabaseClient.from('courses').insert(course).select();
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 });
          }
          case 'PUT': {
            const course = await req.json();
            const { data, error } = await supabaseClient.from('courses').update(course).eq('id', course.id).select();
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
          }
          case 'DELETE': {
            const { id } = await req.json();
            const { error } = await supabaseClient.from('courses').delete().eq('id', id);
            if (error) throw error;
            return new Response(null, { headers: { ...corsHeaders }, status: 204 });
          }
          default:
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 });
        }
      case 'lessons':
        switch (method) {
          case 'GET': {
            const courseId = searchParams.get('course_id');
            if (!courseId) {
              return new Response(JSON.stringify({ error: 'course_id query parameter is required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
            }
            const { data, error } = await supabaseClient.from('lessons').select('*').eq('course_id', courseId);
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
          }
          case 'POST': {
            const lesson = await req.json();
            const { data, error } = await supabaseClient.from('lessons').insert(lesson).select();
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 });
          }
          case 'PUT': {
            const lesson = await req.json();
            const { data, error } = await supabaseClient.from('lessons').update(lesson).eq('id', lesson.id).select();
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
          }
          case 'DELETE': {
            const { id } = await req.json();
            const { error } = await supabaseClient.from('lessons').delete().eq('id', id);
            if (error) throw error;
            return new Response(null, { headers: { ...corsHeaders }, status: 204 });
          }
          default:
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 });
        }
      default:
        return new Response(JSON.stringify({ error: 'Not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        });
    }
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}