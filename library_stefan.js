// export
let
  // player_to_absolute_position,
  // ball_to_absolute_position,
  // player_along_path,
  // ball_along_path,
  timeline,
  animation_supplementary,
  svg_main,
  clock,
  svg,
  music_set,
  svg_set;

{
  // player and ball positioning
  // Es gibt kein allgemeines Konzept von absoluter Position fuer svg-Elemente.
  // Die Funktin library.timeline_absolute_position erlaubt absolute Positionierung,
  // wenn man ihr als letztes Argument eine Definition von absoluter Position uebergibt.
  player_to_absolute_position = (element, duration, value) =>
    library.timeline_absolute_position("to", element, duration, value, player_absolute_position);
  const player_absolute_position = player => ({
    "x": player.querySelector("circle").cx.baseVal.value,
    "y": player.querySelector("circle").cy.baseVal.value
  });
  ball_to_absolute_position = (element, duration, value) =>
    library.timeline_absolute_position("to", element, duration, value, ball_absolute_position);
  const ball_absolute_position = ball => ({
    "x": 0.02542068*ball.querySelector("circle").cx.baseVal.value,
    "y": 0.02542067*ball.querySelector("circle").cy.baseVal.value + 10
  });
  // const player_from_absolute_position =
  //   (element, duration, value) =>
  //   library.timeline_absolute_position("from", element, duration, value, player_absolute_position);
  player_along_path = (element, duration, path, value) =>
    library.timeline_along_path("to", element, duration, path, value, player_absolute_position);
  ball_along_path = (element, duration, path, value) =>
    library.timeline_along_path("to", element, duration, path, value, ball_absolute_position);

  // initialize animations
  timeline = new TimelineMax({
    "paused": true,
    "onUpdate": () => {
      position_slider.slider("value", timeline.progress() * 100);
      position_display_slider.text(timeline.totalTime().toFixed(1));
    },
    "onComplete": () => {
      animation_supplementary.pause();
      music_dom.pause();
      play_button.button("option", "label", play_button_label.restart);
    }
  });
  animation_supplementary = new TimelineMax({"paused": true});
  svg_main = document.querySelector("#main_svg");
  clock = period => {
    animation_supplementary.to(svg("#hand_clock"), period, {
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
      timeline.totalProgress(ui.value/100).pause();
      animation_supplementary.totalTime(timeline.totalTime()).pause();
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
