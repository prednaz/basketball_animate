"use strict";

// imports
const {
  svg_main,
  path_shorten,
  player_move,
  player_move_tween,
  time_duration,
  time,
  bars_beats,
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
  path_shorten("#ball2,#ball3,#ball4,#move1,#move2,#move3,#move6", 5);
  path_shorten("#move4", 3, 0);
  path_shorten("#move8,#move9", 0, 10);

  //player1
  player_move("#player1", "#move1", time(1,1), time(1,4));
  timeline.add(player_move_tween("#player1", "#move2", time(4,3) - time(2,1)), time(2,1));

  //player3
  timeline.add(player_move_tween("#player3", "#move7", time_duration(0,3)), time(1,1));
  timeline.add(player_move_tween("#player3", "#move8", time_duration(0,13)), time(1,4));

  //player4
  timeline.add(player_move_tween("#player4", "#move5", time_duration(0,3)), time(1,1));
  timeline.add(player_move_tween("#player4", "#move6", time_duration(0,9)), time(2,3));

  //player5
  timeline.add(player_move_tween("#player5", "#move3", time_duration(0,4)), time(1,1));
  timeline.add(player_move_tween("#player5", "#move4", time_duration(0,3)), time(2,3));

  //ball
  pass("#player1", "#player5", time(1,3), time(1,4));
  pass("#player5", "#player2", time(2,2), time(2,3));
  pass("#player2", "#player4", time(3,2), time(3,3));
  shoot("#player4", time(4,4), time(5, 1));
  startup_animation("#player1, #player2, #player3, #player4, #player5");
});
