// export
let
  play_button,
  play_button_label,
  position_slider,
  position_display_slider;
{
  const music_dom = $("#music")[0];
  const music_restart = () => {
    music_dom.currentTime = 0;
    music_dom.play();
  };
  play_button_label = {
    "play": "Play",
    "pause": "Pause",
    "restart": "Restart"
  };
  play_button = $("#play").button({"label": play_button_label.play});
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
      timeline.restart(false, false);
      animation_supplementary.restart(false, false);
      play_button.button("option", "label", play_button_label.pause);
    }
  });
  position_display_slider = $("#position_display_slider");
  position_slider = $("#position_slider").slider({
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
}
