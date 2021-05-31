"use strict";

const basketball_animate = (settings, continuation) => {
  const svg_main = document.querySelector("#main_svg");
  svg_main.data = settings.svg_source;
  svg_main.addEventListener("load", () => {
    TweenLite.defaultOverwrite = "none";
    // positioning
    // Es gibt kein allgemeines Konzept von absoluter Position fuer svg-Elemente.
    // Die Funktionen svg_animate.tween_along_path, svg_animate.timeline_align_position
    // erlaubt absolute Positionierung,
    // wenn man ihr als letzte Argumente eine Definitionen von absoluter Position uebergibt.
    const player_absolute_position = {
      defining_element: player => player.querySelector("circle"),
      coordinate: defining_element => ({
        x: defining_element.cx.baseVal.value,
        y: defining_element.cy.baseVal.value
      })
    };
    const ball_absolute_position = player_absolute_position;
    const ball_dribbled_absolute_position = {
      defining_element: ball_absolute_position.defining_element,
      coordinate: defining_element => ({
        x: ball_absolute_position.coordinate(defining_element).x - 300,
        y: ball_absolute_position.coordinate(defining_element).y + 300
      })
    };
    const player_move_defaults = {ease: Power1.easeInOut};
    const player_move_tween = (player, move, duration, options = {}) => {
      const options_combined = Object.assign({}, player_move_defaults);
      Object.assign(options_combined, options);
      return svg_animate.along_path(
        "to",
        svg(player)[0],
        duration,
        svg(move)[0],
        options_combined,
        player_absolute_position,
      );
    };
    const player_move = (player, move, start_time, end_time, options) => {
      timeline.add(player_move_tween(player, move, end_time - start_time, options), start_time);
    };
    const center_absolute_position = {
      defining_element: center => center,
      coordinate: defining_element => {
        const start = defining_element.getPointAtLength(0);
        const end = defining_element.getPointAtLength(defining_element.getTotalLength());
        return {x: (start.x+end.x) / 2, y: (start.y+end.y) / 2};
      }
    };
    const pass_defaults = {ease: Power1.easeInOut};
    const pass = (player, receiver, start_time, end_time, options = {}) => {
      const receiver_svg = svg(receiver)[0];
      ball_throw(svg(player)[0], receiver_svg, start_time, end_time, translation_interim_result_ball => {
        timeline.seek(end_time, false);
        const options_combined = svg_animate.translation(
          translation_interim_result_ball,
          svg_animate.translation_interim_result_target(receiver_svg, player_absolute_position),
        );
        Object.assign(options_combined, pass_defaults);
        Object.assign(options_combined, options);
        return options_combined;
      });
    };
    const basket_absolute_position = {
      defining_element: basket => basket,
      coordinate: defining_element => ({
        x: defining_element.cx.baseVal.value,
        y: defining_element.cy.baseVal.value
      })
    };
    const shoot_defaults = {ease: Power1.easeInOut};
    const shoot = (player, start_time, end_time, options = {}) => {
      ball_throw(svg(player)[0], null, start_time, end_time, () => {
        const options_combined = svg_animate.translation(
          svg_animate.translation_interim_result_object(ball, ball_absolute_position),
          svg_animate.translation_interim_result_target(basket, basket_absolute_position),
        );
        Object.assign(options_combined, shoot_defaults);
        Object.assign(options_combined, options);
        return options_combined;
      });
    };
    const ball_throw =
      (player, receiver, start_time, end_time, options_generate) => {
        timeline.seek(start_time, false);
        const translation_interim_result_ball =
          svg_animate.translation_interim_result_object(ball, ball_dribbled_absolute_position);
        const start_coordinate = svg_animate.translation(
          translation_interim_result_ball,
          svg_animate.translation_interim_result_target(player_possession, player_absolute_position)
        );
        const options = options_generate(
          translation_interim_result_ball,
          start_coordinate
        );
  
        let reversed_start = false;
        timeline.addCallback(() => { // onStart cannot be used because is not executed when seeking backwards
          if (!reversed_start)
            player_possession = null;
          else
            player_possession = player;
          reversed_start = !reversed_start;
        }, start_time);
  
        timeline.fromTo( // fromTo is a workaround for a suspected GSAP bug
          ball,
          end_time - start_time,
          start_coordinate,
          options,
          start_time
        );
  
        let reversed_complete = false;
        timeline.addCallback(() => { // onComplete cannot be used because is not executed when seeking backwards
          if (!reversed_complete)
            player_possession = receiver;
          else
            player_possession = null;
          reversed_complete = !reversed_complete;
        }, end_time);
  
        timeline.seek(0, false);
      };
  
    const svg = svg_selector => svg_animate.svg_element([svg_main], svg_selector);
  
    // convert music time unit to seconds
    const time_duration =
      (bar, beat) =>
      (bar * settings.beats_per_bar + beat) * 60 / settings.beats_per_minute;
    const time =
      (bar, beat) =>
      time_duration(bar, beat) + 60 * (settings.beats_per_bar-1) / settings.beats_per_minute;
    const bars_beats =
      time => {
        const beats_total =
          Math.floor(time * settings.beats_per_minute / 60 - 2 * settings.beats_per_bar);
        return (
          beats_total >= 0
            ?
              (
                (Math.trunc(beats_total / settings.beats_per_bar)+1).toString() +
                ":" +
                (beats_total % settings.beats_per_bar + 1).toString()
              )
            : beats_total
        );
      };
  
    // can only be used with paths of which the stroke-dasharray is specified in pixels
    const path_shorten =
      (path, distance_start, distance_end) =>
      {svg_animate.path_shorten(svg(path), distance_start, distance_end);};
  
    const startup_animation_defaults = {};
    const startup_animation_timing_defaults = {delay: 1, stagger: .0625, duration: .5};
    const startup_animation = (player, options = {}) => {
      const translation_interim_result_center =
        svg_animate.translation_interim_result_target(svg("#center")[0], center_absolute_position);
      const translation_interim_result_ball =
        svg_animate.translation_interim_result_object(ball, ball_dribbled_absolute_position);
  
      const startup_animation_timing_defaults_combined =
        Object.assign({}, startup_animation_timing_defaults);
      Object.assign(startup_animation_timing_defaults_combined, options);
      // to-do. use GSAP's stagger
      svg(player).forEach(player_current => {
        const onUpdate = {};
        if (player_current === player_possession) {
          const translation_interim_result_player_target =
            svg_animate.translation_interim_result_target(player_current, player_absolute_position);
          onUpdate.onUpdate = () => {
            TweenMax.set(ball, svg_animate.translation(
              translation_interim_result_ball,
              translation_interim_result_player_target
            ));
          };
        }
        const options_combined = svg_animate.translation(
          svg_animate.translation_interim_result_object(player_current, player_absolute_position),
          translation_interim_result_center
        );
        Object.assign(options_combined, startup_animation_defaults);
        Object.assign(options_combined, options);
        options_combined.delay = startup_animation_timing_defaults_combined.delay;
        svg_animate.merge_callback_options(options_combined, onUpdate);
        TweenMax.from(
          player_current,
          startup_animation_timing_defaults_combined.duration,
          options_combined
        );
        startup_animation_timing_defaults_combined.delay += startup_animation_timing_defaults_combined.stagger;
      });
      TweenMax.set(
        ball,
        svg_animate.translation(
          translation_interim_result_ball,
          svg_animate.translation_interim_result_target(player_possession, player_absolute_position)
        )
      );
    };
  
    // initialize dom references
    const music_dom = document.querySelector("#music");
    const ball = svg("#ball")[0];
    const basket = svg("#basket")[0];
    let player_possession = svg(settings.player_possession)[0];
    music_dom.src = settings.music_source;
  
    // initialize GSAP timeline objects
    const timeline = new TimelineMax({
      paused: true,
      onUpdate: () => {
        // Interim results are calculated up front for performance.
        // The ball's interim result has to be recalculated
        // throughout the animation if the ball changes internally too.
        const translation_interim_result_ball =
          svg_animate.translation_interim_result_object(ball, ball_dribbled_absolute_position);
        if (player_possession !== null) {
          TweenMax.set(ball, svg_animate.translation(
            translation_interim_result_ball,
            svg_animate.translation_interim_result_target(player_possession, player_absolute_position)
          ));
        }
  
        position_slider.slider("value", timeline.totalProgress() * 100);
        position_display_slider.text(bars_beats(timeline.totalTime()));
      },
      onComplete: () => {
        timeline_supplementary.pause();
        music_dom.pause();
        play_button.button("option", "label", play_button_label.restart);
        // This enables the browser to start playing the music with less delay
        // because the cost of seeking is already payed.
        music_dom.currentTime = 0 + settings.music_offset;
      }
    });
    const timeline_supplementary = new TimelineMax({paused: true});
    timeline_supplementary.to(
      svg("#hand_clock"),
      settings.clock_period * 60 / settings.beats_per_minute,
      {
        rotation: "360_cw",
        transformOrigin: "50% 0%",
        ease: Power0.easeNone,
        repeat: -1
      },
      0
    );
  
    // user interface
    const play_button_label = {
      play: "Play",
      pause: "Pause",
      restart: "Restart"
    };
    const play_button_click =
      () =>
      {
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
      };
    const play_button =
      {
        button:
          (...parameters) =>
          {
            if (parameters.length === 1 && parameters[0] === "enable") {
              document.addEventListener("click", play_button_click);
              return;
            }
            if (parameters.length === 3 && parameters[0] === "option" && parameters[1] === "label") {
              return;
            }
            throw "play_button.button parameters error";
          }
      };
    $(music_dom).one("canplaythrough", () => {
      // `canplaythrough` is triggered again by seek command right below.
      $(music_dom).one("canplaythrough", () => {play_button.button("enable");});
      // In addition to starting at the correct offset,
      // this enables the browser to start playing the music with less delay
      // because the cost of seeking is already payed.
      music_dom.currentTime = 0 + settings.music_offset;
    });
    music_dom.load();
    const position_display_precise = $("#position_display_precise");
    const position_display_slider = $("#position_display_slider");
    const position_slider =
      {
        slider:
          (...parameters) =>
          {
            if (parameters.length === 2 && parameters[0] === "value") {
              return;
            }
            throw "position_slider.slider parameters error"
          }
      };
    const speed_display = $("#speed_display");
  
    // export
    continuation({
      svg,
      svg_main,
      player_move_tween,
      player_move,
      pass,
      shoot,
      timeline,
      time_duration,
      time,
      bars_beats,
      path_shorten,
      startup_animation
    });
  });
};
