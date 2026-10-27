// 브라우저에서 백엔드로 보내는 요청. 주소는 /api/v1/... 그대로 쓰고,
// next.config 의 rewrites 가 백엔드(기본 localhost:8080)로 넘긴다.
// 실패하면 백엔드가 보낸 {"message": "..."} 를 담아 에러로 던진다.
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? `요청을 처리하지 못했어요. (${res.status})`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

// 등록·수정·삭제
export function apiSend<T = unknown>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  return request<T>(method, path, body);
}

// 화면에서 고른 값으로 다시 받는 조회 (예: 감정 추천). 처음 그리는 데이터는 서버 컴포넌트에서 받는다
export function apiGet<T>(path: string): Promise<T> {
  return request<T>("GET", path);
}
