// 관리자 화면이 다루는 데이터 모양. 지금은 lib/mock.ts 가 채우고, 나중에 백엔드 API 응답으로 바꾼다.

export type Category = {
  id: number;
  name: string; // 화면에 보이는 이름 (예: 커피)
  engName: string; // 영문 이름 (예: Coffee)
  sortOrder: number; // 사용자 화면의 카테고리 탭 순서. 작을수록 앞
  visible: boolean; // false 면 사용자 화면에서 숨김
  createdAt: string;
};

export type MenuStatus = "on" | "soldout" | "hidden";

export type Menu = {
  id: number;
  korName: string;
  engName: string;
  categoryId: number;
  price: number;
  description: string;
  image: string | null; // public/ 아래 경로. 없으면 null
  status: MenuStatus;
  isNew: boolean; // 사용자 화면에 NEW 표시
  createdAt: string;
  updatedAt: string;
};
