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
  svg_source: "animation/testspielzug2.svg",
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
  player_move("#player1", "#move2", time(2,1), time(2,4));
  player_move("#player1", "#move1", time(3,1), time(3,4));
  player_move("#player1", "#move2", time(4,1), time(4,4));
  player_move("#player1", "#move1", time(5,1), time(5,4));

  //player2
  player_move("#player2", "#move3", time(1,1), time(2,4));
  player_move("#player2", "#move4", time(3,1), time(3,4));
  player_move("#player2", "#move5", time(4,1), time(4,4));
  player_move("#player2", "#move6", time(5,1), time(5,4));

  //player3
  player_move("#player3", "#move7", time(1,1), time(1,4));
  player_move("#player3", "#move8", time(2,1), time(2,2));
  player_move("#player3", "#move9", time(2,3), time(3,2));
  player_move("#player3", "#move7", time(3,2), time(4,1));
  player_move("#player3", "#move8", time(4,1), time(5,1));

  //player4
  player_move("#player4", "#move10", time(1,1), time(5,1));

  //player5
  player_move("#player5", "#move11", time(1,1), time(5,4));


  //ball
  pass("#player1", "#player2", time(1,3), time(1,4));
  pass("#player2", "#player3", time(2,1), time(2,2));
  pass("#player3", "#player4", time(2,3), time(2,4));
  pass("#player4", "#player5", time(3,1), time(3,2));
  pass("#player5", "#player1", time(3,3), time(3,4));
  pass("#player1", "#player5", time(4,1), time(4,2));
  shoot("#player5", time(4,4), time(5, 1));
  startup_animation("#player1, #player2, #player3, #player4, #player5");
});

// SVG elements can be selected using any CSS selector
// (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).
// It is recommended to use selector lists of ID selectors,
// for example "#id1, #id2, #id3".
