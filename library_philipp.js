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
      const target_defining_element = target_absolute_position.defining_element(target[0]);
      const target_defining_element_coordinate = target_absolute_position.coordinate(target_defining_element);
      const timeline = new TimelineMax();
      object.forEach(object_current => {
        const object_defining_element = object_absolute_position.defining_element(object_current);
        const transformation_animated = transformation_matrix(
          object_current,
          object_current.parentElement
        );
        const object_coordinate = coordinate_relative(
          coordinate_transform(
            object_absolute_position.coordinate(object_defining_element),
            transformation_matrix(
              object_defining_element,
              object_current.parentElement
            )
          ),
          {
            "x": transformation_animated.e,
            "y": transformation_animated.f
          }
        );
        timeline[function_name](
          object_current,
          duration,
          Object.assign(
            translation(
              object_current,
              object_coordinate,
              target_defining_element,
              target_defining_element_coordinate
            ),
            options
          ),
          0
        );
      });
      return timeline;
    };
  const translation =
    (
      object,
      object_coordinate,
      target_defining_element,
      target_defining_element_coordinate
    ) => coordinate_relative(
      coordinate_transform(
        target_defining_element_coordinate,
        transformation_matrix(
          target_defining_element,
          object.parentElement
        )
      ),
      object_coordinate
    );
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
  const timeline_along_path = // preserves options argument owing to Object.assign
    (function_name, object, duration, path, options, object_absolute_position) => {
      const timeline = new TimelineMax();
      object.forEach(object_current => {
        const options_current = Object.assign({}, options);
        const object_defining_element = object_absolute_position.defining_element(object_current);
        const transformation_animated = transformation_matrix(
          object_current,
          object_current.parentElement
        );
        const object_coordinate = coordinate_relative(
          coordinate_transform(
            object_absolute_position.coordinate(object_defining_element),
            transformation_matrix(
              object_defining_element,
              object_current.parentElement
            )
          ),
          {
            "x": transformation_animated.e,
            "y": transformation_animated.f
          }
        );
        options_current.bezier = {
          "type": "cubic",
          "values": bezier(path[0]).map(target_defining_element_coordinate =>
            translation(
              object_current,
              object_coordinate,
              path[0],
              target_defining_element_coordinate
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
  library.svg_element = svg_element;
  library.timeline_align_position = timeline_align_position;
  library.timeline_along_path = timeline_along_path;
}
