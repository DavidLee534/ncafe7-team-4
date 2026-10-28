-- 테스트용 시작 데이터 (H2 인메모리 DB 전용)
-- spring.sql.init.mode 기본값(embedded) 이라 H2 같은 내장 DB 에서만 실행된다. PostgreSQL(로컬·클라우드)에는 넣지 않는다
-- 테이블을 만든 뒤 실행되도록 application.yml 에 spring.jpa.defer-datasource-initialization: true 가 있다
-- id 는 직접 넣지 않고(자동 증가가 꼬이지 않게) 이름·slug·주문번호로 찾아 잇는다
-- 메뉴 30종은 frontend/app/menu/_components/alchemyMenus.ts 와 같은 값이다

-- ===== 회원 =====
-- 비밀번호는 모두 ncafe1234 (BCrypt 해시). admin@ncafe.dev 가 관리자, tofu@ncafe.dev 는 정지 회원이라 로그인 거부
insert into members (email, password, nickname, role, status, created_at, updated_at) values
  ('moka@ncafe.dev',  '$2a$10$pbHdBG3BbvKl4.UeRAyydOlzuMoLkcPEoL8xVcN/hXaQGP.zaCLe.', '모카손님',  'member', 'active',    current_timestamp, current_timestamp),
  ('admin@ncafe.dev', '$2a$10$pbHdBG3BbvKl4.UeRAyydOlzuMoLkcPEoL8xVcN/hXaQGP.zaCLe.', '모카점장',  'admin',  'active',    current_timestamp, current_timestamp),
  ('cheese@ncafe.dev','$2a$10$pbHdBG3BbvKl4.UeRAyydOlzuMoLkcPEoL8xVcN/hXaQGP.zaCLe.', '치즈손님',  'member', 'active',    current_timestamp, current_timestamp),
  ('tofu@ncafe.dev',  '$2a$10$pbHdBG3BbvKl4.UeRAyydOlzuMoLkcPEoL8xVcN/hXaQGP.zaCLe.', '두부손님',  'member', 'suspended', current_timestamp, current_timestamp);

-- ===== 카테고리 (8개 계열) =====
insert into categories (name, eng_name, sort_order, visible, created_at, updated_at) values
  ('커피',     'Coffee',      1, true, current_timestamp, current_timestamp),
  ('논커피',   'Non-Coffee',  2, true, current_timestamp, current_timestamp),
  ('과일라떼', 'Fruit Latte', 3, true, current_timestamp, current_timestamp),
  ('티',       'Tea',         4, true, current_timestamp, current_timestamp),
  ('스무디',   'Smoothie',    5, true, current_timestamp, current_timestamp),
  ('프라페',   'Frappe',      6, true, current_timestamp, current_timestamp),
  ('디저트',   'Dessert',     7, true, current_timestamp, current_timestamp),
  ('푸드',     'Food',        8, true, current_timestamp, current_timestamp);

-- ===== 메뉴 30종 =====
-- 상태: 곡물 라떼는 품절(soldout), 카라멜 프라페는 숨김(hidden). 사장 추천 4개
insert into menus (kor_name, eng_name, price, category_id, status, owner_recommended, popular, description, image_url, slug, emotion_tags, taste_tags, created_at, updated_at) values
  ('다크 로스트 커피',   'Dark Roast Coffee',        4000, (select id from categories where name = '커피'),     'on',      true,  false, '진하게 볶은 원두로 내려 쌉싸름하고 묵직해요.',                 '/images/menus/basic/01.svg', 'dark-roast-coffee',        '피곤함',      '쌉싸름한,따뜻한',        current_timestamp, current_timestamp),
  ('라이트 로스트 커피', 'Light Roast Coffee',       4000, (select id from categories where name = '커피'),     'on',      false, false, '가볍게 볶아 산뜻한 산미와 꽃향이 나요.',                       '/images/menus/basic/02.svg', 'light-roast-coffee',       '피곤함,설렘', '상큼한,쌉싸름한',        current_timestamp, current_timestamp),
  ('디카페인 커피',      'Decaf Coffee',             4300, (select id from categories where name = '커피'),     'on',      false, false, '카페인을 뺀 원두로 부드럽고 고소해요.',                        '/images/menus/basic/03.svg', 'decaf-coffee',             '긴장됨',      '쌉싸름한,따뜻한',        current_timestamp, current_timestamp),
  ('초코 라떼',          'Chocolate Latte',          5000, (select id from categories where name = '논커피'),   'on',      false, false, '진한 초콜릿에 따뜻한 우유를 더했어요.',                        '/images/menus/basic/04.svg', 'chocolate-latte',          '울적함',      '달콤한,따뜻한',          current_timestamp, current_timestamp),
  ('말차 라떼',          'Matcha Latte',             5000, (select id from categories where name = '논커피'),   'on',      false, false, '쌉싸름한 말차와 우유가 부드럽게 어우러져요.',                  '/images/menus/basic/05.svg', 'matcha-latte',             '긴장됨',      '쌉싸름한,고소한',        current_timestamp, current_timestamp),
  ('고구마 라떼',        'Sweet Potato Latte',       5000, (select id from categories where name = '논커피'),   'on',      false, false, '군고구마처럼 달콤하고 포근한 라떼예요.',                       '/images/menus/basic/06.svg', 'sweet-potato-latte',       '그리움',      '고소한,달콤한,따뜻한',   current_timestamp, current_timestamp),
  ('곡물 라떼',          'Grain Latte',              5000, (select id from categories where name = '논커피'),   'soldout', false, false, '미숫가루처럼 고소하고 든든한 라떼예요.',                       '/images/menus/basic/07.svg', 'grain-latte',              '그리움',      '고소한,따뜻한',          current_timestamp, current_timestamp),
  ('딸기 라떼',          'Strawberry Latte',         5500, (select id from categories where name = '과일라떼'), 'on',      true,  false, '딸기청과 우유로 만든 새콤달콤한 라떼예요.',                    '/images/menus/basic/08.svg', 'strawberry-latte',         '설렘',        '달콤한,시원한',          current_timestamp, current_timestamp),
  ('블루베리 라떼',      'Blueberry Latte',          5500, (select id from categories where name = '과일라떼'), 'on',      false, false, '블루베리청과 우유가 상큼하게 어울려요.',                       '/images/menus/basic/09.svg', 'blueberry-latte',          '설렘,울적함', '상큼한,달콤한',          current_timestamp, current_timestamp),
  ('망고 라떼',          'Mango Latte',              5500, (select id from categories where name = '과일라떼'), 'on',      false, false, '진한 망고청과 우유로 달콤하고 부드러워요.',                    '/images/menus/basic/10.svg', 'mango-latte',              '열정',        '달콤한,시원한',          current_timestamp, current_timestamp),
  ('얼그레이 티',        'Earl Grey Tea',            4500, (select id from categories where name = '티'),       'on',      false, false, '베르가못 향이 은은한 홍차예요.',                               '/images/menus/basic/11.svg', 'earl-grey-tea',            '그리움',      '쌉싸름한,따뜻한',        current_timestamp, current_timestamp),
  ('캐모마일 티',        'Chamomile Tea',            4500, (select id from categories where name = '티'),       'on',      true,  false, '사과향이 나는 캐모마일로 마음이 편안해져요.',                  '/images/menus/basic/12.svg', 'chamomile-tea',            '긴장됨,피곤함', '따뜻한',              current_timestamp, current_timestamp),
  ('히비스커스 티',      'Hibiscus Tea',             4500, (select id from categories where name = '티'),       'on',      false, false, '새콤한 히비스커스로 산뜻하게 즐겨요.',                         '/images/menus/basic/13.svg', 'hibiscus-tea',             '열정',        '상큼한,따뜻한',          current_timestamp, current_timestamp),
  ('녹차',               'Green Tea',                4500, (select id from categories where name = '티'),       'on',      false, false, '맑고 깔끔한 녹차예요.',                                        '/images/menus/basic/14.svg', 'green-tea',                '긴장됨',      '쌉싸름한,따뜻한',        current_timestamp, current_timestamp),
  ('딸기 스무디',        'Strawberry Smoothie',      5800, (select id from categories where name = '스무디'),   'on',      false, false, '딸기를 통째로 갈아 시원하고 새콤달콤해요.',                    '/images/menus/basic/15.svg', 'strawberry-smoothie',      '설렘',        '상큼한,시원한,달콤한',   current_timestamp, current_timestamp),
  ('망고 스무디',        'Mango Smoothie',           5800, (select id from categories where name = '스무디'),   'on',      false, false, '망고를 갈아 진하고 달콤한 스무디예요.',                        '/images/menus/basic/16.svg', 'mango-smoothie',           '열정',        '달콤한,시원한',          current_timestamp, current_timestamp),
  ('바나나 스무디',      'Banana Smoothie',          5800, (select id from categories where name = '스무디'),   'on',      false, false, '바나나를 갈아 부드럽고 든든해요.',                             '/images/menus/basic/17.svg', 'banana-smoothie',          '피곤함,울적함', '달콤한,고소한,시원한', current_timestamp, current_timestamp),
  ('블루베리 스무디',    'Blueberry Smoothie',       5800, (select id from categories where name = '스무디'),   'on',      false, false, '블루베리를 갈아 새콤하고 시원해요.',                           '/images/menus/basic/18.svg', 'blueberry-smoothie',       '울적함',      '상큼한,시원한',          current_timestamp, current_timestamp),
  ('모카 프라페',        'Mocha Frappe',             6000, (select id from categories where name = '프라페'),   'on',      false, false, '커피와 초콜릿을 얼음과 함께 간 시원한 프라페예요.',            '/images/menus/basic/19.svg', 'mocha-frappe',             '피곤함',      '달콤한,쌉싸름한,시원한', current_timestamp, current_timestamp),
  ('쿠키앤크림 프라페',  'Cookies and Cream Frappe', 6000, (select id from categories where name = '프라페'),   'on',      false, false, '초코 쿠키와 크림을 얼음과 함께 갈았어요.',                     '/images/menus/basic/20.svg', 'cookies-and-cream-frappe', '설렘',        '달콤한,시원한',          current_timestamp, current_timestamp),
  ('녹차 프라페',        'Green Tea Frappe',         6000, (select id from categories where name = '프라페'),   'on',      false, false, '녹차를 얼음과 함께 갈아 시원하고 쌉싸름해요.',                 '/images/menus/basic/21.svg', 'green-tea-frappe',         '열정',        '쌉싸름한,시원한',        current_timestamp, current_timestamp),
  ('카라멜 프라페',      'Caramel Frappe',           6000, (select id from categories where name = '프라페'),   'hidden',  false, false, '달콤한 카라멜을 얼음과 함께 갈았어요.',                        '/images/menus/basic/22.svg', 'caramel-frappe',           '울적함',      '달콤한,시원한',          current_timestamp, current_timestamp),
  ('조각 케이크',        'Slice Cake',               6500, (select id from categories where name = '디저트'),   'on',      true,  false, '촉촉한 시트와 생크림을 겹겹이 쌓은 조각 케이크예요.',          '/images/menus/basic/23.svg', 'slice-cake',               '설렘',        '달콤한',                 current_timestamp, current_timestamp),
  ('와플',               'Waffle',                   5500, (select id from categories where name = '디저트'),   'on',      false, false, '겉은 바삭하고 속은 폭신한 와플이에요.',                        '/images/menus/basic/24.svg', 'waffle',                   '울적함',      '달콤한,따뜻한',          current_timestamp, current_timestamp),
  ('크로플',             'Croffle',                  5500, (select id from categories where name = '디저트'),   'on',      false, false, '크루아상 반죽을 와플 틀에 눌러 구워 바삭해요.',                '/images/menus/basic/25.svg', 'croffle',                  '그리움,열정', '달콤한,고소한',          current_timestamp, current_timestamp),
  ('마카롱',             'Macaron',                  4000, (select id from categories where name = '디저트'),   'on',      false, false, '쫀득한 마카롱 두 개가 한 세트예요.',                           '/images/menus/basic/26.svg', 'macaron',                  '설렘',        '달콤한,상큼한',          current_timestamp, current_timestamp),
  ('크루아상',           'Croissant',                5000, (select id from categories where name = '푸드'),     'on',      false, false, '버터 향 가득한 결 살아 있는 크루아상이에요.',                  '/images/menus/basic/27.svg', 'croissant',                '그리움',      '고소한',                 current_timestamp, current_timestamp),
  ('치아바타 샌드위치',  'Ciabatta Sandwich',        7000, (select id from categories where name = '푸드'),     'on',      false, false, '햄과 모짜렐라, 토마토, 루꼴라를 넣은 치아바타 샌드위치예요.',  '/images/menus/basic/28.svg', 'ciabatta-sandwich',        '피곤함,열정', '고소한',                 current_timestamp, current_timestamp),
  ('베이글',             'Bagel',                    4500, (select id from categories where name = '푸드'),     'on',      false, false, '쫄깃한 플레인 베이글이에요.',                                  '/images/menus/basic/29.svg', 'bagel',                    '긴장됨',      '고소한',                 current_timestamp, current_timestamp),
  ('토스트',             'Toast',                    4500, (select id from categories where name = '푸드'),     'on',      false, false, '버터를 발라 구운 두툼한 식빵 토스트예요.',                     '/images/menus/basic/30.svg', 'toast',                    '그리움,울적함', '고소한,따뜻한,달콤한', current_timestamp, current_timestamp);

-- ===== 재료 (README "공통 재료 선반"·"재료 마스터") =====
-- 기반 재료 30개(계열별, 0원) + 추가 재료 43개(선반별). 가격은 README 가격 단계(기본 500 · 특별 800 · 고급 1,500)
-- 일반 우유는 라떼 메뉴에는 기본 포함이지만, 재료로 더할 때(커피 + 우유)는 500원이라 500으로 둔다
-- 타피오카 펄은 숨김(재고 없음)으로 넣어 관리자 화면의 숨김 표시를 볼 수 있게 한다
insert into ingredients (name, type, shelf, price, color, effect_tags, modifier, modifier_priority, visible, created_at, updated_at) values
  ('다크 로스트', 'base',  '커피', 0, '#3B2416', '활력', null, null, true, current_timestamp, current_timestamp),
  ('라이트 로스트', 'base',  '커피', 0, '#8B5A2B', '활력,상큼함', null, null, true, current_timestamp, current_timestamp),
  ('디카페인', 'base',  '커피', 0, '#6F4E37', '진정', null, null, true, current_timestamp, current_timestamp),
  ('초코', 'base',  '논커피', 0, '#5C3A21', '달콤함', null, null, true, current_timestamp, current_timestamp),
  ('말차', 'base',  '논커피', 0, '#7BA05B', '활력,진정', null, null, true, current_timestamp, current_timestamp),
  ('고구마', 'base',  '논커피', 0, '#C98B5E', '달콤함,든든함', null, null, true, current_timestamp, current_timestamp),
  ('곡물', 'base',  '논커피', 0, '#D8C3A5', '고소함,든든함', null, null, true, current_timestamp, current_timestamp),
  ('딸기청', 'base',  '과일라떼', 0, '#F4A6B7', '상큼함,달콤함', null, null, true, current_timestamp, current_timestamp),
  ('블루베리청', 'base',  '과일라떼', 0, '#7B6CC2', '상큼함', null, null, true, current_timestamp, current_timestamp),
  ('망고청', 'base',  '과일라떼', 0, '#F6B64A', '달콤함', null, null, true, current_timestamp, current_timestamp),
  ('얼그레이', 'base',  '티', 0, '#A4573A', '활력', null, null, true, current_timestamp, current_timestamp),
  ('캐모마일', 'base',  '티', 0, '#E9D27A', '진정', null, null, true, current_timestamp, current_timestamp),
  ('히비스커스', 'base',  '티', 0, '#B3263E', '상큼함', null, null, true, current_timestamp, current_timestamp),
  ('녹차 찻잎', 'base',  '티', 0, '#A8C686', '진정', null, null, true, current_timestamp, current_timestamp),
  ('딸기', 'base',  '스무디', 0, '#E8505B', '상큼함,시원함', null, null, true, current_timestamp, current_timestamp),
  ('망고', 'base',  '스무디', 0, '#FFB627', '달콤함,시원함', null, null, true, current_timestamp, current_timestamp),
  ('바나나', 'base',  '스무디', 0, '#F3E07A', '든든함,달콤함', null, null, true, current_timestamp, current_timestamp),
  ('블루베리', 'base',  '스무디', 0, '#4B3F8C', '상큼함,시원함', null, null, true, current_timestamp, current_timestamp),
  ('모카', 'base',  '프라페', 0, '#6B4630', '시원함,활력', null, null, true, current_timestamp, current_timestamp),
  ('쿠키앤크림', 'base',  '프라페', 0, '#D9D4CC', '시원함,달콤함', null, null, true, current_timestamp, current_timestamp),
  ('녹차 파우더', 'base',  '프라페', 0, '#9CC08A', '시원함,진정', null, null, true, current_timestamp, current_timestamp),
  ('카라멜', 'base',  '프라페', 0, '#D29A4E', '시원함,달콤함', null, null, true, current_timestamp, current_timestamp),
  ('조각 케이크', 'base',  '디저트', 0, '#F7E7CE', '달콤함', null, null, true, current_timestamp, current_timestamp),
  ('와플', 'base',  '디저트', 0, '#D9A35B', '달콤함,든든함', null, null, true, current_timestamp, current_timestamp),
  ('크로플', 'base',  '디저트', 0, '#C8873A', '달콤함', null, null, true, current_timestamp, current_timestamp),
  ('마카롱', 'base',  '디저트', 0, '#F5B7C5', '달콤함', null, null, true, current_timestamp, current_timestamp),
  ('크루아상', 'base',  '푸드', 0, '#D9A35B', '고소함', null, null, true, current_timestamp, current_timestamp),
  ('치아바타', 'base',  '푸드', 0, '#C9A66B', '든든함', null, null, true, current_timestamp, current_timestamp),
  ('베이글', 'base',  '푸드', 0, '#CFA470', '든든함,고소함', null, null, true, current_timestamp, current_timestamp),
  ('토스트', 'base',  '푸드', 0, '#E0B072', '고소함,든든함', null, null, true, current_timestamp, current_timestamp),
  ('바닐라', 'extra', '시럽', 500, '#F3E5B5', '달콤함', '빛을 머금은', 30, true, current_timestamp, current_timestamp),
  ('캐러멜', 'extra', '시럽', 500, '#C8873A', '달콤함', '황금빛', 30, true, current_timestamp, current_timestamp),
  ('헤이즐넛', 'extra', '시럽', 500, '#A97142', '고소함', '숲향 품은', 30, true, current_timestamp, current_timestamp),
  ('시나몬', 'extra', '시럽', 500, '#B5562E', '활력', '불씨 깃든', 30, true, current_timestamp, current_timestamp),
  ('꿀', 'extra', '시럽', 500, '#E9B43C', '달콤함,진정', '꿀빛', 30, true, current_timestamp, current_timestamp),
  ('우유', 'extra', '우유', 500, '#F8F4EA', '고소함', '보드라운', 20, true, current_timestamp, current_timestamp),
  ('오트', 'extra', '우유', 500, '#EADFC8', '고소함', '귀리 들판의', 20, true, current_timestamp, current_timestamp),
  ('두유', 'extra', '우유', 500, '#F1E9D2', '고소함', '콩꽃 피운', 20, true, current_timestamp, current_timestamp),
  ('아몬드', 'extra', '우유', 500, '#EEDFCB', '고소함', '하얀 꽃잎의', 20, true, current_timestamp, current_timestamp),
  ('요거트', 'extra', '우유', 800, '#FAF7F2', '상큼함', '새콤한 구름의', 20, true, current_timestamp, current_timestamp),
  ('휘핑', 'extra', '음료 토핑', 500, '#FFFFFF', '달콤함', '구름을 얹은', 10, true, current_timestamp, current_timestamp),
  ('초코칩', 'extra', '음료 토핑', 500, '#4A2C1D', '달콤함', '별똥 조각 뿌린', 10, true, current_timestamp, current_timestamp),
  ('시나몬 파우더', 'extra', '음료 토핑', 500, '#A0522D', '활력', '불씨 가루 뿌린', 10, true, current_timestamp, current_timestamp),
  ('마시멜로', 'extra', '음료 토핑', 800, '#FCEFF3', '달콤함', '말랑 구름 띄운', 10, true, current_timestamp, current_timestamp),
  ('과육', 'extra', '음료 토핑', 800, '#F28B82', '상큼함', '열매 가득한', 10, true, current_timestamp, current_timestamp),
  ('타피오카 펄', 'extra', '음료 토핑', 800, '#2B1D1A', '든든함', '흑진주 품은', 10, false, current_timestamp, current_timestamp),
  ('생크림', 'extra', '디저트 장식', 800, '#FFFDF6', '달콤함', '눈송이 덮인', 20, true, current_timestamp, current_timestamp),
  ('아이스크림', 'extra', '디저트 장식', 1500, '#FFF3D6', '시원함,달콤함', '눈꽃 얹은', 30, true, current_timestamp, current_timestamp),
  ('제철 과일', 'extra', '디저트 장식', 1500, '#E85D75', '상큼함', '계절 열매 올린', 30, true, current_timestamp, current_timestamp),
  ('초코 소스', 'extra', '디저트 장식', 500, '#3E2418', '달콤함', '밤그늘 흐르는', 20, true, current_timestamp, current_timestamp),
  ('캐러멜 소스', 'extra', '디저트 장식', 500, '#B8732E', '달콤함', '호박꿀 흐르는', 20, true, current_timestamp, current_timestamp),
  ('베리 소스', 'extra', '디저트 장식', 500, '#9B2D4B', '상큼함', '붉은 열매즙 흐르는', 20, true, current_timestamp, current_timestamp),
  ('견과류', 'extra', '디저트 장식', 800, '#8B5A2B', '고소함', '도토리 뿌린', 10, true, current_timestamp, current_timestamp),
  ('햄', 'extra', '푸드 속재료', 800, '#E8A0A0', '든든함', '훈연 향 밴', 20, true, current_timestamp, current_timestamp),
  ('치즈', 'extra', '푸드 속재료', 800, '#F6D365', '고소함', '녹아내린', 20, true, current_timestamp, current_timestamp),
  ('에그', 'extra', '푸드 속재료', 800, '#F9C74F', '든든함', '해돋이 얹은', 20, true, current_timestamp, current_timestamp),
  ('아보카도', 'extra', '푸드 속재료', 1500, '#7FA650', '고소함', '초록 버터 품은', 30, true, current_timestamp, current_timestamp),
  ('연어', 'extra', '푸드 속재료', 1500, '#F4845F', '든든함', '바다를 사냥한', 30, true, current_timestamp, current_timestamp),
  ('채소', 'extra', '푸드 속재료', 800, '#6BAF5B', '상큼함', '들풀 채운', 10, true, current_timestamp, current_timestamp),
  ('크림치즈', 'extra', '푸드 속재료', 1500, '#FBF6EC', '고소함', '눈밭을 바른', 20, true, current_timestamp, current_timestamp),
  ('레몬청', 'extra', '티 블렌딩', 500, '#F7E15A', '상큼함', '햇살 스민', 30, true, current_timestamp, current_timestamp),
  ('자몽청', 'extra', '티 블렌딩', 500, '#F28C6B', '상큼함', '노을빛', 30, true, current_timestamp, current_timestamp),
  ('유자청', 'extra', '티 블렌딩', 500, '#F6C445', '상큼함,진정', '겨울 햇살의', 30, true, current_timestamp, current_timestamp),
  ('청귤청', 'extra', '티 블렌딩', 500, '#9BC53D', '상큼함', '풋빛', 30, true, current_timestamp, current_timestamp),
  ('민트', 'extra', '티 블렌딩', 500, '#7FD1AE', '시원함', '서늘한 바람의', 20, true, current_timestamp, current_timestamp),
  ('레몬그라스', 'extra', '티 블렌딩', 500, '#C9D97A', '상큼함', '초원 바람 깃든', 20, true, current_timestamp, current_timestamp),
  ('로즈마리', 'extra', '티 블렌딩', 500, '#5E8C61', '활력', '숲 기사의', 20, true, current_timestamp, current_timestamp),
  ('라벤더', 'extra', '티 블렌딩', 500, '#A68BD1', '진정', '보랏빛 꿈꾸는', 20, true, current_timestamp, current_timestamp),
  ('바질 페스토', 'extra', '푸드 소스', 500, '#4F7F3A', '고소함', '초록 마법 바른', 10, true, current_timestamp, current_timestamp),
  ('허니머스터드', 'extra', '푸드 소스', 500, '#E2A93B', '달콤함', '꿀겨자 바른', 10, true, current_timestamp, current_timestamp),
  ('홀그레인 머스터드', 'extra', '푸드 소스', 500, '#B88A3E', '활력', '알알이 톡 쏘는', 10, true, current_timestamp, current_timestamp),
  ('스리라차 마요', 'extra', '푸드 소스', 500, '#F08A4B', '활력', '불꽃 숨긴', 10, true, current_timestamp, current_timestamp),
  ('발사믹 글레이즈', 'extra', '푸드 소스', 500, '#3B1F2B', '상큼함', '검은 보석 흐르는', 10, true, current_timestamp, current_timestamp);

-- ===== 비밀 레시피 (README "비밀 레시피 목록(안)" 8개) =====
insert into secret_recipes (name, grade, category_id, color, description, riddle, visible, created_at, updated_at) values
  ('대연금술사의 황금 꼬리', 'legend', (select id from categories where name = '커피'),   '#d9a03c', '은퇴한 대연금술사 모카 사장님이 처음 완성한 포션이에요.', '가장 진한 원두에 황금 시럽, 곡식의 우유, 말랑한 구름 하나. 내가 처음 빚은 맛이다냥.', true, current_timestamp, current_timestamp),
  ('빛과 어둠의 균형 포션',  'rare',   (select id from categories where name = '커피'),   '#8a6a4f', '빛과 어둠이 한 잔 안에서 균형을 이루는 포션이에요.',     '검은 원두에 하얀 꽃의 향 하나면 된다냥.',                                     true, current_timestamp, current_timestamp),
  ('바다 사냥꾼 식량',       'rare',   (select id from categories where name = '푸드'),   '#e48b6a', '바다를 건너는 고양이 사냥꾼의 든든한 식량이에요.',       '고리 부적 빵에 바다의 분홍 살, 하얀 치즈를 바르라냥.',                        true, current_timestamp, current_timestamp),
  ('백 년 잠의 자장가',      'rare',   (select id from categories where name = '티'),     '#a990d6', '한 모금이면 백 년 동안 잠들 것 같은 포근함이에요.',      '잠드는 꽃잎에 벌의 선물, 보랏빛 들꽃 한 줌이다냥.',                           true, current_timestamp, current_timestamp),
  ('붉은 마녀의 비밀 서약',  'rare',   (select id from categories where name = '티'),     '#b3263e', '붉은 마녀가 숲 기사와 몰래 맺은 서약의 차예요.',         '붉은 꽃잎 차에 노을빛 열매, 숲 기사의 잎 하나를 띄우라냥.',                   true, current_timestamp, current_timestamp),
  ('별을 삼킨 밤의 정령',    'rare',   (select id from categories where name = '스무디'), '#3d3a8c', '밤하늘의 별을 한입에 삼킨 정령의 진액이에요.',           '밤빛 열매를 얼려 갈고, 새콤한 구름과 벌의 선물을 더하라냥.',                 true, current_timestamp, current_timestamp),
  ('다람쥐 왕의 보물 상자',  'rare',   (select id from categories where name = '디저트'), '#b8732e', '숲속 다람쥐 왕이 숨겨 둔 달콤한 보물 상자예요.',         '격자 과자 위에 눈꽃, 호박꿀, 그리고 다람쥐가 숨긴 열매를 올리라냥.',          true, current_timestamp, current_timestamp),
  ('용 사냥꾼의 보급품',     'legend', (select id from categories where name = '푸드'),   '#5e8c3a', '용을 잡으러 떠나는 기사만 받을 수 있는 보급품이에요.',   '기사의 빵에 초록 버터와 해돋이, 불꽃을 숨긴 소스를 바르라냥.',                true, current_timestamp, current_timestamp);

-- 비밀 레시피의 재료 조합: 기반 재료와, 기반 재료를 포함한 재료 id 를 작은 순으로 쉼표로 이은 값 (연금 공방에서 이 값과 비교한다)
-- string_agg 는 H2(PostgreSQL 모드)와 PostgreSQL 둘 다 된다 (listagg 는 PostgreSQL 에 없다)
update secret_recipes set base_ingredient_id = (select id from ingredients where name = '다크 로스트'),
  ingredient_combo = (select string_agg(cast(id as varchar), ',' order by id) from ingredients where name in ('다크 로스트', '캐러멜', '오트', '마시멜로'))
  where name = '대연금술사의 황금 꼬리';
update secret_recipes set base_ingredient_id = (select id from ingredients where name = '다크 로스트'),
  ingredient_combo = (select string_agg(cast(id as varchar), ',' order by id) from ingredients where name in ('다크 로스트', '바닐라'))
  where name = '빛과 어둠의 균형 포션';
update secret_recipes set base_ingredient_id = (select id from ingredients where name = '베이글'),
  ingredient_combo = (select string_agg(cast(id as varchar), ',' order by id) from ingredients where name in ('베이글', '연어', '크림치즈'))
  where name = '바다 사냥꾼 식량';
update secret_recipes set base_ingredient_id = (select id from ingredients where name = '캐모마일'),
  ingredient_combo = (select string_agg(cast(id as varchar), ',' order by id) from ingredients where name in ('캐모마일', '꿀', '라벤더'))
  where name = '백 년 잠의 자장가';
update secret_recipes set base_ingredient_id = (select id from ingredients where name = '히비스커스'),
  ingredient_combo = (select string_agg(cast(id as varchar), ',' order by id) from ingredients where name in ('히비스커스', '자몽청', '로즈마리'))
  where name = '붉은 마녀의 비밀 서약';
update secret_recipes set base_ingredient_id = (select id from ingredients where name = '블루베리'),
  ingredient_combo = (select string_agg(cast(id as varchar), ',' order by id) from ingredients where name in ('블루베리', '요거트', '꿀'))
  where name = '별을 삼킨 밤의 정령';
update secret_recipes set base_ingredient_id = (select id from ingredients where name = '와플'),
  ingredient_combo = (select string_agg(cast(id as varchar), ',' order by id) from ingredients where name in ('와플', '아이스크림', '캐러멜 소스', '견과류'))
  where name = '다람쥐 왕의 보물 상자';
update secret_recipes set base_ingredient_id = (select id from ingredients where name = '치아바타'),
  ingredient_combo = (select string_agg(cast(id as varchar), ',' order by id) from ingredients where name in ('치아바타', '아보카도', '에그', '스리라차 마요'))
  where name = '용 사냥꾼의 보급품';

-- 모카손님(1번)은 비밀 레시피 2개를 발견했다
insert into secret_recipe_discoveries (member_id, secret_recipe_id, discovered_at) values
  ((select id from members where email = 'moka@ncafe.dev'), (select id from secret_recipes where name = '빛과 어둠의 균형 포션'), current_timestamp),
  ((select id from members where email = 'moka@ncafe.dev'), (select id from secret_recipes where name = '백 년 잠의 자장가'),     current_timestamp),
  ((select id from members where email = 'cheese@ncafe.dev'), (select id from secret_recipes where name = '빛과 어둠의 균형 포션'), current_timestamp);

-- ===== 회원이 만든 포션 (도감) =====
insert into recipes (member_id, base_menu_id, secret_recipe_id, name, grade, price, color, created_at) values
  ((select id from members where email = 'moka@ncafe.dev'),   (select id from menus where slug = 'dark-roast-coffee'), null, '칠흑 고양이의 물약',           'normal', 4000, '#3B2416', current_timestamp),
  ((select id from members where email = 'moka@ncafe.dev'),   (select id from menus where slug = 'dark-roast-coffee'), (select id from secret_recipes where name = '빛과 어둠의 균형 포션'), '빛과 어둠의 균형 포션', 'rare', 4500, '#8a6a4f', current_timestamp),
  ((select id from members where email = 'moka@ncafe.dev'),   (select id from menus where slug = 'strawberry-latte'),  null, '구름을 얹은 분홍 고양이 포션', 'normal', 6000, '#F8CAD4', current_timestamp),
  ((select id from members where email = 'cheese@ncafe.dev'), (select id from menus where slug = 'chamomile-tea'),     null, '잠드는 꼬리',                  'normal', 4500, '#E9D27A', current_timestamp);

-- 포션에 들어간 재료 (기반 재료 + 추가 재료)
insert into recipe_ingredients (recipe_id, ingredient_id) values
  ((select id from recipes where name = '칠흑 고양이의 물약'),           (select id from ingredients where name = '다크 로스트')),
  ((select id from recipes where name = '빛과 어둠의 균형 포션'),        (select id from ingredients where name = '다크 로스트')),
  ((select id from recipes where name = '빛과 어둠의 균형 포션'),        (select id from ingredients where name = '바닐라')),
  ((select id from recipes where name = '구름을 얹은 분홍 고양이 포션'), (select id from ingredients where name = '딸기청')),
  ((select id from recipes where name = '구름을 얹은 분홍 고양이 포션'), (select id from ingredients where name = '휘핑')),
  ((select id from recipes where name = '잠드는 꼬리'),                  (select id from ingredients where name = '캐모마일'));

-- ===== 장바구니 (모카손님) =====
insert into cart_items (member_id, menu_id, recipe_id, quantity, created_at) values
  ((select id from members where email = 'moka@ncafe.dev'), (select id from menus where slug = 'slice-cake'), null, 2, current_timestamp),
  ((select id from members where email = 'moka@ncafe.dev'), null, (select id from recipes where name = '구름을 얹은 분홍 고양이 포션'), 1, current_timestamp);

-- ===== 주문 · 주문 항목 · 결제 =====
-- 상태를 골고루: paid(1), brewing(1), ready(1), done(2), cancelled(1)
insert into orders (member_id, order_number, status, pickup_name, pickup_type, request, total_price, created_at, updated_at) values
  ((select id from members where email = 'moka@ncafe.dev'),   'NC261020-0001', 'done',      '모카',  'dine-in', null,           8500,  current_timestamp, current_timestamp),
  ((select id from members where email = 'moka@ncafe.dev'),   'NC261021-0002', 'done',      '모카',  'takeout', '얼음 적게',    11000, current_timestamp, current_timestamp),
  ((select id from members where email = 'moka@ncafe.dev'),   'NC261022-0003', 'cancelled', '모카',  'takeout', null,           4500,  current_timestamp, current_timestamp),
  ((select id from members where email = 'moka@ncafe.dev'),   'NC261023-0004', 'paid',      '모카',  'dine-in', '시럽은 따로', 10500, current_timestamp, current_timestamp),
  ((select id from members where email = 'cheese@ncafe.dev'), 'NC261023-0005', 'brewing',   '치즈',  'dine-in', null,           9500,  current_timestamp, current_timestamp),
  ((select id from members where email = 'cheese@ncafe.dev'), 'NC261023-0006', 'ready',     '치즈',  'takeout', null,           5800,  current_timestamp, current_timestamp);

insert into order_items (order_id, item_type, name, options, unit_price, quantity) values
  ((select id from orders where order_number = 'NC261020-0001'), 'menu',   '다크 로스트 커피',      null,                4000, 1),
  ((select id from orders where order_number = 'NC261020-0001'), 'recipe', '빛과 어둠의 균형 포션', '다크 로스트,바닐라', 4500, 1),
  ((select id from orders where order_number = 'NC261021-0002'), 'menu',   '딸기 라떼',             null,                5500, 2),
  ((select id from orders where order_number = 'NC261022-0003'), 'menu',   '얼그레이 티',           null,                4500, 1),
  ((select id from orders where order_number = 'NC261023-0004'), 'menu',   '조각 케이크',           null,                6500, 1),
  ((select id from orders where order_number = 'NC261023-0004'), 'menu',   '마카롱',                null,                4000, 1),
  ((select id from orders where order_number = 'NC261023-0005'), 'menu',   '캐모마일 티',           null,                4500, 1),
  ((select id from orders where order_number = 'NC261023-0005'), 'menu',   '말차 라떼',             null,                5000, 1),
  ((select id from orders where order_number = 'NC261023-0006'), 'menu',   '망고 스무디',           null,                5800, 1);

insert into payments (order_id, method, detail, amount, approval_code, paid_at) values
  ((select id from orders where order_number = 'NC261020-0001'), 'card',     '달빛카드 · 일시불', 8500,  'A1000001', current_timestamp),
  ((select id from orders where order_number = 'NC261021-0002'), 'easy',     '냥페이',           11000, 'A1000002', current_timestamp),
  ((select id from orders where order_number = 'NC261022-0003'), 'card',     '달빛카드 · 일시불', 4500,  'A1000003', current_timestamp),
  ((select id from orders where order_number = 'NC261023-0004'), 'transfer', '숲속은행',         10500, 'A1000004', current_timestamp),
  ((select id from orders where order_number = 'NC261023-0005'), 'card',     '달빛카드 · 일시불', 9500,  'A1000005', current_timestamp),
  ((select id from orders where order_number = 'NC261023-0006'), 'easy',     '냥페이',           5800,  'A1000006', current_timestamp);

-- ===== 포션 자랑 게시판 =====
insert into potion_showcases (member_id, recipe_id, title, content, created_at, updated_at) values
  ((select id from members where email = 'moka@ncafe.dev'),   (select id from recipes where name = '빛과 어둠의 균형 포션'), '드디어 비밀 레시피를 찾았어요!', '다크 로스트에 바닐라 하나만 넣으면 돼요. 수수께끼 힌트가 결정적이었어요.', current_timestamp, current_timestamp),
  ((select id from members where email = 'cheese@ncafe.dev'), (select id from recipes where name = '잠드는 꼬리'),           '자기 전에 마시기 좋은 포션',     '캐모마일 티 그대로인데 이름이 너무 귀여워요.',                             current_timestamp, current_timestamp);

insert into showcase_ratings (showcase_id, member_id, score, created_at) values
  ((select id from potion_showcases where title = '드디어 비밀 레시피를 찾았어요!'), (select id from members where email = 'cheese@ncafe.dev'), 5, current_timestamp),
  ((select id from potion_showcases where title = '자기 전에 마시기 좋은 포션'),     (select id from members where email = 'moka@ncafe.dev'),   4, current_timestamp);
