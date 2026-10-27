package com.newcafe.backend.service;

import com.newcafe.backend.entity.Category;
import com.newcafe.backend.entity.Ingredient;
import com.newcafe.backend.entity.Menu;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

// 연금 공방(레시피 등록)의 조합 규칙 (README "포션 조합 시스템")
// 재료 이름 · 가격 · 색 · 효과 태그 · 수식어는 재료 테이블(Ingredient)에서 읽고, 비밀 레시피 조합은 SecretRecipe.ingredientCombo 에 있다
// 여기에는 테이블에 없는 규칙만 둔다: 메뉴 ↔ 기반 재료, 계열별 선반 · 제외 재료, 선반별 개수, 이름 짓기, 감정 · 맛
public final class AlchemyRules {

  private AlchemyRules() {
  }

  // ===== 기본 메뉴 30종 ↔ 기반 재료 =====

  // 기본 메뉴(slug)의 기반 재료 이름(ingredients.name)과 기본 연금술 이름 (README "기본 메뉴 30종")
  public record BaseMenu(String ingredientName, String alchemyName) {
  }

  private static final Map<String, BaseMenu> BASE_MENUS = Map.ofEntries(
      Map.entry("dark-roast-coffee", new BaseMenu("다크 로스트", "칠흑 고양이의 물약")),
      Map.entry("light-roast-coffee", new BaseMenu("라이트 로스트", "새벽 수염의 물약")),
      Map.entry("decaf-coffee", new BaseMenu("디카페인", "잠든 고양이의 물약")),
      Map.entry("chocolate-latte", new BaseMenu("초코", "검은 숲의 물약")),
      Map.entry("matcha-latte", new BaseMenu("말차", "숲의 숨결")),
      Map.entry("sweet-potato-latte", new BaseMenu("고구마", "노을 뿌리 물약")),
      Map.entry("grain-latte", new BaseMenu("곡물", "들판의 축복")),
      Map.entry("strawberry-latte", new BaseMenu("딸기청", "분홍 고양이 포션")),
      Map.entry("blueberry-latte", new BaseMenu("블루베리청", "달빛 열매 포션")),
      Map.entry("mango-latte", new BaseMenu("망고청", "황금 열매 포션")),
      Map.entry("earl-grey-tea", new BaseMenu("얼그레이", "귀족 고양이의 달임")),
      Map.entry("chamomile-tea", new BaseMenu("캐모마일", "잠드는 꼬리")),
      Map.entry("hibiscus-tea", new BaseMenu("히비스커스", "붉은 마녀의 달임")),
      Map.entry("green-tea", new BaseMenu("녹차 찻잎", "초록 수풀 달임")),
      Map.entry("strawberry-smoothie", new BaseMenu("딸기", "장미 정령의 진액")),
      Map.entry("mango-smoothie", new BaseMenu("망고", "태양 정령의 진액")),
      Map.entry("banana-smoothie", new BaseMenu("바나나", "햇살 꼬리 정령의 진액")),
      Map.entry("blueberry-smoothie", new BaseMenu("블루베리", "밤하늘 정령의 진액")),
      Map.entry("mocha-frappe", new BaseMenu("모카", "얼어붙은 밤 엘릭서")),
      Map.entry("cookies-and-cream-frappe", new BaseMenu("쿠키앤크림", "눈보라 엘릭서")),
      Map.entry("green-tea-frappe", new BaseMenu("녹차 파우더", "서리숲 엘릭서")),
      Map.entry("caramel-frappe", new BaseMenu("카라멜", "호박빛 빙하 엘릭서")),
      Map.entry("slice-cake", new BaseMenu("조각 케이크", "마법진 케이크")),
      Map.entry("waffle", new BaseMenu("와플", "격자 결계 와플")),
      Map.entry("croffle", new BaseMenu("크로플", "황금 비늘 과자")),
      Map.entry("macaron", new BaseMenu("마카롱", "요정의 동전")),
      Map.entry("croissant", new BaseMenu("크루아상", "초승달 빵")),
      Map.entry("ciabatta-sandwich", new BaseMenu("치아바타", "떠돌이 기사의 빵")),
      Map.entry("bagel", new BaseMenu("베이글", "고리 부적 빵")),
      Map.entry("toast", new BaseMenu("토스트", "모닥불 토스트")));

  // 메뉴의 기반 재료 이름. 정해 두지 않은 메뉴(관리자가 새로 등록한 메뉴)는 메뉴 이름을 그대로 쓴다
  public static String baseIngredientNameOf(Menu menu) {
    BaseMenu base = menu.getSlug() == null ? null : BASE_MENUS.get(menu.getSlug());
    return base != null ? base.ingredientName() : menu.getKorName();
  }

  // 메뉴의 기본 연금술 이름. 정해 두지 않은 메뉴는 "메뉴 이름의 계열 주문" (예: 아메리카노의 어둠의 물약)
  public static String alchemyNameOf(Menu menu) {
    BaseMenu base = menu.getSlug() == null ? null : BASE_MENUS.get(menu.getSlug());
    return base != null ? base.alchemyName() : menu.getKorName() + "의 " + lineOf(menu.getCategory()).spell();
  }

  // ===== 계열별 재료 선반 =====

  // 계열 하나의 규칙: 주문 이름(spell), 기반 재료가 없을 때의 포션 색, 열리는 추가 재료 선반, 제외 재료
  public record Line(String spell, String color, List<String> shelves, Set<String> excluded) {
  }

  // README "계열별로 열리는 선반", "계열별 제외 재료"
  private static final Map<String, Line> LINES = Map.of(
      "커피", new Line("어둠의 물약", "#6F4E37", List.of("시럽", "우유", "음료 토핑"), Set.of("요거트", "과육")),
      "논커피", new Line("대지의 물약", "#7BA05B", List.of("우유", "시럽", "음료 토핑"), Set.of("요거트", "과육")),
      "과일라떼", new Line("열매의 물약", "#F4A6B7", List.of("우유", "음료 토핑"), Set.of("요거트", "초코칩", "시나몬 파우더")),
      "티", new Line("약초 달임", "#C9A65A", List.of("시럽", "티 블렌딩"), Set.of("바닐라", "캐러멜", "헤이즐넛", "시나몬")),
      "스무디", new Line("정령의 진액", "#E8505B", List.of("우유", "시럽"), Set.of("바닐라", "캐러멜", "헤이즐넛", "시나몬")),
      "프라페", new Line("얼음 결정 엘릭서", "#9CC0D8", List.of("시럽", "음료 토핑"), Set.of("과육")),
      "디저트", new Line("연성 과자", "#F7E7CE", List.of("디저트 장식"), Set.of()),
      "푸드", new Line("모험가의 식량", "#D9A35B", List.of("푸드 속재료", "푸드 소스"), Set.of()));

  // 규칙이 없는 새 계열(관리자가 추가한 카테고리)은 추가 재료 없이 기반 메뉴만 쓴다
  private static final Line DEFAULT_LINE = new Line("비밀 물약", "#8a6a4f", List.of(), Set.of());

  public static Line lineOf(Category category) {
    return category == null ? DEFAULT_LINE : LINES.getOrDefault(category.getName(), DEFAULT_LINE);
  }

  // 선반에서 고를 수 있는 개수 (README "공통 재료 선반"). 푸드 속재료는 하나 이상 넣어야 한다
  public record Limit(int min, int max) {
  }

  private static final Map<String, Limit> SHELF_LIMITS = Map.of(
      "시럽", new Limit(0, 2),
      "우유", new Limit(0, 1),
      "음료 토핑", new Limit(0, 3),
      "디저트 장식", new Limit(0, 3),
      "푸드 속재료", new Limit(1, 4),
      "티 블렌딩", new Limit(0, 2),
      "푸드 소스", new Limit(0, 2));

  public static Limit limitOf(String shelf) {
    return SHELF_LIMITS.getOrDefault(shelf, new Limit(0, 3));
  }

  // 티 블렌딩은 과일청 묶음과 허브 묶음에서 각각 하나까지만 고른다. 묶음이 없는 재료는 null
  private static final Map<String, String> GROUPS = Map.of(
      "레몬청", "과일청", "자몽청", "과일청", "유자청", "과일청", "청귤청", "과일청",
      "민트", "허브", "레몬그라스", "허브", "로즈마리", "허브", "라벤더", "허브");

  public static String groupOf(Ingredient ingredient) {
    return GROUPS.get(ingredient.getName());
  }

  // 재료 선반 화면의 선반 아이콘
  private static final Map<String, String> SHELF_ICONS = Map.of(
      "시럽", "🍯", "우유", "🥛", "음료 토핑", "☁️", "디저트 장식", "🍨",
      "푸드 속재료", "🥚", "티 블렌딩", "🌿", "푸드 소스", "🫙");

  public static String iconOf(String shelf) {
    return SHELF_ICONS.getOrDefault(shelf, "✨");
  }

  // ===== 이름 · 색 =====

  // 효과 태그 7종. 합이 같으면 이 순서로 칭호를 정한다
  private static final List<String> EFFECT_ORDER = List.of("활력", "진정", "달콤함", "상큼함", "고소함", "든든함", "시원함");

  private static final Map<String, String> EFFECT_TITLES = Map.of(
      "활력", "깨어나는", "진정", "고요한", "달콤함", "달콤한 축복의", "상큼함", "산뜻한 바람의",
      "고소함", "고소한 들녘의", "든든함", "든든한 모험의", "시원함", "서늘한 겨울의");

  // 포션 이름 (README "조합 결과 규칙"). 비밀 레시피 이름은 서비스에서 따로 덮어쓴다
  //   추가 재료 0개: 기본 연금술 이름
  //   1~2개: 수식어 1~2개 + 기본 연금술 이름 (예: 꿀빛 · 햇살 스민 잠드는 꼬리)
  //   3개 이상: 효과 칭호 + 대표 수식어 1개 + 기본 연금술 이름 (예: 달콤한 축복의 · 황금빛 칠흑 고양이의 물약)
  // 수식어는 우선순위가 높은 순, 같으면 가나다순이라 고른 순서와 상관없이 같은 조합은 같은 이름이 된다
  // effectTags 는 기반 재료와 추가 재료의 효과 태그를 모두 모은 것
  public static String potionName(String alchemyName, List<Ingredient> extras, List<String> effectTags) {
    List<String> modifiers = extras.stream()
        .filter(extra -> extra.getModifier() != null && !extra.getModifier().isBlank())
        .sorted(Comparator.comparing((Ingredient extra) -> Objects.requireNonNullElse(extra.getModifierPriority(), 0)).reversed()
            .thenComparing(Ingredient::getModifier))
        .map(Ingredient::getModifier)
        .toList();
    if (modifiers.isEmpty()) {
      return alchemyName;
    }
    if (extras.size() <= 2) {
      return String.join(" · ", modifiers) + " " + alchemyName;
    }
    return EFFECT_TITLES.get(topEffect(effectTags)) + " · " + modifiers.get(0) + " " + alchemyName;
  }

  // 효과 태그의 합이 가장 큰 태그. 같으면 EFFECT_ORDER 순서
  private static String topEffect(List<String> effectTags) {
    Map<String, Integer> counts = new HashMap<>();
    effectTags.forEach(tag -> counts.merge(tag, 1, Integer::sum));
    return EFFECT_ORDER.stream()
        .max(Comparator.comparingInt((String tag) -> counts.getOrDefault(tag, 0))
            .thenComparing(tag -> -EFFECT_ORDER.indexOf(tag)))
        .orElseThrow();
  }

  // 연금솥 액체 색: 기반 재료 색 60% + 추가 재료 색의 평균 40% (README "재료 마스터")
  public static String mixColor(String baseColor, List<String> extraColors) {
    if (extraColors.isEmpty()) {
      return baseColor;
    }
    int[] base = rgb(baseColor);
    int[] extra = new int[3];
    for (String color : extraColors) {
      int[] value = rgb(color);
      for (int i = 0; i < 3; i++) {
        extra[i] += value[i];
      }
    }
    StringBuilder mixed = new StringBuilder("#");
    for (int i = 0; i < 3; i++) {
      mixed.append(String.format("%02X", Math.round(base[i] * 0.6 + extra[i] / (double) extraColors.size() * 0.4)));
    }
    return mixed.toString();
  }

  private static int[] rgb(String color) {
    int value = Integer.parseInt(color.substring(1), 16);
    return new int[] {(value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF};
  }

  // ===== 감정 연금술 =====

  // 감정 · 맛은 테이블 없이 코드 상수로 둔다 (청사진 09). 메뉴 태그 검증(MenuTagRules)과 같은 목록
  public record Emotion(String name, String color) {
  }

  public static final List<Emotion> EMOTIONS = List.of(
      new Emotion("피곤함", "#91a8ff"),
      new Emotion("열정", "#ff7359"),
      new Emotion("그리움", "#d9a75c"),
      new Emotion("울적함", "#6f9fe8"),
      new Emotion("설렘", "#ec7cab"),
      new Emotion("긴장됨", "#76cf9b"));

  public static final List<String> TASTES = List.of("달콤한", "쌉싸름한", "상큼한", "고소한", "시원한", "따뜻한");
}
