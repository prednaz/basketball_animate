music_set("animation/september.wav");
svg_set("animation/testspielzug.svg");
bpm_set(120);

svg_main.addEventListener("load", () => {
  path_shorten(svg("svg > path"), 42, 5);
  clock();

  //player1
  timeline.add(player_move(1, time(3), 1), time(1,1));
  timeline.add(player_move(1, time(10), 2), time(2,1));

  //player3
  timeline.add(player_move(3, time(3), 7), time(1,1));
  timeline.add(player_move(3, time(13), 8), time(1,4));

  //player4
  timeline.add(player_move(4, time(3), 5), time(1,1));
  timeline.add(player_move(4, time(9), 6), time(2,3));

  //player5
  timeline.add(player_move(5, time(4), 3), time(1,1));
  timeline.add(player_move(5, time(3), 4), time(2,3));

  //ball
  pass(5, time(1,4), time(2,1));
  pass(2, time(2,2), time(2,3));
  pass(4, time(3,2), time(3,3));
  shoot(time(4,4), time(5, 1));
});
// test
