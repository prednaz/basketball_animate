music_set("animation/september.wav");
svg_set("animation/test.svg");

svg_main.addEventListener("load", () => {
  timeline.add(player_along_path(
    svg("#player1"),
    5,
    svg("#move1"),
    {ease: Power0.easeNone}
  ));
  timeline.add(player_along_path(
    svg("#player2"),
    5,
    svg("#move2"),
    {ease: Power0.easeNone}
  ), 0);
  timeline.add(pass(
    svg("#player2"),
    1,
    {ease: Power0.easeNone},
    timeline,
    2
  ),1);
});
