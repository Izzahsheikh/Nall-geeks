export async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('The admin server returned an unexpected response. Check the server connection and try again.');
  }

  const payload = await response.json().catch(() => {
    throw new Error('The admin server returned an invalid response. Try again.');
  });

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

export const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  if (!file) {
    resolve('');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Could not read image file'));
  reader.readAsDataURL(file);
});
