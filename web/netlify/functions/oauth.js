const html = (script, body = '<p>Logowanie…</p>') => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8" /><title>Logowanie CMS</title></head><body>${body}<script>${script}</script></body></html>`,
});

const originFromEvent = (event) => {
  const proto = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers.host;
  return `${proto}://${host}`;
};

const callbackScript = (status, token) => `
const receiveMessage = () => {
  window.opener.postMessage(
    'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify({ token }))},
    '*'
  );
  window.removeEventListener('message', receiveMessage, false);
  window.close();
};
window.addEventListener('message', receiveMessage, false);
window.opener.postMessage('authorizing:github', '*');
`;

export const handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Brak GITHUB_CLIENT_ID lub GITHUB_CLIENT_SECRET w Netlify.',
    };
  }

  const origin = originFromEvent(event);
  const path = event.path || '';
  const params = event.queryStringParameters || {};
  const code = params.code;
  const isCallback = path.includes('callback') || Boolean(code);

  const callbackUri = `${origin}/oauth/callback`;

  if (isCallback && code) {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'zhr-6odh-cms-oauth',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUri,
      }),
    });

    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      const err = JSON.stringify({
        message: data.error_description || data.error || 'token_exchange_failed',
      });
      return html(`
window.opener.postMessage('authorization:github:error:' + ${JSON.stringify(err)}, '*');
window.close();
`, '<p>Błąd logowania. Zamknij okno i spróbuj ponownie.</p>');
    }

    return html(callbackScript('success', data.access_token), '<p>Logowanie OK…</p>');
  }

  if (params.provider && params.provider !== 'github') {
    return { statusCode: 400, body: 'Invalid provider' };
  }

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('scope', 'repo,user');
  authUrl.searchParams.set('redirect_uri', callbackUri);
  if (params.state) authUrl.searchParams.set('state', params.state);

  return {
    statusCode: 302,
    headers: { Location: authUrl.toString(), 'Cache-Control': 'no-store' },
    body: '',
  };
};
