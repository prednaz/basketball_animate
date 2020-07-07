"use strict";

const basketball_animate = settings => {
  // positioning
  // Es gibt kein allgemeines Konzept von absoluter Position fuer svg-Elemente.
  // Die Funktionen library.tween_along_path erlaubt absolute Positionierung,
  // wenn man ihr als letzte Argumente eine Definitionen von absoluter Position uebergibt.
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
  const player_to_move_start = (player, duration, move, options) =>
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
  const player_to_move_destination = (player, duration, move, options) =>
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
  const player_move_defaults = {"ease": Power1.easeInOut};
  const player_move_tween = (player, move, duration, options = {}) => {
    // The selector function svg always returns arrays.
    const player_first = player_svg(player)[0];
    // Interim results are calculated up front for performance.
    // The ball's interim result has to be recalculated
    // throughout the animation if the ball changes internally too.
    const translation_interim_result_ball =
      library.translation_interim_result_object(ball, ball_dribbled_absolute_position);
    const translation_interim_result_player =
      library.translation_interim_result_target(player_first, player_absolute_position);
    const options_combined = Object.assign({}, player_move_defaults);
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
  const player_move = (player, move, start_time, end_time, options) => {
    timeline.add(player_move_tween(player, move, end_time - start_time, options), start_time);
  };
  const center_absolute_position = {
    "defining_element": center => center,
    "coordinate": defining_element => {
      const start = defining_element.getPointAtLength(0);
      const end = defining_element.getPointAtLength(defining_element.getTotalLength());
      return {"x": (start.x+end.x) / 2, "y": (start.y+end.y) / 2};
    }
  };
  const pass_defaults = {"ease": Power1.easeInOut};
  const pass = (receiver, start_time, end_time, options = {}) => {
    const receiver_svg = player_svg(receiver)[0];
    ball_throw(start_time, end_time, receiver_svg, translation_interim_result_ball => {
      timeline.seek(end_time, false);
      const options_combined = library.translation(
        translation_interim_result_ball,
        library.translation_interim_result_target(receiver_svg, player_absolute_position),
      );
      Object.assign(options_combined, pass_defaults);
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
  const shoot = (start_time, end_time, options = {}) => {
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
      timeline.addCallback(() => { // to-do. try onStart, onComplete instead
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

  const svg = svg_selector => library.svg_element([svg_main], svg_selector);
  const player_svg = player => svg("#player" + player); // to-do. dispose of
  const move_svg = move => svg("#move" + move); // to-do. dispose of

    // convert music time unit to seconds
  const time =
    (bar, beat) =>
    time_duration(bar, beat) + 60 * (settings.beats_per_bar-1) / settings.beats_per_minute;
  const time_duration =
    (bar, beat) =>
    (bar * settings.beats_per_bar + beat) * 60 / settings.beats_per_minute;

  // can only be used with paths of which the stroke-dasharray is specified in pixels
  const path_shorten =
    (path, distance_start, distance_end) =>
    {library.path_shorten(path, distance_start, distance_end);};

  const startup_animation_defaults = {};
  const startup_animation_timing_defaults = {"delay": 1, "stagger": .0625, "duration": .5};
  const startup_animation = (player, options = {}) => {
    const translation_interim_result_center =
      library.translation_interim_result_target(svg("#center")[0], center_absolute_position);
    const translation_interim_result_ball =
      library.translation_interim_result_object(ball, ball_dribbled_absolute_position);

    const startup_animation_timing_defaults_combined =
      Object.assign({}, startup_animation_timing_defaults);
    Object.assign(startup_animation_timing_defaults_combined, options);
    // to-do. use GSAP's stagger
    svg(player).forEach(player_current => {
      const onUpdate = {};
      if (player_current === player_possession) {
        const translation_interim_result_player_target =
          library.translation_interim_result_target(player_current, player_absolute_position);
        onUpdate.onUpdate = () => {
          TweenMax.set(ball, library.translation(
            translation_interim_result_ball,
            translation_interim_result_player_target
          ));
        };
      }
      const options_combined = library.translation(
        library.translation_interim_result_object(player_current, player_absolute_position),
        translation_interim_result_center
      );
      Object.assign(options_combined, startup_animation_defaults);
      Object.assign(options_combined, options);
      options_combined.delay = startup_animation_timing_defaults_combined.delay;
      library.merge_callback_options(options_combined, onUpdate);
      TweenMax.from(
        player_current,
        startup_animation_timing_defaults_combined.duration,
        options_combined
      );
      startup_animation_timing_defaults_combined.delay += startup_animation_timing_defaults_combined.stagger;
    });
    TweenMax.set(
      ball,
      library.translation(
        translation_interim_result_ball,
        library.translation_interim_result_target(player_possession, player_absolute_position)
      )
    );
  };

    // initialize dom references
  const svg_main = document.querySelector("#main_svg");
  const music_dom = document.querySelector("#music");
  let ball, basket, player_possession;
  svg_main.addEventListener("load", () => {
    ball = svg("#ball")[0];
    basket = svg("#basket")[0];
    player_possession = svg(settings.player_possession)[0];
  });
  svg_main.data = settings.svg_source;
  music_dom.src = settings.music_source;

  // initialize GSAP timeline objects
  const timeline = new TimelineMax({
    "paused": true,
    "onUpdate": () => {
      position_slider.slider("value", timeline.totalProgress() * 100);
      position_display_slider.text(timeline.totalTime().toFixed(1));
    },
    "onComplete": () => {
      timeline_supplementary.pause();
      music_dom.pause();
      play_button.button("option", "label", play_button_label.restart);
      // This enables the browser to start playing the music with less delay
      // because the cost of seeking is already payed.
      music_dom.currentTime = 0 + settings.music_offset;
    }
  });
  const timeline_supplementary = new TimelineMax({"paused": true});
  svg_main.addEventListener("load", () => {
    timeline_supplementary.to(
      svg("#hand_clock"),
      settings.clock_period * 60 / settings.beats_per_minute,
      {
        "rotation": "360_cw",
        "transformOrigin": "50% 0%",
        "ease": Power0.easeNone,
        "repeat": -1
      },
      0
    );
  });

  // user interface
  const play_button_label = {
    "play": "Play",
    "pause": "Pause",
    "restart": "Restart"
  };
  const play_button = $("#play").button({"label": play_button_label.play, "disabled": true});
  $(music_dom).one("canplaythrough", () => {
    $(music_dom).one("canplaythrough", () => {play_button.button("enable");});
    // In addition to starting at the correct offset,
    // this enables the browser to start playing the music with less delay
    // because the cost of seeking is already payed.
    music_dom.currentTime = 0 + settings.music_offset;
  });
  music_dom.load();
  const position_display_precise = $("#position_display_precise");
  play_button.on("click", () => {
    if (timeline.totalProgress() !== 1) {
      const paused = !timeline.paused();
      music_dom[paused ? "pause" : "play"]();
      timeline.paused(paused);
      timeline_supplementary.paused(paused);
      play_button.button(
        "option",
        "label",
        paused ? play_button_label.play : play_button_label.pause
      );
      if (paused)
        position_display_precise.text(timeline.totalTime() + "s");
    }
    else {
      music_dom.play();
      timeline.restart(true, false);
      timeline_supplementary.restart(true, false);
      play_button.button("option", "label", play_button_label.pause);
    }
  });
  const position_display_slider = $("#position_display_slider");
  const position_slider = $("#position_slider").slider({
    "min": 0,
    "max": 100,
    "step": .1,
    "stop": () => {
      music_dom.currentTime = timeline.totalTime() + settings.music_offset;
    },
    "slide": (event, ui) => {
      timeline.pause();
      timeline.totalProgress(ui.value/100, false);
      timeline_supplementary.pause();
      timeline_supplementary.totalTime(timeline.totalTime(), false);
      position_display_slider.text(timeline.totalTime().toFixed(1));
      position_display_precise.text(timeline.totalTime() + "s");
      music_dom.pause();
      play_button.button("option", "label", play_button_label.play);
    }
  });
  const speed_display = $("#speed_display");
  $("#speed_slider").slider({
    "min": 0,
    "max": 300,
    "step": 1,
    "value": 100,
    "change": (event, ui) => {
      music_dom.playbackRate = ui.value / 100;
      timeline.timeScale(ui.value/100);
      timeline_supplementary.timeScale(ui.value/100);
    },
    "slide": (event, ui) => {
      speed_display.text(ui.value + "%");
    }
  });

  // export
  return ({
    svg,
    svg_main,
    player_to_move_start,
    player_to_move_destination,
    player_move_tween,
    player_move,
    pass,
    shoot,
    timeline,
    time,
    time_duration,
    path_shorten,
    startup_animation
  });
};
