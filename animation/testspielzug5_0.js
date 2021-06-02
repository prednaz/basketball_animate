
"use strict";

basketball_animate(
  {
    svg_source: "animation/testspielzug4_0.svg",
    music_source: "animation/onedance.wav",
    music_offset: 0.09,
    beats_per_minute: 104,
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
    hide("#path1_3, #path2_2, #path3_3, #path4_3, #path5_1, #path5_2, #shot4, #curly3", 0);
    show("#path1_3, #path2_2, #path3_3, #path4_3, #path5_1, #path5_2, #shot4, #curly3", time(3,3), time(4,1));
    hide("#path1_1, #path1_2, #path2_1, #path3_1, #path3_2, #path4_1, #path4_2, #shot1, #shot2, #shot3, #curly, #curly2", time(3,3), time(4,1));
    
    //player1
    player_move("#player1", "#path1_1", time(1,1), time(1,2.5));
    player_move("#player1", "#path1_2", time(1,3), time(4,1));
    player_move("#player1", "#path1_3", time(4,1.5), time(4,3));

    //player2
    player_move("#player2", "#path2_1", time(2,1), time(3,3.5));
    player_move("#player2", "#path2_2", time(3,4), time(4,1));

    //player3
    player_move("#player3", "#path3_1", time(3,1), time(3,1.5));
    player_move("#player3", "#path3_2", time(3,2), time(3,4.5));
    player_move("#player3", "#path3_3", time(4,1.5), time(4,3));

    //player4
    player_move("#player4", "#path4_1", time(1,2.5), time(1,4));
    player_move("#player4", "#path4_2", time(3,2), time(3,4));
    player_move("#player4", "#path4_3", time(4,1), time(4,3));

    //player5
    player_move("#player5", "#path5_1", time(1,1), time(3,3));
    player_move("#player5", "#path5_2", time(3,4), time(4,1));
    player_move("#player5", "#path5_3", time(4,1.5), time(4,4));


    //ball
    pass("#player1", "#player2", time(1,2.5), time(1,3));
    pass("#player2", "#player4", time(1,4), time(1,4.5));
    pass("#player4", "#player3", time(3,1), time(3,1.5));
    pass("#player3", "#player1", time(4,1), time(4,1.5));
    shoot("#player1", time(4,4), time(4,4.5));

    startup_animation("#player1, #player2, #player3, #player4, #player5");
  }
);
