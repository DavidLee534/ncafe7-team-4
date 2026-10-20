// 브라우저에서 백엔드로 보내는 요청(등록·수정·삭제). 주소는 /api/v1/... 그대로 쓰고,
// next.config 의 rewrites 가 백엔드(기본 localhost:8080)로 넘긴다.
// 실패하면 백엔드가 보낸 {"message": "..."} 를 담아 에러로 던진다.
export async function apiSend<T = unknown>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
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
