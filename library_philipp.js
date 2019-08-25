const library = {};
{
  const transformation_matrix = (start, destination) =>
    destination.getScreenCTM().inverse().multiply(start.getScreenCTM());
  const svg_element = (html_dom, svg_selector) =>
    Array.prototype.concat.apply(
      [],
      html_dom.map(
        html_dom_current =>
          Array.from(html_dom_current.contentDocument.querySelectorAll(svg_selector))
      )
    );
  const convert_to_relative = (value, position) => { // caveat: modifies value argument
    if ("x" in value)
      value.x -= position.x;
    if ("y" in value)
      value.y -= position.y;
    return value;
  };
  const timeline_absolute_position = // preserves value argument owing to Object.assign
    (function_name, element, duration, value, element_absolute_position) => {
      const timeline = new TimelineMax();
      element.forEach(element_current => {
        const value_current = Object.assign({}, value);
        timeline[function_name](
          element_current,
          duration,
          convert_to_relative(value_current, element_absolute_position(element_current)),
          0
        );
      });
      return timeline;
    };
  // const tween_absolute_position = // caveat: modifies value argument
  //   (function_name, element, duration, value, element_absolute_position) =>
  //   TweenMax[function_name](
  //     element,
  //     duration,
  //     convert_to_relative(value, element_absolute_position(element))
  //   );

  const coordinate_2d = unstructured => {
    const x1 = unstructured.filter((element, index) => index > 0 && index%2 === 1);
    const x2 = unstructured.filter((element, index) => index > 0 && index%2 === 0);
    return x1.map((value, index) => ({"x": value, "y": x2[index]}));
  }
  const bezier = (path, absolute_position) => ({
    type: "cubic",
    values: Snap.path.toCubic(path.getAttribute("d"))
      .flatMap(coordinate_2d)
      .map(coordinate => convert_to_relative(coordinate, absolute_position))
  });
  const timeline_along_path = // preserves value argument owing to Object.assign
    (function_name, element, duration, path, value, element_absolute_position) => {
      const timeline = new TimelineMax();
      element.forEach(element_current => {
        const value_current = Object.assign({}, value);
        value_current.bezier = bezier(path[0], element_absolute_position(element_current));
        timeline[function_name](
          element_current,
          duration,
          value_current,
          0
        );
      });
      return timeline;
    };

  // export
  library.svg_element = svg_element;
  library.timeline_absolute_position = timeline_absolute_position;
  library.timeline_along_path = timeline_along_path;
}
