// export
let
  time_generator,
  pass,
  player_along_path,
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
  time_generator = bpm => {
    const bar_duration = (60 * 4 / bpm);
    const beat_duration = (60 / bpm);
    const offset = (60 * 3 / bpm);
    return ((bar, beat) => bar * bar_duration + beat * beat_duration + offset);
  };
  svg_main = document.querySelector("#main_svg");
  let ball, player_possession;
  svg_main.addEventListener("load", () => {
    ball = svg("#ball")[0];
    player_possession = svg("#player1")[0];
  });
  // player and ball positioning
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
  pass = (player, start_time, end_time) => {
    timeline.seek(start_time);
    const interim_result_object = library.transform_outer_object(ball, absolute_position);
    timeline.seek(end_time);
    const translation = library.transform_inner(
      interim_result_object,
      library.transform_outer_target(player[0], absolute_position),
    );
    timeline.seek(0);
    let player_possession_backup_start;
    let reversed_start = false;
    timeline.addCallback(() => {
      if (!reversed_start) {
        player_possession_backup_start = player_possession;
        player_possession = null;
      }
      else
        player_possession = player_possession_backup_start;
      reversed_start = !reversed_start;
    }, start_time);
    timeline.to(
      ball,
      end_time - start_time,
      Object.assign(
        {
          "ease": Power1.easeInOut,
          "overwrite": "none"
        },
        translation
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
  player_along_path = (player, duration, path, options) => {
    const player_first = player[0];
    const interim_result_object = library.transform_outer_object(ball, absolute_position);
    const interim_result_target = library.transform_outer_target(player_first, absolute_position);
    return library.tween_along_path_gsap_bezier(
      "to",
      player_first,
      duration,
      path,
      {
        "ease": Power1.easeInOut,
        "onUpdate": () => {
          if (player_first === player_possession)
            TweenMax.set(ball, library.transform_inner(
              interim_result_object,
              interim_result_target
            ));
        }
      },
      absolute_position,
    );
  };
  const move_start = {
    "defining_element": move => move,
    "coordinate": defining_element => defining_element.getPointAtLength(0)
  };
  const move_destination = {
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
      move_start
    );
  object_to_move_destination = (object, duration, move, options) => // object can be player or ball
    library.timeline_align_position(
      "to",
      object,
      duration,
      move,
      options,
      absolute_position,
      move_destination
    );

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

  // user interface
  const music_dom = document.querySelector("#music");
  const music_restart = () => {
    music_dom.currentTime = 0;
    music_dom.play();
  };
  const play_button_label = {
    "play": "Play",
    "pause": "Pause",
    "restart": "Restart"
  };
  const play_button = $("#play").button({"label": play_button_label.play});
  const position_display_precise = $("#position_display_precise");
  play_button.on("click", () => {
    if (timeline.totalProgress() !== 1) {
      const paused = !timeline.paused();
      if (!paused)
        music_dom.play();
      else
        music_dom.pause();
      timeline.paused(paused);
      animation_supplementary.paused(paused);
      play_button.button(
        "option",
        "label",
        paused ? play_button_label.play : play_button_label.pause
      );
      if (paused)
        position_display_precise.text(timeline.totalTime() + "s");
    }
    else {
      music_restart();
      timeline.restart();
      animation_supplementary.restart();
      play_button.button("option", "label", play_button_label.pause);
    }
  });
  const position_display_slider = $("#position_display_slider");
  const position_slider = $("#position_slider").slider({
    "min": 0,
    "max": 100,
    "step": .1,
    "stop": () => {
      music_dom.currentTime = timeline.totalTime();
    },
    "slide": (event, ui) => {
      timeline.totalProgress(ui.value/100, false).pause();
      animation_supplementary.totalTime(timeline.totalTime(), false).pause();
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
      animation_supplementary.timeScale(ui.value/100);
    },
    "slide": (event, ui) => {
      speed_display.text(ui.value + "%");
    }
  });

  // svg selector function
  svg = svg_selector => library.svg_element([svg_main], svg_selector);

  // choose media
  music_set = music_path => {
    music_dom.src = music_path;
    music_dom.load();
  };
  svg_set = svg_path => {svg_main.data = svg_path;};
}
