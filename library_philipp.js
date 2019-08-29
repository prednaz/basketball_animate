const library = {};
{
  const path_distance = new Map();
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
  const transform_inner = (interim_result_object, interim_result_target) =>
    coordinate_relative(
      coordinate_transform(
        interim_result_target.defining_element_coordinate,
        transformation_matrix(
          interim_result_target.defining_element,
          interim_result_object.parent
        )
      ),
      interim_result_object.coordinate
    );
  const transform_outer_target = (target, absolute_position) => {
    const defining_element = absolute_position.defining_element(target);
    const defining_element_coordinate = absolute_position.coordinate(defining_element);
    return ({
      "defining_element": defining_element,
      "defining_element_coordinate": defining_element_coordinate
    });
  };
  const transform_outer_object = (object, absolute_position) => {
    const result = transform_outer_object_relative(object, absolute_position);
    const transformation_animated = transformation_matrix(
      object,
      object.parentElement
    );
    result.coordinate = coordinate_relative(
      result.coordinate,
      {
        "x": transformation_animated.e,
        "y": transformation_animated.f
      }
    );
    return result;
  };
  const transform_outer_object_relative = (object, absolute_position) => {
    const defining_element = absolute_position.defining_element(object);
    const coordinate =
      coordinate_transform(
        absolute_position.coordinate(defining_element),
        transformation_matrix(
          defining_element,
          object.parentElement
        )
      );
    return ({
      "parent": object.parentElement,
      "coordinate": coordinate
    });
  };
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
      const interim_result_target = transform_outer_target(target[0], target_absolute_position);
      const timeline = new TimelineMax();
      object.forEach(object_current => {
        timeline[function_name](
          object_current,
          duration,
          Object.assign(
            transform_inner(
              transform_outer_object(object_current, object_absolute_position),
              interim_result_target
            ),
            options
          ),
          0
        );
      });
      return timeline;
    };
  const timeline_along_path_svgtransform =
    (function_name, object, duration, path, options, object_absolute_position, svg) => {
      const timeline = new TimelineMax();
      const transformation_generator = svg.contentDocument.querySelector("svg");
      object.forEach(object_current => {
        let interim_result_object;
        const path_distance_current = {"distance": 0};
        path_distance.set(object, path_distance_current);
        timeline[function_name](
          path_distance_current,
          duration,
          Object.assign(
            {
              "distance": path[0].getTotalLength(),
              "onUpdate": () => {
                const translate = transform_inner(
                  interim_result_object,
                  {
                    "defining_element": path[0],
                    "defining_element_coordinate":
                      path[0].getPointAtLength(path_distance_current.distance)
                  }
                );
                interim_result_object.coordinate.x += translate.x;
                interim_result_object.coordinate.y += translate.y;
                const transform = transformation_generator.createSVGTransform();
                transform.setTranslate(translate.x, translate.y);
                object_current.transform.baseVal.insertItemBefore(transform, 0);
              },
              "onStart": () => {
                interim_result_object = transform_outer_object_relative(object_current, object_absolute_position);
              }
            },
            options
          ),
          0
        );
      });
      return timeline;
    };

  // export
  library.svg_element = svg_element;
  library.timeline_align_position = timeline_align_position;
  library.timeline_along_path_svgtransform = timeline_along_path_svgtransform;
}
