music_set("animation/september.wav");
svg_set("animation/testspielzug.svg");

svg_main.addEventListener("load", () => {
  clock_period(8);

// });
//
// $(window).on("load", () => { // wait for svg and libraries to be loaded

//musical metric

timeline.add(
    "1.1", "+=4"
)

timeline.add(
    "1.2", "+=4.5"
)

timeline.add(
    "1.3", "+=5.0"
)

timeline.add(
    "1.4", "+=5.5"
)

timeline.add(
    "2.1", "+=6.0"
)

timeline.add(
    "2.2", "+=6.5"
)

timeline.add(
    "2.3", "+=7.0"
)

timeline.add(
    "2.4", "+=7.5"
)

timeline.add(
    "3.1", "+=8.0"
)

timeline.add(
    "3.2", "+=8.5"
)

timeline.add(
    "3.3", "+=9.0"
)

timeline.add(
    "3.4", "+=9.5"
)

timeline.add(
    "4.1", "+=10.0"
)

timeline.add(
    "4.2", "+=10.5"
)

timeline.add(
    "4.3", "+=11.0"
)

timeline.add(
    "4.4", "+=11.5"
)

timeline.add(
    "5.1", "+=12.0"
)

timeline.add(
    "5.2", "+=12.5"
)

timeline.add(
    "5.3", "+=13.0"
)



//player1

timeline.add(
    player_along_path(
    svg("#player1"),
    1.5,
    svg("#move1"),
    {ease: Power1.easeInOut}
  ), "1.1"
)

  timeline.add(
      player_along_path(
      svg("#player1"),
      5,
      svg("#move2"),
      {ease: Power1.easeInOut}
    ), "2.1"
)

//player2

//player3

timeline.add(
    player_along_path(
    svg("#player3"),
    1.5,
    svg("#move7"),
    {ease: Power1.easeInOut}
  ), "1.1"
)

timeline.add(
    player_along_path(
    svg("#player3"),
    6.5,
    svg("#move8"),
    {ease: Power1.easeInOut}
  ), "1.4"
)

//player4

timeline.add(
    player_along_path(
    svg("#player4"),
    1.5,
    svg("#move5"),
    {ease: Power1.easeInOut}
  ), "1.1"
)

timeline.add(
    player_along_path(
    svg("#player4"),
    4.5,
    svg("#move6"),
    {ease: Power1.easeInOut}
  ), "2.3"
)

//player5

timeline.add(
    player_along_path(
    svg("#player5"),
    2,
    svg("#move3"),
    {ease: Power1.easeInOut}
  ), "1.1"
)

timeline.add(
    player_along_path(
    svg("#player5"),
    1.5,
    svg("#move4"),
    {ease: Power1.easeInOut}
  ), "2.3"
)

//ball

    timeline.add(
        ball_along_path(
        svg("#ball"),
        1.5,
        svg("#move1"),
        {ease: Power1.easeInOut}
      ), "1.1"
  )

  timeline.add(
      ball_along_path(
      svg("#ball"),
      0.5,
      svg("#ball2"),
      {ease: Power1.easeInOut}
    ), "1.4"
)

timeline.add(
    ball_along_path(
    svg("#ball"),
    0.5,
    svg("#ball2"),
    {ease: Power1.easeInOut}
  ), "1.4"
)

timeline.add(
    ball_along_path(
    svg("#ball"),
    0.5,
    svg("#ball3"),
    {ease: Power1.easeInOut}
  ), "2.2"
)

timeline.add(
    ball_along_path(
    svg("#ball"),
    0.5,
    svg("#ball4"),
    {ease: Power1.easeInOut}
  ), "4.2"
)

timeline.add(
    ball_along_path(
    svg("#ball"),
    0.5,
    svg("#ball5"),
    {ease: Power1.easeInOut}
  ), "4.4"
)


  // timeline
  //   .add(player_to_absolute_position(
  //     svg("#player1,#ball"),
  //     1,
  //     { x: 584.2247314453125, y: 332.03375244140625 }
  //     // player_absolute_position(svg("#player1")[0])
  //   ));
  //   // .to(
  //   //   svg("#ball"),
  //   //   2,
  //   //   {rotation: "2160_ccw", transformOrigin: "50% 50%", ease: Sine.easeOut}, // Power0.easeNone
  //   //   0
  //   // );

//PHILIPP BEISPIEL

//  timeline.add(player_along_path(
//    svg("#player1"),
//    2,
//    svg("#move6"),
//    {ease: Power0.easeNone}
//  ))
//  .add(ball_along_path(
//    svg("#ball"),
//    2,
//    svg("#move6"),
//    {ease: Power0.easeNone}
//  ), 0);



  // m 585.31495,235.85667 c -17.40581,38.78137 -81.5021,39.19148 -88.04938,40.50094
  // timeline.to(
  //   svg("#player1"),
  //   1,
  //   {
  //     bezier: {
  //       type: "cubic",
  //       values: [
  //         convert_to_relative({x: 585.31495, y: 235.85667}, player_absolute_position(svg("#player1")[0])),
  //         {x:"-=17.40581", y:"+=38.78137"},
  //         {x:"-=81.5021", y:"+=39.19148"},
  //         {x:"-=88.04938", y:"+=40.50094"}
  //       ]
  //     }
  //   }
  // );

  // timeline
  //   .add(player_to_absolute_position(svg("#player1, #player2"), 2, {x: 208.49426,y:50.5, ease: Power2.easeInOut}))
  //   .to(svg("#player1, #player2, #ball"), 3.4, {x:"+=390.25675",y:"+=0", ease: Power1.easeIn})
  //   .to(svg("#player2, #ball"), 2, {x:"+=0",y:"+=367.65968", ease: Power0.easeNone})
  //   .to(svg("#player2"), 3.4, {x:"+=-390.86749",y:"+=0", ease: Power1.easeOut});
});
