music_set("animation/september.wav");
svg_set("animation/test2.svg");

const ball_absolute_position = {
  "defining_element": ball => ball.querySelector("circle"),
  "coordinate": defining_element => ({
    "x": defining_element.cx.baseVal.value,
    "y": defining_element.cy.baseVal.value
  })
};

const ball_to_ball = (ball, duration, ball_target, options) =>
  library.timeline_align_position(
    "to",
    ball,
    duration,
    ball_target,
    options,
    ball_absolute_position,
    ball_absolute_position
  );

const ball_along_path = (ball, duration, path, options) =>
  library.timeline_along_path(
    "to",
    ball,
    duration,
    path,
    options,
    ball_absolute_position,
    svg_main
  );

svg_main.addEventListener("load", () => {
  timeline.add(ball_along_path(
    svg("#ball2"),
    3,
    svg("#move1"),
    {ease: Power0.easeNone}
  ), 0);

  // timeline.add(ball_along_path(
  //   svg("#ball1"),
  //   5,
  //   svg("#move1"),
  //   {ease: Power0.easeNone}
  // ));
  // timeline.add(ball_along_path(
  //   svg("#ball2"),
  //   5,
  //   svg("#move1"),
  //   {ease: Power0.easeNone, delay:1}
  // ), 0);
  // timeline.seek(2);
  // timeline.add(ball_to_ball(
  //   svg("#ball2"),
  //   2,
  //   svg("#ball1"),
  //   {ease: Power0.easeNone}
  // ), 0);
  // timeline.seek(0);
});
