// export
let
  play_button,
  play_button_label,
  position_slider,
  position_display_slider;
{
  const music_offset = .09;
  music_dom = $("#music")[0];
  // In addition to starting at the correct offset,
  // this enables the browser to start playing the music with less delay
  // because the cost of seeking is already payed.
  music_dom.currentTime = 0 + music_offset;
  play_button_label = {
    "play": "Play",
    "pause": "Pause",
    "restart": "Restart"
  };
  play_button = $("#play").button({"label": play_button_label.play, "disabled": true});
  $(music_dom).on("canplaythrough", () => {play_button.button("enable");});
  const position_display_precise = $("#position_display_precise");
  play_button.on("click", () => {
    if (timeline.totalProgress() !== 1) {
      const paused = !timeline.paused();
      music_dom[paused ? "pause" : "play"]();
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
      $(music_dom).one("canplaythrough", () => setTimeout(() => {
        music_dom.play();
        timeline.restart(true, false);
        animation_supplementary.restart(true, false);
        play_button.button("option", "label", play_button_label.pause);
      }, 500));
      music_dom.currentTime = 0 + music_offset; // to-do. Do this on completion of the timeline and then remove the delay of the above code.
    }
  });
  position_display_slider = $("#position_display_slider");
  position_slider = $("#position_slider").slider({
    "min": 0,
    "max": 100,
    "step": .1,
    "stop": () => {
      music_dom.currentTime = timeline.totalTime() + music_offset;
    },
    "slide": (event, ui) => {
      timeline.pause();
      timeline.totalProgress(ui.value/100, false);
      animation_supplementary.pause();
      animation_supplementary.totalTime(timeline.totalTime(), false);
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
}
