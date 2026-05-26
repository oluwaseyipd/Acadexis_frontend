import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <p className="text-muted-foreground text-sm mt-1">Manage enrollment and monitor student activity across your courses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" /> Enrolled Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.email} • {s.course}</p>
                </div>
                <Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
