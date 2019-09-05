// export
let
  svg_main,
  initialize,
  player_to_move_start,
  player_to_move_destination,
  player_move,
  pass,
  shoot,
  timeline,
  animation_supplementary,
  clock,
  time,
  time_duration,
  player_possession_set,
  svg,
  music_set,
  svg_set,
  bpm_set,
  path_shorten;

{
  // initialize
  svg_main = document.querySelector("#main_svg");
  let ball, basket;
  svg_main.addEventListener("load", () => {
    ball = svg("#ball")[0];
    basket = svg("#basket")[0];
  });
  const player_svg = player => svg("#player" + player);
  const move_svg = move => svg("#move" + move);

  const initialize_defaults = {};
  const initialize_timing_defaults = {"delay": 1, "stagger": .0625, "duration": .5};
  initialize = (player, options = {}) => {
    const translation_interim_result_center =
      library.translation_interim_result_target(svg("#center")[0], center_absolute_position);
    const translation_interim_result_ball =
      library.translation_interim_result_object(ball, ball_dribbled_absolute_position);

    const initialize_timing_defaults_combined =
      Object.assign({}, initialize_timing_defaults);
    Object.assign(initialize_timing_defaults_combined, options);
    player.map(player_svg).forEach(player_current => {
      const player_first = player_current[0];
      const onUpdate = {};
      if (player_first === player_possession) {
        const translation_interim_result_player_target =
          library.translation_interim_result_target(player_first, player_absolute_position);
        onUpdate.onUpdate = () => {
          TweenMax.set(ball, library.translation(
            translation_interim_result_ball,
            translation_interim_result_player_target
          ));
        };
      }
      const options_combined = library.translation(
        library.translation_interim_result_object(player_first, player_absolute_position),
        translation_interim_result_center
      );
      Object.assign(options_combined, initialize_defaults);
      Object.assign(options_combined, options);
      Object.assign(options_combined, {"delay": initialize_timing_defaults_combined.delay});
      library.merge_callback_options(options_combined, onUpdate);
      TweenMax.from(
        player_current,
        initialize_timing_defaults_combined.duration,
        options_combined
      );
      initialize_timing_defaults_combined.delay += initialize_timing_defaults_combined.stagger;
    });
    TweenMax.set(
      ball,
      library.translation(
        translation_interim_result_ball,
        library.translation_interim_result_target(player_possession, player_absolute_position)
      )
    );
  };

  // positioning
  // Es gibt kein allgemeines Konzept von absoluter Position fuer svg-Elemente.
  // Die Funktionen library.timeline_align_position, timeline_along_path_gsap_bezier
  // library.timeline_along_path_gsap_bezier, library.timeline_along_path_tweenmax
  // erlauben absolute Positionierung, wenn man ihr als letzte Argumente eine
  // Definitionen von absoluter Position uebergibt.
  const player_absolute_position = {
    "defining_element": player => player.querySelector("circle"),
    "coordinate": defining_element => ({
      "x": defining_element.cx.baseVal.value,
      "y": defining_element.cy.baseVal.value
    })
  };
  const move_start_absolute_position = {
    "defining_element": move => move,
    "coordinate": defining_element => defining_element.getPointAtLength(0)
  };
  player_to_move_start = (player, duration, move, options) =>
    library.timeline_align_position(
      "to",
      player_svg(player),
      duration,
      move_svg(move),
      options,
      player_absolute_position,
      move_start_absolute_position
    );
  const move_destination_absolute_position = {
    "defining_element": move => move,
    "coordinate": defining_element =>
      defining_element.getPointAtLength(defining_element.getTotalLength())
  };
  player_to_move_destination = (player, duration, move, options) =>
    library.timeline_align_position(
      "to",
      player_svg(player),
      duration,
      move_svg(move),
      options,
      player_absolute_position,
      move_destination_absolute_position
    );
  const ball_absolute_position = player_absolute_position;
  const ball_dribbled_absolute_position = {
    "defining_element": ball_absolute_position.defining_element,
    "coordinate": defining_element => ({
      "x": ball_absolute_position.coordinate(defining_element).x - 300,
      "y": ball_absolute_position.coordinate(defining_element).y + 300
    })
  };
  const player_move_defalts = {"ease": Power1.easeInOut};
  player_move = (player, duration, move, options = {}) => {
    // The selector function svg always returns arrays.
    const player_first = player_svg(player)[0];
    // Interim results are calculated up front for performance.
    // The have to be calculated during the animation
    // if object and target change internally too.
    const translation_interim_result_ball =
      library.translation_interim_result_object(ball, ball_dribbled_absolute_position);
    const translation_interim_result_player =
      library.translation_interim_result_target(player_first, player_absolute_position);
    const options_combined = Object.assign({}, player_move_defalts);
    Object.assign(options_combined, options);
    library.merge_callback_options(
      options_combined,
      {"onUpdate": () => {
        if (player_first === player_possession)
          TweenMax.set(ball, library.translation(
            translation_interim_result_ball,
            translation_interim_result_player
          ));
      }}
    );
    return library.tween_along_path_gsap_bezier(
      "to",
      player_first,
      duration,
      move_svg(move),
      options_combined,
      player_absolute_position,
    );
  };
  const center_absolute_position = {
    "defining_element": center => center,
    "coordinate": defining_element => {
      const start = defining_element.getPointAtLength(0);
      const end = defining_element.getPointAtLength(defining_element.getTotalLength());
      return {"x": (start.x+end.x) / 2, "y": (start.y+end.y) / 2};
    }
  };
  const pass_defalts = {"ease": Power1.easeInOut};
  pass = (receiver, start_time, end_time, options = {}) => {
    const receiver_svg = player_svg(receiver)[0];
    ball_throw(start_time, end_time, receiver_svg, translation_interim_result_ball => {
      timeline.seek(end_time, false);
      const options_combined = library.translation(
        translation_interim_result_ball,
        library.translation_interim_result_target(receiver_svg, player_absolute_position),
      );
      Object.assign(options_combined, pass_defalts);
      Object.assign(options_combined, options);
      return options_combined;
    }, ball_dribbled_absolute_position);
  };
  const basket_absolute_position = {
    "defining_element": basket => basket,
    "coordinate": defining_element => ({
      "x": defining_element.cx.baseVal.value,
      "y": defining_element.cy.baseVal.value
    })
  };
  const shoot_defaults = {"ease": Power1.easeInOut};
  shoot = (start_time, end_time, options = {}) => {
    ball_throw(start_time, end_time, null, translation_interim_result_ball => {
      const options_combined = library.translation(
        translation_interim_result_ball,
        library.translation_interim_result_target(basket, basket_absolute_position),
      );
      Object.assign(options_combined, shoot_defaults);
      Object.assign(options_combined, options);
      return options_combined;
    }, ball_absolute_position);
  };
  const ball_throw =
    (start_time, end_time, receiver, options_generate, ball_absolute_position) => {
      timeline.seek(start_time, false);
      const translation_interim_result_ball =
        library.translation_interim_result_object(ball, ball_absolute_position);
      const start_coordinate = library.translation(
        translation_interim_result_ball,
        library.translation_interim_result_target(player_possession, player_absolute_position)
      );
      const player_possession_previous = player_possession;
      const options = options_generate(
        translation_interim_result_ball,
        player_possession_previous,
        start_coordinate
      );

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

      timeline.fromTo( // fromTo is a workaround for a suspected GSAP bug
        ball,
        end_time - start_time,
        start_coordinate,
        options,
        start_time
      );

      let reversed_complete = false;
      timeline.addCallback(() => {
        if (!reversed_complete)
          player_possession = receiver;
        else
          player_possession = null;
        reversed_complete = !reversed_complete;
      }, end_time);

      timeline.seek(0, false);
    };

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
  clock = () => {
    animation_supplementary.to(svg("#hand_clock"), 60 * 16 / bpm, {
      "rotation": "360_cw",
      "transformOrigin": "50% 0%",
      "ease": Power0.easeNone,
      "repeat": -1
    }, 0);
  };

  // convert music time unit to seconds
  time = (bar, beat) => time_duration(bar, beat) + 60 * 3 / bpm;
  time_duration = (bar, beat) => (bar * 4 + beat) * 60 / bpm;

  // player in possesion of the ball
  let player_possession;
  player_possession_set = player => {player_possession = player_svg(player)[0];};

  // svg selector
  svg = svg_selector => library.svg_element([svg_main], svg_selector);

  // choose media
  const music_dom = document.querySelector("#music");
  music_set = music_path => {
    music_dom.src = music_path;
    music_dom.load();
  };
  svg_set = svg_path => {svg_main.data = svg_path;};
  let bpm;
  bpm_set = bpm_new => {bpm = bpm_new;};

  // can only be used with paths of which the stroke-dasharray is specified in pixels
  path_shorten = (path, distance_start, distance_end) => {
    library.path_shorten(path, distance_start, distance_end);
  };
}
