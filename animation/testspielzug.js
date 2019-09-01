music_set("animation/september.wav");
svg_set("animation/testspielzug.svg");

const bpm = 120;
const time = time_generator(bpm);

svg_main.addEventListener("load", () => {
  clock(bpm);

  //player1
  timeline.add(player_along_path(
    svg("#player1"),
    1.5,
    svg("#move1"),
  ), time(1,1));
  timeline.add(player_along_path(
    svg("#player1"),
    5,
    svg("#move2"),
  ), time(2,1));

  //player3
  timeline.add(player_along_path(
    svg("#player3"),
    1.5,
    svg("#move7"),
  ), time(1,1));
  timeline.add(player_along_path(
    svg("#player3"),
    6.5,
    svg("#move8"),
  ), time(1,4));

  //player4
  timeline.add(player_along_path(
    svg("#player4"),
    1.5,
    svg("#move5"),
  ), time(1,1));
  timeline.add(player_along_path(
    svg("#player4"),
    4.5,
    svg("#move6"),
  ), time(2,3));

  //player5
  timeline.add(player_along_path(
    svg("#player5"),
    2,
    svg("#move3"),
  ), time(1,1));
  timeline.add(player_along_path(
    svg("#player5"),
    1.5,
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
    time(4,2),
    time(4,3)
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
