// export
let
  time_generator,
  pass,
  player_move,
  object_to_move_start,
  object_to_move_destination,
  timeline,
  animation_supplementary,
  svg_main,
  clock,
  svg,
  music_set,
  svg_set;

{
  let player_possession;
  let ball;
  svg_main = document.querySelector("#main_svg");
  svg_main.addEventListener("load", () => {
    ball = svg("#ball")[0];
    player_possession = svg("#player1")[0];
  });
  time_generator = bpm => {
    const bar_duration = (60 * 4 / bpm);
    const beat_duration = (60 / bpm);
    const offset = (60 * 8 / bpm);
    return ((bar, beat) => (bar-1) * bar_duration + (beat-1) * beat_duration + offset);
  };

  // positioning
  // Es gibt kein allgemeines Konzept von absoluter Position fuer svg-Elemente.
  // Die Funktionen library.timeline_align_position, timeline_along_path_gsap_bezier
  // library.timeline_along_path_gsap_bezier, library.timeline_along_path_tweenmax
  // erlauben absolute Positionierung, wenn man ihr als letzte Argumente eine
  // Definitionen von absoluter Position uebergibt.
  const absolute_position = { // applicable to player and ball
    "defining_element": object => object.querySelector("circle"),
    "coordinate": defining_element => ({
      "x": defining_element.cx.baseVal.value,
      "y": defining_element.cy.baseVal.value
    })
  };
  const move_start_absolute_position = {
    "defining_element": move => move,
    "coordinate": defining_element => defining_element.getPointAtLength(0)
  };
  const move_destination_absolute_position = {
    "defining_element": move => move,
    "coordinate": defining_element =>
      defining_element.getPointAtLength(defining_element.getTotalLength())
  };
  object_to_move_start = (object, duration, move, options) => // object can be player or ball
    library.timeline_align_position(
      "to",
      object,
      duration,
      move,
      options,
      absolute_position,
      move_start_absolute_position
    );
  object_to_move_destination = (object, duration, move, options) => // object can be player or ball
    library.timeline_align_position(
      "to",
      object,
      duration,
      move,
      options,
      absolute_position,
      move_destination_absolute_position
    );

  player_move = (player, duration, path) => {
    // The selector function svg always returns arrays.
    const player_first = player[0];
    // Interim results are calculated up front for performance.
    // The have to be calculated during the animation
    // if object and target change internally too.
    const translation_interim_result_ball =
      library.translation_interim_result_object(ball, absolute_position);
    const translation_interim_result_player =
      library.translation_interim_result_target(player_first, absolute_position);
    return library.tween_along_path_gsap_bezier(
      "to",
      player_first,
      duration,
      path,
      {
        "ease": Power1.easeInOut,
        "onUpdate": () => {
          if (player_first === player_possession)
            TweenMax.set(ball, library.translation(
              translation_interim_result_ball,
              translation_interim_result_player
            ));
        }
      },
      absolute_position,
    );
  };
  pass = (player, start_time, end_time) => {
    timeline.seek(start_time, false);
    const translation_interim_result_ball = library.translation_interim_result_object(ball, absolute_position);
    const start_coordinate = library.translation(
      translation_interim_result_ball,
      library.translation_interim_result_target(player_possession, absolute_position)
    );
    const player_possession_previous = player_possession;

    timeline.seek(end_time, false);
    const translation = library.translation(
      translation_interim_result_ball,
      library.translation_interim_result_target(player[0], absolute_position),
    );
    timeline.seek(0, false);

    let reversed_start = false;
    timeline.addCallback(() => {
      if (!reversed_start)
        player_possession = null;
      else
        player_possession = player_possession_previous;
      reversed_start = !reversed_start;
    }, start_time-.016); // trying to make sure that the ball is detached
    // from all players early enough before the next animation
    // while staying just below the frame period of 1/60 s
    timeline.fromTo(
      ball,
      end_time - start_time,
      start_coordinate,
      Object.assign(
        translation,
        {"ease": Power1.easeInOut}
      ),
      start_time
    );
    let reversed_complete = false;
    timeline.addCallback(() => {
      if (!reversed_complete)
        player_possession = player[0];
      else
        player_possession = null;
      reversed_complete = !reversed_complete;
    }, end_time);
  };
  // const object_to_object = (object, duration, object_target, options) => // object can be player or ball
  //   library.timeline_align_position(
  //     "from",
  //     object,
  //     duration,
  //     object_target,
  //     options,
  //     absolute_position,
  //     absolute_position
  //   );
  // using TweenMax.set

  // initialize animations
  timeline = new TimelineMax({
    "paused": true,
    "onUpdate": () => {
      position_slider.slider("value", timeline.totalProgress() * 100);
      position_display_slider.text(timeline.totalTime().toFixed(1));
    },
    "onComplete": () => {
      animation_supplementary.pause();
      music_dom.pause();
      play_button.button("option", "label", play_button_label.restart);
    }
  });
  animation_supplementary = new TimelineMax({"paused": true});
  clock = bpm => {
    animation_supplementary.to(svg("#hand_clock"), 60 * 16 / bpm, {
      "rotation": "360_cw",
      "transformOrigin": "50% 0%",
      "ease": Power0.easeNone,
      "repeat": -1
    }, 0);
  };
  
  // svg selector
  svg = svg_selector => library.svg_element([svg_main], svg_selector);

  // choose media
  const music_dom = document.querySelector("#music");
  music_set = music_path => {
    music_dom.src = music_path;
    music_dom.load();
  };
  svg_set = svg_path => {svg_main.data = svg_path;};
}
