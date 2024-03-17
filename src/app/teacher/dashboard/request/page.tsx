"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import BreadCrumb from "@/components/breadcrumb";
import { Check, CircleSlash, Hourglass } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const breadcrumbItems = [
  { title: "Dashboard", link: "/teacher/dashboard/" },
  { title: "Requests", link: "/teacher/dashboard/request" },
];

const teacherId = Cookies.get("teacherId");

export default function CreateRequest() {
  const { toast } = useToast();

  const [requests, setRequests] = useState<any[]>([]);
  const [prevRequests, setPrevRequests] = useState<any[]>([]);
  const [remark, setRemark] = useState<string>("");

  useEffect(() => {
    fetchUpdatedRequests();
    fetchPreviousRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3500/request/${requestId}/accept`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            remark,
          }),
        }
      );
      if (response.ok) {
        toast({
          description: "Request accepted successfully.",
        });
        fetchUpdatedRequests();
      } else {
        console.error("Failed to accept request");
      }
    } catch (error) {
      console.error("Error during request acceptance", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3500/request/${requestId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            remark,
          }),
        }
      );
      if (response.ok) {
        toast({
          description: "Request rejected successfully.",
        });
        fetchUpdatedRequests();
      } else {
        console.error("Failed to reject request");
      }
    } catch (error) {
      console.error("Error during request rejection", error);
    }
  };

  const fetchUpdatedRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3500/request/teacher/${teacherId}/pending-requests`
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error("Failed to fetch updated requests");
      }
    } catch (error) {
      console.error("Error during updated requests fetch", error);
    }
  };

  const fetchPreviousRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3500/request/teacher/${teacherId}/replied-requests`
      );
      if (response.ok) {
        const data = await response.json();
        setPrevRequests(data);
      } else {
        console.error("Failed to fetch replied requests");
      }
    } catch (error) {
      console.error("Error during replied requests fetch", error);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">Requests</h1>
          <p className="text-sm text-muted-foreground">
            Manage the requests recieved from students
          </p>
        </div>
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {requests.length === 0 ? (
                <p className="text-muted-foreground">No Records found</p>
              ) : (
                requests.map((request: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-col space-y-2">
                          <p className="text-xs text-muted-foreground">
                            {request.datetime}
                          </p>
                          <p className="text-lg font-medium leading-none">
                            {request.text}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            From : {request.student.name}&nbsp;&#x28;&nbsp;
                            {request.student.department.deptname}
                            ,&nbsp;Semester&nbsp;
                            {request.student.semester.semnum}&nbsp;&#x29;
                          </p>
                          <br />
                          <Input
                            name="remark"
                            placeholder="Enter Remarks..."
                            className="text-sm"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                          />{" "}
                          <br />
                          <div className="space-x-2 mt-5">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-500"
                              onClick={() => handleAccept(request._id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request._id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-x mr-2 h-4 w-4"
                              >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                              </svg>
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Reacted Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {prevRequests.length === 0 ? (
                <p className="text-muted-foreground">No Records found</p>
              ) : (
                prevRequests.map((request: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-col space-y-2">
                          <p className="text-xs text-muted-foreground">
                            {request.datetime}
                          </p>
                          <p className="text-lg font-medium leading-none">
                            {request.text}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            From : {request.student.name}&nbsp;&#x28;&nbsp;
                            {request.student.department.deptname}
                            ,&nbsp;Semester&nbsp;
                            {request.student.semester.semnum}&nbsp;&#x29;
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.status === "pending" ? (
                              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-yellow-200 text-black p-2">
                                <Hourglass className="mr-2 h-4 w-4" />
                                Pending
                              </span>
                            ) : request.status === "accepted" ? (
                              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-green-200 text-black p-2">
                                <Check className="mr-2 h-4 w-4" />
                                Accepted
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-red-200 text-black p-2">
                                <CircleSlash className="mr-2 h-4 w-4" />
                                Rejected
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground">
                            Remarks : {request.remark}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
