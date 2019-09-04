music_set("animation/september.wav");
svg_set("animation/test.svg");

svg_main.addEventListener("load", () => {
  timeline.add(player_move(
    svg("#player1"),
    5,
    svg("#move1"),
  ));
  timeline.add(player_move(
    svg("#player2"),
    5,
    svg("#move2"),
  ), 0);
  pass(
    svg("#player2"),
    1,
    2,
  );
  pass(
    svg("#player1"),
    3,
    4
  );
});
