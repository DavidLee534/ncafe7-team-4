-- 개발용 예시 데이터. backend/src/main/resources/data.sql 은 현재 엔티티와 맞지 않아 사용하지 않는다.
-- 새 DB의 Hibernate 테이블 생성 후, psql -v ON_ERROR_STOP=1 -f scripts/seed-local-demo.sql 로 실행한다.
-- 기존 회원 1번이 다른 계정이면 CurrentMember(1L)와 충돌하므로 아무것도 넣지 않는다.
BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM members WHERE id = 1 AND email <> 'moka@ncafe.dev') THEN
    RAISE EXCEPTION '회원 1번이 다른 계정입니다. 시드 데이터를 넣지 않습니다.';
  END IF;
END $$;

INSERT INTO members (email, password, nickname, role, status, created_at, updated_at)
VALUES ('moka@ncafe.dev', 'not-set', '모카손님', 'member', 'active', now(), now())
ON CONFLICT (email) DO NOTHING;
INSERT INTO members (email, password, nickname, role, status, created_at, updated_at)
VALUES ('cheese@ncafe.dev', 'not-set', '치즈손님', 'member', 'active', now(), now())
ON CONFLICT (email) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM members WHERE id = 1 AND email = 'moka@ncafe.dev') THEN
    RAISE EXCEPTION '모카손님이 회원 1번이 아닙니다. 시드 데이터를 넣지 않습니다.';
  END IF;
END $$;

INSERT INTO categories (name, eng_name, sort_order, visible, created_at, updated_at)
VALUES ('커피', 'Coffee', 1, true, now(), now()), ('티', 'Tea', 2, true, now(), now())
ON CONFLICT (name) DO NOTHING;

INSERT INTO menus (kor_name, eng_name, price, category_id, status, owner_recommended, popular,
                   description, image_url, created_at, updated_at)
SELECT '다크 로스트 커피', 'Dark Roast Coffee', 4000, c.id, 'on', true, false,
       '진하게 볶은 원두로 내려 쌉싸름하고 묵직해요.', '/images/menus/basic/01.svg', now(), now()
FROM categories c WHERE c.name = '커피'
  AND NOT EXISTS (SELECT 1 FROM menus WHERE kor_name = '다크 로스트 커피');
INSERT INTO menus (kor_name, eng_name, price, category_id, status, owner_recommended, popular,
                   description, image_url, created_at, updated_at)
SELECT '캐모마일 티', 'Chamomile Tea', 4500, c.id, 'on', false, false,
       '사과향이 나는 캐모마일로 마음이 편안해져요.', '/images/menus/basic/12.svg', now(), now()
FROM categories c WHERE c.name = '티'
  AND NOT EXISTS (SELECT 1 FROM menus WHERE kor_name = '캐모마일 티');

INSERT INTO recipes (member_id, base_menu_id, secret_recipe_id, name, grade, price, color, created_at)
SELECT m.id, menu.id, NULL, '칠흑 고양이의 물약', 'normal', 4000, '#3B2416', now()
FROM members m CROSS JOIN menus menu
WHERE m.email = 'moka@ncafe.dev' AND menu.kor_name = '다크 로스트 커피'
  AND NOT EXISTS (SELECT 1 FROM recipes r WHERE r.member_id = m.id AND r.name = '칠흑 고양이의 물약');
INSERT INTO recipes (member_id, base_menu_id, secret_recipe_id, name, grade, price, color, created_at)
SELECT m.id, menu.id, NULL, '잠드는 꼬리', 'normal', 4500, '#E9D27A', now()
FROM members m CROSS JOIN menus menu
WHERE m.email = 'cheese@ncafe.dev' AND menu.kor_name = '캐모마일 티'
  AND NOT EXISTS (SELECT 1 FROM recipes r WHERE r.member_id = m.id AND r.name = '잠드는 꼬리');

INSERT INTO potion_showcases (member_id, recipe_id, title, content, created_at, updated_at)
SELECT m.id, r.id, '내가 만든 첫 포션', '다크 로스트로 만든 포션이에요.', now(), now()
FROM members m JOIN recipes r ON r.member_id = m.id
WHERE m.email = 'moka@ncafe.dev' AND r.name = '칠흑 고양이의 물약'
  AND NOT EXISTS (SELECT 1 FROM potion_showcases s WHERE s.member_id = m.id AND s.title = '내가 만든 첫 포션');
INSERT INTO potion_showcases (member_id, recipe_id, title, content, created_at, updated_at)
SELECT m.id, r.id, '잠드는 꼬리 포션을 자랑해요', '자기 전에 마시기 좋은 포션이에요.', now(), now()
FROM members m JOIN recipes r ON r.member_id = m.id
WHERE m.email = 'cheese@ncafe.dev' AND r.name = '잠드는 꼬리'
  AND NOT EXISTS (SELECT 1 FROM potion_showcases s WHERE s.member_id = m.id AND s.title = '잠드는 꼬리 포션을 자랑해요');

INSERT INTO showcase_ratings (showcase_id, member_id, score, created_at)
SELECT s.id, m.id, 5, now() FROM potion_showcases s CROSS JOIN members m
WHERE s.title = '내가 만든 첫 포션' AND m.email = 'cheese@ncafe.dev'
ON CONFLICT (showcase_id, member_id) DO NOTHING;
INSERT INTO showcase_ratings (showcase_id, member_id, score, created_at)
SELECT s.id, m.id, 4, now() FROM potion_showcases s CROSS JOIN members m
WHERE s.title = '잠드는 꼬리 포션을 자랑해요' AND m.email = 'moka@ncafe.dev'
ON CONFLICT (showcase_id, member_id) DO NOTHING;

INSERT INTO orders (member_id, order_number, status, pickup_name, pickup_type, request,
                    total_price, created_at, updated_at)
SELECT m.id, 'NC-DEMO-0001', 'done', '모카', 'dine-in', NULL, 4000, now(), now()
FROM members m WHERE m.email = 'moka@ncafe.dev'
ON CONFLICT (order_number) DO NOTHING;
INSERT INTO orders (member_id, order_number, status, pickup_name, pickup_type, request,
                    total_price, created_at, updated_at)
SELECT m.id, 'NC-DEMO-0002', 'paid', '모카', 'takeout', NULL, 4000, now(), now()
FROM members m WHERE m.email = 'moka@ncafe.dev'
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO order_items (order_id, item_type, name, options, unit_price, quantity)
SELECT o.id, 'recipe', '칠흑 고양이의 물약', NULL, 4000, 1 FROM orders o
WHERE o.order_number IN ('NC-DEMO-0001', 'NC-DEMO-0002')
  AND NOT EXISTS (SELECT 1 FROM order_items i WHERE i.order_id = o.id AND i.name = '칠흑 고양이의 물약');
INSERT INTO payments (order_id, method, detail, amount, approval_code, paid_at)
SELECT o.id, 'card', '모의 결제', 4000, o.order_number, now() FROM orders o
WHERE o.order_number IN ('NC-DEMO-0001', 'NC-DEMO-0002')
  AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.order_id = o.id);

COMMIT;
