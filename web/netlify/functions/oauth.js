const html = (script) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8" /></head><body><script>${script}</script></body></html>`,
});

const originFromEvent = (event) => {
  const proto = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers.host;
  return `${proto}://${host}`;
};

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

    if (data.error) {
      const message = JSON.stringify(
        `authorization:github:error:${data.error_description || data.error}`,
      );
      return html(`(function(){var m=${message};if(window.opener){window.opener.postMessage(m,"*");}window.close();})();`);
    }

    const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
    const success = JSON.stringify(`authorization:github:success:${payload}`);
    return html(
      `(function(){var m=${success};if(window.opener){window.opener.postMessage(m,window.location.origin);}window.close();})();`,
    );
  }

  const scope = encodeURIComponent('repo,user');
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return html(`window.location.replace(${JSON.stringify(authUrl)});`);
};
