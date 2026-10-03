import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

export function useRequireAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);

  const reloadStructure = useCallback(async () => {
    const res = await fetch('/api/structure');
    if (res.ok) {
      const data = await res.json();
      setStructure(data.structure);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          router.replace('/login');
          return;
        }
        const meData = await meRes.json();
        if (cancelled) return;
        setUser(meData.user);

        const structRes = await fetch('/api/structure');
        if (structRes.ok) {
          const structData = await structRes.json();
          if (!cancelled) setStructure(structData.structure);
        }
      } catch (e) {
        router.replace('/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [router]);

  return { user, structure, setStructure, reloadStructure, loading };
}
