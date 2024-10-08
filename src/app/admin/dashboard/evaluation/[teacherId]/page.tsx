"use client";
import Cookies from "js-cookie";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function Page({ params }: { params: { teacherId: string } }) {
  const teacherId = params.teacherId;
  const [performanceData, setPerformanceData] = useState(null);
  const [teachername, setTeachername] = useState(null);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const detailsres = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/teacher-eval/${teacherId}`,
          {
            method: "GET",
          }
        );
        if (detailsres.ok) {
          const teacherDetails = await detailsres.json();
          setPerformanceData(teacherDetails);
        } else {
          console.error("Failed to fetch teacher details");
        }
      } catch (error) {
        console.error("Error during teacher details fetch", error);
      }
    };
    fetchTeacherDetails();
  }, []);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const detailsres = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/teacher/${teacherId}`,
          {
            method: "GET",
          }
        );
        if (detailsres.ok) {
          const teacherDetails = await detailsres.json();
          setTeachername(teacherDetails.name);
        } else {
          console.error("Failed to fetch teacher details");
        }
      } catch (error) {
        console.error("Error during teacher details fetch", error);
      }
    };
    fetchTeacherDetails();
  }, []);

  const renderProgressBars = () => {
    if (!performanceData)
      return (
        <p className="text-muted-foreground">
          <Separator /> <br />
          No Records found
        </p>
      );

    const labels = [
      "Punctuality of teacher in attending classes",
      "Teacher's Preparation for the classes",
      "Effectiveness of teaching",
      "Maintains discipline in the class",
      "Interest generated by the teacher",
      "Explain the concepts through examples and application",
      "Effective usage of ICT in the classroom",
      "Design/Conduct of internal examination, seminars or Assignments and Projects",
      "Teacher entertains / clarifies doubts",
      "Completion of portion in time",
    ];

    return labels.map((label, index) => (
      <div key={index} className="w-full mb-4">
        <p className="text-gray-600">
          {index + 1}.&nbsp;{label}
        </p>
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none h-6 rounded-full dark:bg-blue-500 items-center justify-center flex mt-2"
            style={{
              width: `${
                performanceData[Object.keys(performanceData)[index + 1]]
              }%`,
            }}
          >
            {performanceData[Object.keys(performanceData)[index + 1]]}%
          </div>
        </div>
      </div>
    ));
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-3xl font-semibold tracking-tight">
            {teachername}
          </h1>
          <p className="text-sm text-muted-foreground">
            Teacher Performance Evaluation
          </p>
        </div>
        <div>{renderProgressBars()}</div>
      </div>
    </ScrollArea>
  );
}
