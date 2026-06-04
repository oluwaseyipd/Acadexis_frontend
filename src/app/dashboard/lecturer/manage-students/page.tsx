/**
 * TODO: Students endpoint needed in backend API
 * Need endpoint to fetch students enrolled in lecturer's courses
 * Once implemented, replace mockStudents with API call like:
 * GET /lecturers/{lecturerId}/students/ or GET /courses/{courseId}/students/
 */

import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockStudents = [
  { id: "1", name: "Alice Johnson", email: "alice@uni.edu", course: "CS 401", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@uni.edu", course: "CS 401", status: "active" },
  { id: "3", name: "Carol Davis", email: "carol@uni.edu", course: "ECON 201", status: "inactive" },
];

export default function ManageStudentsPage() {
  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Students</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage enrollment and monitor student activity across your courses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" /> Enrolled Students
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Course</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudents.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        {/* Show email & course inline on small screens */}
                        <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                          {s.email}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden sm:block hidden mt-0.5">
                          {s.course}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {s.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {s.course}
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.status === "active" ? "default" : "secondary"}>
                        {s.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}