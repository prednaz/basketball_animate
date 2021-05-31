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
  svg_source: "animation/testspielzug3.0.svg",
  music_source: "animation/september.wav",
  music_offset: 0.09,
  beats_per_minute: 120,
  beats_per_bar: 4,
  clock_period: 16,
  player_possession: "#player1"
});

svg_main.addEventListener("load", () => {
  // path_shorten("#ball2,#ball3,#ball4,#move1,#move2,#move3,#move6", 5);
  // path_shorten("#move4", 3, 0);
  // path_shorten("#move8,#move9", 0, 10);

  //player1
  player_move("#player1", "#path1.1", time(1,1), time(2,4));
  player_move("#player1", "#path1.2", time(3,1), time(4,1));

  //player2
  player_move("#player2", "#path2.1", time(1,1), time(3,1));
  player_move("#player2", "#move4", time(3,4), time(4,4));

  //player3
  player_move("#player3", "#path3.1", time(1,1), time(4,4));

  //player4
  player_move("#player4", "#path4.1", time(4,1), time(4,4));

  //player5
  player_move("#player5", "#path5.1", time(1,1), time(1,3));
  player_move("#player5", "#path5.2", time(3,1), time(4,1));


  //ball
  pass("#player1", "#player2", time(3,1), time(3,2));
  pass("#player2", "#player1", time(3,3), time(3,4));
  shoot("#player1", time(4,1), time(4, 3));

  startup_animation("#player1, #player2, #player3, #player4, #player5");
});
