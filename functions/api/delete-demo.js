export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    if (!env.PRIVACY_DEMO_KV) {
      return Response.json({ ok: false, error: 'Missing KV binding: PRIVACY_DEMO_KV' }, { status: 500 });
    }
    const body = await request.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return Response.json({ ok: false, error: 'Demo ID is required.' }, { status: 400 });
    }
    await env.PRIVACY_DEMO_KV.delete(`demo:${id}`);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ ok: false, error: 'Could not delete demo record.' }, { status: 500 });
  }
}
