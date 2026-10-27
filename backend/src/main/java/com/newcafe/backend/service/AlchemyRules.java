package com.newcafe.backend.service;

import com.newcafe.backend.entity.Menu;
import java.util.List;
import java.util.Map;
import java.util.Set;

// 연금 공방(레시피 등록)의 재료 선반 · 감정 · 비밀 레시피 조합 규칙. 값은 연금 공방 목업과 같다
// 재료 관리(feat/admin-ingredient)가 develop에 머지되면 추가 재료는 Ingredient 테이블,
// 비밀 레시피 조합은 SecretRecipeIngredient 테이블로 옮기고 이 상수는 지운다
// 감정 · 맛은 테이블 없이 코드 상수로 둔다 (청사진 09). 메뉴 태그 검증(MenuTagRules)과 같은 목록
public final class AlchemyRules {

  private AlchemyRules() {
  }

  public static final int MAX_EXTRAS = 3;

  // 추가 재료 한 가지 (이름, 아이콘, 추가 금액)
  public record Extra(String name, String icon, int price) {
  }

  // 계열(카테고리 이름)마다의 재료 선반. spell 은 포션 이름 뒷부분, color 는 비밀 레시피가 아닐 때의 포션 색
  public record Shelf(String spell, String color, List<Extra> extras) {
  }

  public static final Map<String, Shelf> SHELVES = Map.of(
      "커피", new Shelf("어둠의 물약", "#6F4E37", List.of(
          new Extra("바닐라", "✨", 500), new Extra("캐러멜", "🟤", 500), new Extra("오트", "🥛", 700), new Extra("휘핑", "☁️", 600))),
      "티", new Shelf("약초 달임", "#C9A65A", List.of(
          new Extra("꿀", "🍯", 500), new Extra("레몬청", "🍋", 600), new Extra("허브", "🌿", 500))),
      "과일라떼", new Shelf("열매의 물약", "#F4A6B7", List.of(
          new Extra("우유", "🥛", 500), new Extra("과육", "🍒", 700), new Extra("크림", "☁️", 600))),
      "스무디", new Shelf("정령의 진액", "#E8505B", List.of(
          new Extra("요거트", "🍶", 600), new Extra("우유", "🥛", 500), new Extra("꿀", "🍯", 500))),
      "논커피", new Shelf("대지의 물약", "#7BA05B", List.of(
          new Extra("우유", "🥛", 500), new Extra("꿀", "🍯", 500), new Extra("휘핑", "☁️", 600))),
      "프라페", new Shelf("얼음 결정 엘릭서", "#9CC0D8", List.of(
          new Extra("시럽", "✨", 500), new Extra("휘핑", "☁️", 600), new Extra("초코칩", "🍫", 500))),
      "디저트", new Shelf("연성 과자", "#F7E7CE", List.of(
          new Extra("아이스크림", "🍨", 800), new Extra("베리 소스", "🍓", 600), new Extra("생크림", "☁️", 600))),
      "푸드", new Shelf("모험가의 식량", "#D9A35B", List.of(
          new Extra("크림치즈", "🧀", 700), new Extra("연어", "🐟", 1200), new Extra("에그", "🍳", 800))));

  // 기반 메뉴마다의 필수 재료 이름 (메뉴 slug → 재료). 재료로 만들기 화면에서 메뉴 대신 이 이름을 고른다
  private static final Map<String, String> BASE_INGREDIENTS = Map.ofEntries(
      Map.entry("dark-roast-coffee", "다크 로스트"),
      Map.entry("light-roast-coffee", "라이트 로스트"),
      Map.entry("decaf-coffee", "디카페인"),
      Map.entry("chocolate-latte", "초코"),
      Map.entry("matcha-latte", "말차"),
      Map.entry("sweet-potato-latte", "고구마"),
      Map.entry("grain-latte", "곡물"),
      Map.entry("strawberry-latte", "딸기청"),
      Map.entry("blueberry-latte", "블루베리청"),
      Map.entry("mango-latte", "망고청"),
      Map.entry("earl-grey-tea", "얼그레이"),
      Map.entry("chamomile-tea", "캐모마일"),
      Map.entry("hibiscus-tea", "히비스커스"),
      Map.entry("green-tea", "녹차"),
      Map.entry("strawberry-smoothie", "딸기"),
      Map.entry("mango-smoothie", "망고"),
      Map.entry("banana-smoothie", "바나나"),
      Map.entry("blueberry-smoothie", "블루베리"),
      Map.entry("mocha-frappe", "모카"),
      Map.entry("cookies-and-cream-frappe", "쿠키앤크림"),
      Map.entry("green-tea-frappe", "녹차"),
      Map.entry("caramel-frappe", "카라멜"),
      Map.entry("slice-cake", "조각 케이크"),
      Map.entry("waffle", "와플"),
      Map.entry("croffle", "크로플"),
      Map.entry("macaron", "마카롱"),
      Map.entry("croissant", "크루아상"),
      Map.entry("ciabatta-sandwich", "치아바타"),
      Map.entry("bagel", "베이글"),
      Map.entry("toast", "토스트"));

  // 메뉴의 필수 재료 이름. 정해 두지 않은 메뉴(관리자가 새로 등록한 메뉴)는 메뉴 이름을 그대로 쓴다
  public static String baseIngredientOf(Menu menu) {
    return menu.getSlug() == null ? menu.getKorName() : BASE_INGREDIENTS.getOrDefault(menu.getSlug(), menu.getKorName());
  }

  // 비밀 레시피의 재료 조합 (기반 메뉴 slug + 추가 재료). 이름은 secret_recipes.name 과 같다
  public record SecretCombo(String baseMenuSlug, Set<String> extras, String secretRecipeName) {
  }

  public static final List<SecretCombo> SECRET_COMBOS = List.of(
      new SecretCombo("dark-roast-coffee", Set.of("바닐라", "캐러멜", "오트"), "대연금술사의 황금 꼬리"),
      new SecretCombo("dark-roast-coffee", Set.of("바닐라"), "빛과 어둠의 균형 포션"),
      new SecretCombo("bagel", Set.of("연어", "크림치즈"), "바다 사냥꾼 식량"),
      new SecretCombo("chamomile-tea", Set.of("꿀", "허브"), "백 년 잠의 자장가"));

  // 감정 한 가지 (이름, 화면 색)
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
