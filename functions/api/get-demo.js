export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    if (!env.PRIVACY_DEMO_KV) {
      return Response.json({ ok: false, error: 'Missing KV binding: PRIVACY_DEMO_KV' }, { status: 500 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return Response.json({ ok: false, error: 'Demo ID is required.' }, { status: 400 });
    }

    const value = await env.PRIVACY_DEMO_KV.get(`demo:${id}`);
    if (!value) {
      return Response.json({ ok: false, error: 'Demo record not found or expired.' }, { status: 404 });
    }

    return Response.json({ ok: true, record: JSON.parse(value) });
  } catch (error) {
    return Response.json({ ok: false, error: 'Could not load demo record.' }, { status: 500 });
  }
}
