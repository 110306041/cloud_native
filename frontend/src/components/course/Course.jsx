import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { courseHwFake } from "../../utils";
import CourseHw from "./hw/CourseHw";

export default function Course() {
  const id = useParams();
  console.log("Course ID:", id);

  const location = useLocation();
  const courseInfo = location.state?.courseInfo;
  console.log(courseInfo);
  const [hws, setHws] = useState(courseHwFake)

  return (
    <>
      <span
        style={{
          fontWeight: "bold",
          fontSize: "25px",
          color: "white",
          margin: "50px",
        }}
      >
        {courseInfo.semester} {courseInfo.name}
      </span>
      <CourseHw hws={hws} courseInfo={courseInfo}></CourseHw>
      {/* TODO: render CourseExam */}
      <CourseHw></CourseHw>
      {/* <CourseExam></CourseExam> */}
    </>
  );
}
