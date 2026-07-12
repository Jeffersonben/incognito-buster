import { useCallback, useEffect, useState } from 'react';

const INITIAL_MESSAGE = 'Checking whether this browser has a saved demo record...';

async function readJsonResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'The request failed.');
  }
  return data;
}

export function useDemo() {
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [record, setRecord] = useState(null);
  const [found, setFound] = useState(false);
  const [message, setMessage] = useState(INITIAL_MESSAGE);
  const [loading, setLoading] = useState(false);

  const checkRecord = useCallback(async () => {
    setLoading(true);
    setMessage('Checking the server for a saved demo record...');
    try {
      const data = await readJsonResponse(await fetch('/api/whoami', { cache: 'no-store' }));
      if (data.found) {
        setFound(true);
        setRecord(data.record);
        setMessage('A saved demo record was found on the server.');
      } else {
        setFound(false);
        setRecord(null);
        setMessage(data.message || 'No saved demo record found yet.');
      }
    } catch (error) {
      setMessage(error.message || 'Could not check the demo record.');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveName = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('Saving your demo name on the server...');
    try {
      const data = await readJsonResponse(await fetch('/api/save-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, consent })
      }));
      setRecord(data.record);
      setFound(true);
      setMessage('Saved. Now open this same website URL in a private/incognito tab.');
    } catch (error) {
      setMessage(error.message || 'Could not save the demo identity.');
    } finally {
      setLoading(false);
    }
  }, [name, consent]);

  const deleteRecord = useCallback(async () => {
    setLoading(true);
    setMessage('Deleting the demo record...');
    try {
      await readJsonResponse(await fetch('/api/delete-demo', { method: 'POST' }));
      setRecord(null);
      setFound(false);
      setMessage('Deleted. The site should no longer recognize this demo record.');
    } catch (error) {
      setMessage(error.message || 'Could not delete the demo record.');
    } finally {
      setLoading(false);
    }
  }, []);

  const copyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setMessage('Site URL copied. Open a private/incognito window and paste it there.');
    } catch {
      setMessage('Could not copy automatically. Please copy the site URL from your browser address bar.');
    }
  }, []);

  useEffect(() => {
    checkRecord();
  }, [checkRecord]);

  return {
    name,
    setName,
    consent,
    setConsent,
    record,
    found,
    message,
    loading,
    checkRecord,
    saveName,
    deleteRecord,
    copyUrl
  };
}
