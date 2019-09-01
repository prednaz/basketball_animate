// requires manually importing Snap and exporting additional library functions as follows
// library.transformation_matrix = transformation_matrix;
// library.translation_interim_result_object = translation_interim_result_object;
// library.translation = translation;
// library.translation_interim_result_target = translation_interim_result_target;

const library2 = {};
{
  const timeline_align_position_static_start =
    (
      object,
      duration,
      target,
      options,
      object_absolute_position,
      target_absolute_position
    ) => {
      const interim_result_target = library.translation_interim_result_target(target[0], target_absolute_position);
      const timeline = new TimelineMax();
      object.forEach(object_current => {
        const transformation_animated = library.transformation_matrix(
          object_current,
          object_current.parentElement
        );
        const interim_result_object = library.translation_interim_result_object(object_current, object_absolute_position);
        timeline.fromTo(
          object_current,
          duration,
          {
            "x": transformation_animated.e,
            "y": transformation_animated.f
          },
          Object.assign(
            library.translation(
              interim_result_object,
              interim_result_target
            ),
            options
          ),
          0
        );
      });
      return timeline;
    };
  const coordinate_2d = unstructured => {
    const x1 = unstructured.filter((element, index) => index > 0 && index%2 === 1);
    const x2 = unstructured.filter((element, index) => index > 0 && index%2 === 0);
    return x1.map((value, index) => ({"x": value, "y": x2[index]}));
  };
  const bezier = path =>
    Array.prototype.concat.apply(
      [],
      Snap.path.toCubic(path.getAttribute("d")).map(coordinate_2d)
    );
  const timeline_along_path_gsap_bezier = // preserves options argument owing to Object.assign
    (function_name, object, duration, path, options, object_absolute_position) => {
      const timeline = new TimelineMax();
      object.forEach(object_current => {
        const options_current = Object.assign({}, options);
        const interim_result_object = library.translation_interim_result_object(object_current, object_absolute_position);
        options_current.bezier = {
          "type": "cubic",
          "values": bezier(path[0]).map(coordinate =>
            library.translation(
              interim_result_object,
              {
                "defining_element": path[0],
                "defining_element_coordinate": coordinate
              }
            )
          )
        };
        timeline[function_name](
          object_current,
          duration,
          options_current,
          0
        );
      });
      return timeline;
    };
  // export
  library2.timeline_align_position_static_start = timeline_align_position_static_start;
  library2.timeline_along_path_gsap_bezier = timeline_along_path_gsap_bezier;
}

const absolute_position = { // applicable to player and ball
  "defining_element": object => object.querySelector("circle"),
  "coordinate": defining_element => ({
    "x": defining_element.cx.baseVal.value,
    "y": defining_element.cy.baseVal.value
  })
};
along_path = (object, duration, path, options) => // object can be player or ball
  library2.timeline_along_path_gsap_bezier(
    "to",
    object,
    duration,
    path,
    options,
    absolute_position
  );

music_set("animation/september.wav");
svg_set("animation/along_path_gsap_bezier.svg");

svg_main.addEventListener("load", () => {
  timeline.add(along_path(
    svg("#ball1"),
    5,
    svg("#move1"),
    {ease: Power0.easeNone}
  ));
  timeline.seek(2);
  const pass = library2.timeline_align_position_static_start(
  // const pass = library.timeline_align_position("to", // surprisingly gives the third animation the chance to set the worng start position
    svg("#ball2"),
    2,
    svg("#ball1"),
    {ease: Power0.easeNone, overwrite: "none"}, // both "all" and "none" work fine for overwrite, "auto" surprisingly kills the third animation
    absolute_position,
    absolute_position
  );
  timeline.seek(0);
  timeline.add(along_path(
    svg("#ball2"),
    5,
    svg("#move1"),
    {ease: Power0.easeNone}
  ), 0); // setting this positive suprsingly causes pass to be overwritten regardless of its overwrite setting
  timeline.add(pass, 0);
  // additionally scrolling backwards through the gui does not work
});
