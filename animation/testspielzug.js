"use strict";

// imports
const {
  svg_main,
  path_shorten,
  svg,
  player_move,
  player_move_tween,
  time,
  time_duration,
  timeline,
  pass,
  shoot,
  startup_animation
} = basketball_animate({
  svg_source: "animation/testspielzug.svg",
  music_source: "animation/september.wav",
  music_offset: 0.09,
  beats_per_minute: 120,
  beats_per_bar: 4,
  clock_period: 16,
  player_possession: "#player1"
});

svg_main.addEventListener("load", () => {
  path_shorten(svg("#ball2,#ball3,#ball4,#move1,#move2,#move3,#move6"), 5);
  path_shorten(svg("#move4"), 3, 0);
  path_shorten(svg("#move8,#move9"), 0, 10);

  //player1
  player_move(1, 1, time(1,1), time(1,4));
  timeline.add(player_move_tween(1, 2, time(4,3) - time(2,1)), time(2,1));

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
  pass(5, time(1,3), time(1,4));
  pass(2, time(2,2), time(2,3)); // to-do. add explicit sender
  pass(4, time(3,2), time(3,3));
  shoot(time(4,4), time(5, 1));
  startup_animation("#player1, #player2, #player3, #player4, #player5");
});
