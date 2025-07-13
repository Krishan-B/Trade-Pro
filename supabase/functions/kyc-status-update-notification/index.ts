import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { record } = await req.json()

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(record.user_id)

  if (error) {
    console.error('Error fetching user:', error)
    return new Response(JSON.stringify({ error: 'Error fetching user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const email = user?.user?.email
  if (!email) {
    return new Response(JSON.stringify({ error: 'User email not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const subject = `Your KYC Status has been updated to: ${record.status}`
  const body = `
    <h1>KYC Status Update</h1>
    <p>Hello,</p>
    <p>Your KYC verification status has been updated to <strong>${record.status}</strong>.</p>
    ${record.status === 'rejected' ? `<p>Reason: ${record.rejection_reason}</p>` : ''}
    <p>You can now log in to your account to see the details.</p>
    <p>Thanks,</p>
    <p>The Trade Pro Team</p>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Trade Pro <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: body,
    }),
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})