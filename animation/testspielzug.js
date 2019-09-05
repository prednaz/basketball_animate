music_set("animation/september.wav");
svg_set("animation/testspielzug.svg");
bpm_set(120);
beats_per_bar_set(4);

svg_main.addEventListener("load", () => {
  path_shorten(svg("#ball2,#ball3,#ball4,#move1,#move2,#move3,#move6"), 5);
  path_shorten(svg("#move4"), 3, 0);
  path_shorten(svg("#move8,#move9"), 0, 10);
  clock();

  //player1
  player_move(1, 1, time(1,1), time(1,4));
  timeline.add(player_move_tween(1, 2, time_duration(2,2)), time(2,1));

  //player3
  timeline.add(player_move_tween(3, 7, time_duration(0,3)), time(1,1));
  timeline.add(player_move_tween(3, 8, time_duration(0,13)), time(1,4));

  //player4
  timeline.add(player_move_tween(4, 5, time_duration(0,3)), time(1,1));
  timeline.add(player_move_tween(4, 6, time_duration(0,9)), time(2,3));

  //player5
  timeline.add(player_move_tween(5, 3, time_duration(0,4)), time(1,1));
  timeline.add(player_move_tween(5, 4, time_duration(0,3)), time(2,3));

  //ball
  player_possession_set(1);
  pass(5, time(1,3), time(1,4));
  pass(2, time(2,2), time(2,3));
  pass(4, time(3,2), time(3,3));
  shoot(time(4,4), time(5, 1));
  initialize([1,2,3,4,5]);
});
