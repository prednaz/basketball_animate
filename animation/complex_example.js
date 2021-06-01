
"use strict";

basketball_animate(
  {
    svg_source: "animation/testspielzug3_0.svg",
    music_source: "animation/rockyourbody.wav",
    music_offset: 0.09,
    beats_per_minute: 101,
    beats_per_bar: 4,
    clock_period: 16,
    player_possession: "#player1"
  },
  ({
    path_shorten,
    player_move,
    player_move_tween,
    time_duration,
    time,
    bars_beats,
    timeline,
    pass,
    shoot,
    hide,
    show,
    startup_animation
  }) =>
  {
    hide("#path4_1, #path2_2, #shot2", 0);
    show("#path4_1, #path2_2, #shot2", time(3,3));
    hide("#path3_1, #path5_1, #path5_2, #path1_1, #curly, #path2_1, #shot1", time(3,3));
    
    //player1
    player_move("#player1", "#path1_1", time(1,1), time(3,2));
    player_move("#player1", "#path1_2", time(3,1), time(4,1));

    //player2
    player_move("#player2", "#path2_1", time(2,2), time(3,3));
    player_move("#player2", "#path2_2", time(3,4), time(4,4));

    //player3
    player_move("#player3", "#path3_1", time(1,4), time(3,3));

    //player4
    player_move("#player4", "#path4_1", time(3,4), time(4,2));

    //player5
    player_move("#player5", "#path5_1", time(2,1), time(2,3));
    player_move("#player5", "#path5_2", time(2,4), time(3,2));


    //ball
    pass("#player1", "#player2", time(3,1), time(3,2));
    pass("#player2", "#player1", time(3,4), time(4,1));
    shoot("#player1", time(4,1), time(4, 3));

    startup_animation("#player1, #player2, #player3, #player4, #player5");
  }
);
