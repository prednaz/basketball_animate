const library = {};
{
  const transformation_matrix_from = start => start.getScreenCTM();
  const transformation_matrix_to = destination => destination.getScreenCTM().inverse();
  const transformation_matrix = (start, destination) =>
    transformation_matrix_to(destination).multiply(transformation_matrix_from(start));
  const coordinate_relative = (coordinate, origin) => { // caveat: modifies coordinate argument
    if ("x" in coordinate)
      coordinate.x -= origin.x;
    if ("y" in coordinate)
      coordinate.y -= origin.y;
    return coordinate;
  };
  const coordinate_transform = (coordinate, transformation) => ({
    "x":
      transformation.a * coordinate.x
      + transformation.c * coordinate.y
      + transformation.e,
    "y":
      transformation.b * coordinate.x
      + transformation.d * coordinate.y
      + transformation.f
  });
  const translation_interim_result_target = (target, absolute_position) => {
    const defining_element = absolute_position.defining_element(target);
    const defining_element_coordinate = absolute_position.coordinate(defining_element);
    return ({
      "defining_element": defining_element,
      "defining_element_coordinate": defining_element_coordinate
    });
  };

  // returns a pure value owning all of its data.
  // invariant under under translation of object relative to its parent element,
  // that is the return value is not invalidate by translating the object relative to its parent element.
  const translation_interim_result_object = (object, absolute_position) => {
    const defining_element = absolute_position.defining_element(object);
    const transformation_animated = transformation_matrix(
      object,
      object.parentElement
    );
    return ({
      coordinate:
        coordinate_relative(
          coordinate_transform(
            absolute_position.coordinate(defining_element),
            transformation_matrix(
              defining_element,
              object.parentElement
            )
          ),
          {
            "x": transformation_animated.e,
            "y": transformation_animated.f
          }
        ),
      transformation_matrix_to: transformation_matrix_to(object.parentElement)
    });
  };
  const translation =
    (interim_result_object, interim_result_target) =>
    coordinate_relative(
      coordinate_transform(
        interim_result_target.defining_element_coordinate,
        interim_result_object.transformation_matrix_to.multiply(
          transformation_matrix_from(interim_result_target.defining_element)
        )
      ),
      interim_result_object.coordinate
    );
  const timeline_align_position =
    (
      function_name,
      object,
      duration,
      target,
      options,
      object_absolute_position,
      target_absolute_position
    ) => {
      const interim_result_target = translation_interim_result_target(target[0], target_absolute_position);
      const timeline = new TimelineMax();
      object.forEach(object_current => {
        timeline[function_name](
          object_current,
          duration,
          Object.assign(
            translation(
              translation_interim_result_object(object_current, object_absolute_position),
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
  const tween_along_path_gsap_bezier = // caveat: modifies options argument
    (function_name, object, duration, path, options, object_absolute_position) => {
      const interim_result_object = translation_interim_result_object(object, object_absolute_position);
      options.bezier = {
        "type": "cubic",
        "values": bezier(path[0]).map(coordinate =>
          translation(
            interim_result_object,
            {
              "defining_element": path[0],
              "defining_element_coordinate": coordinate
            }
          )
        )
      };
      return TweenMax[function_name](
        object,
        duration,
        options
      );
    };
  const svg_element = (html_dom, svg_selector) =>
    Array.prototype.concat.apply(
      [],
      html_dom.map(
        html_dom_current =>
          Array.from(html_dom_current.contentDocument.querySelectorAll(svg_selector))
      )
    );
  const marker_style_pattern = /url\("(.+)"\)/;
  const number_pattern = /[\d.]+/g;
  // can only be used with paths of which the stroke-dasharray is specified in pixels
  const path_shorten = (path, distance_start, distance_end) => {
    if (distance_end === undefined)
      distance_end = distance_start;
    path.forEach(path_current => {
      const svg_root = path_current.closest("svg");
      [
        {"property": "marker-start", "distance": distance_start},
        {"property": "marker-end", "distance": distance_end}
      ].forEach(marker => {
        const marker_style_match =
          marker_style_pattern.exec(path_current.style[marker.property]);
        if (marker_style_match !== null)
          TweenMax.set(
            svg_root.querySelector(marker_style_match[1]).querySelector("path"),
            {x:"-=" + (
              marker.distance/Number.parseFloat(path_current.style["stroke-width"])
            )}
          );
      });
      const length_remaining = path_current.getTotalLength() - distance_start - distance_end;
      let number_match = path_current.style["stroke-dasharray"].match(number_pattern);
      let dash_length_new = [];
      if (number_match !== null) {
        const dash_length = number_match.map(Number.parseFloat);
        const sum = dash_length.reduce((x,y) => x+y);
        const dash_repeat_count = Math.trunc(length_remaining / sum);
        let i;
        for (i = 0; i < dash_repeat_count; ++i)
          dash_length_new = dash_length_new.concat(dash_length);
        let sum_new = i * sum;
        for (const dash_length_current of dash_length) {
          if (sum_new + dash_length_current > length_remaining)
            break;
          dash_length_new.push(dash_length_current);
          sum_new += dash_length_current;
        }
        if (dash_length_new.length % 2 === 0)
          dash_length_new.push(length_remaining - sum_new);
        dash_length_new.push(sum + distance_end);
      }
      else
        dash_length_new = [length_remaining, length_remaining];
      dash_length_new[dash_length_new.length - 1] +=
        Math.max(distance_start, distance_end);
      path_current.style["stroke-dasharray"] = dash_length_new.join();
      path_current.style["stroke-dashoffset"] = -distance_start;
    });
  };
  const merge_callback_options = (options, callback) => { // caveat: modifies options argument
    for (const callback_current in callback) {
      if (!(callback_current in options))
        options[callback_current] = callback[callback_current];
      else {
        const callback_current_options = options[callback_current];
        options[callback_current] = (...arguments) => {
          callback[callback_current]();
          callback_current_options.apply(window, arguments);
        };
      }
    }
    return options;
  };

  // export
  library.translation_interim_result_target = translation_interim_result_target;
  library.translation_interim_result_object = translation_interim_result_object;
  library.translation = translation;
  library.timeline_align_position = timeline_align_position;
  library.tween_along_path_gsap_bezier = tween_along_path_gsap_bezier;
  library.svg_element = svg_element;
  library.path_shorten = path_shorten;
  library.merge_callback_options = merge_callback_options;
}
