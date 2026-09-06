const html = (script, body = '') => ({
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

const sendToOpener = (message) =>
  `(function(){var m=${message};if(window.opener&&!window.opener.closed){window.opener.postMessage(m,"*");window.close();return;}document.body.insertAdjacentHTML("beforeend","<p style=\\"font-family:system-ui;padding:1rem\\">Logowanie OK. <a href=/admin/>Wróć do panelu</a> i odśwież stronę.</p>");})();`;

export const handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Brak GITHUB_CLIENT_ID lub GITHUB_CLIENT_SECRET w Netlify (Site configuration → Environment variables).',
    };
  }

  const origin = originFromEvent(event);
  const redirectUri = `${origin}/oauth/callback`;
  const params = event.queryStringParameters || {};
  const code = params.code;

  if (code) {
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
        redirect_uri: redirectUri,
      }),
    });

    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      const message = JSON.stringify(
        `authorization:github:error:${data.error_description || data.error || 'token_exchange_failed'}`,
      );
      return html(sendToOpener(message), '<p>Błąd logowania. Okno możesz zamknąć.</p>');
    }

    const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
    const success = JSON.stringify(`authorization:github:success:${payload}`);
    return html(sendToOpener(success));
  }

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('scope', 'repo,user');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  for (const [key, value] of Object.entries(params)) {
    if (value) authUrl.searchParams.set(key, value);
  }

  return html(`window.location.replace(${JSON.stringify(authUrl.toString())});`);
};
