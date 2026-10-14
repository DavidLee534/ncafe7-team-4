// 브라우저(localStorage)에 저장하는 작은 저장소. 여러 컴포넌트가 같은 값을 보고, 다른 탭에서 바꿔도 따라간다.
// 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서는 처음 값으로 시작하고, 이번 화면에서만 유지한다.
import { useSyncExternalStore } from "react";

export function createLocalStore<T>(storageKey: string, initial: T) {
  let value = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded) return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(storageKey);
      value = raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      value = initial;
    }
  }

  function get(): T {
    load();
    return value;
  }

  function set(next: T) {
    value = next;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // 저장에 실패해도 이번 화면에서는 그대로 쓴다
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      loaded = false;
      load();
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  // 서버에서 그릴 때는 브라우저 저장소를 알 수 없어서 null. 화면은 null 이면 아직 불러오는 중으로 본다.
  function useValue(): T | null {
    return useSyncExternalStore(subscribe, get, () => null);
  }

  return { get, set, useValue };
}
