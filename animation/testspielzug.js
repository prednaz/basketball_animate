music_set("animation/september.wav");
svg_set("animation/testspielzug.svg");
bpm_set(120);

svg_main.addEventListener("load", () => {
  path_shorten(svg("svg > path"), 50, 5);
  clock();

  //player1
  timeline.add(player_move(
    svg("#player1"),
    time(3),
    svg("#move1"),
  ), time(1,1));
  timeline.add(player_move(
    svg("#player1"),
    time(10),
    svg("#move2"),
  ), time(2,1));

  //player3
  timeline.add(player_move(
    svg("#player3"),
    time(3),
    svg("#move7"),
  ), time(1,1));
  timeline.add(player_move(
    svg("#player3"),
    time(13),
    svg("#move8"),
  ), time(1,4));

  //player4
  timeline.add(player_move(
    svg("#player4"),
    time(3),
    svg("#move5"),
  ), time(1,1));
  timeline.add(player_move(
    svg("#player4"),
    time(9),
    svg("#move6"),
  ), time(2,3));

  //player5
  timeline.add(player_move(
    svg("#player5"),
    time(4),
    svg("#move3"),
  ), time(1,1));
  timeline.add(player_move(
    svg("#player5"),
    time(3),
    svg("#move4"),
  ), time(2,3));

  //ball

  // timeline.add(
  //   ball_along_path(
  //     svg("#ball"),
  //     1.5,
  //     svg("#move1"),
  //     {ease: Power1.easeInOut}
  //   ), time(1,1)
  // );
  // timeline.add(
  //   ball_along_path(
  //     svg("#ball"),
  //     0.5,
  //     svg("#ball2"),
  //     {ease: Power1.easeInOut}
  //   ), time(1,4)
  // );

  pass(
    svg("#player5"),
    time(1,4),
    time(2,1)
  );

  // timeline.add(
  //   ball_along_path(
  //     svg("#ball"),
  //     0.5,
  //     svg("#ball3"),
  //     {ease: Power1.easeInOut}
  //   ), time(2,2)
  // );

  pass(
    svg("#player2"),
    time(2,2),
    time(2,3)
  );

  // timeline.add(
  //   ball_along_path(
  //     svg("#ball"),
  //     0.5,
  //     svg("#ball4"),
  //     {ease: Power1.easeInOut}
  //   ), time(4,2)
  // );

  pass(
    svg("#player4"),
    time(3,2),
    time(3,3)
  );

  shoot(
    time(4,4),
    time(5,1)
  );

  // timeline.add(
  //   ball_along_path(
  //     svg("#ball"),
  //     0.5,
  //     svg("#ball5"),
  //     {ease: Power1.easeInOut}
  //   ), time(4,4)
  // );
});
