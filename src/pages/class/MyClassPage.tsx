import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Search,
  Filter,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentCard } from "./components/student-card";
import { LessonCard } from "./components/lesson-card";
import { LessonGridCard } from "./components/lesson-grid-card";
import { AddStudentCard } from "./components/add-student-card";
import { AddLessonCard } from "./components/add-lesson-card";
import { ClassCard } from "./components/class-card";
import { AddClassCard } from "./components/add-class-card";
import { StudentDrawer, type StudentFormData } from "./components/student-drawer";
import { ClassDialog, type ClassFormData } from "./components/class-dialog";
import { useClassrooms, useCreateClassroom, useUpdateClassroom } from "@/hooks/use-classrooms";
import { useStudents, useCreateStudent, useUpdateStudent } from "@/hooks/use-students";
import { useLessons } from "@/hooks/use-lessons";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import type { Classroom, Student, Lesson } from "@/types/classroom";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
    },
  },
};

const STUDENTS_PER_PAGE = 11; // 11 students + 1 AddStudentCard = 12 items in grid
const SEARCH_DEBOUNCE_MS = 300;

// TODO : WIP LTPHO: split into smaller components
const MyClassPage = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [classesPage] = useState(1);
  const [studentsPage, setStudentsPage] = useState(1);
  const [lessonsPage, setLessonsPage] = useState(1);
  const [lessonViewMode, setLessonViewMode] = useState<"grid" | "list">("list");

  const [isStudentDrawerOpen, setIsStudentDrawerOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const {
    data: classroomsData,
    isLoading: isLoadingClassrooms,
    error: classroomsError,
  } = useClassrooms({ page: classesPage, limit: 20 });

  const classrooms = classroomsData?.data ?? [];

  const selectedClassroom = useMemo(() => {
    if (!classrooms.length) return null;
    if (selectedClassId) {
      return classrooms.find((c) => c.id === selectedClassId) ?? classrooms[0];
    }
    return classrooms[0];
  }, [classrooms, selectedClassId]);

  const {
    data: studentsData,
    isLoading: isLoadingStudents,
  } = useStudents(selectedClassroom?.id, {
    page: studentsPage,
    limit: STUDENTS_PER_PAGE,
    search: debouncedSearchQuery || undefined,
  });

  const students = studentsData?.data ?? [];
  const studentsMeta = studentsData?.meta;
  const totalStudentPages = studentsMeta?.pageCount ?? 1;

  const {
    data: lessonsData,
    isLoading: isLoadingLessons,
  } = useLessons(selectedClassroom?.id, {
    page: lessonsPage,
    limit: 10,
  });

  const lessons = lessonsData?.data ?? [];
  const lessonsMeta = lessonsData?.meta;
  const totalLessonPages = lessonsMeta?.pageCount ?? 1;

  // Student mutations
  const createStudentMutation = useCreateStudent(selectedClassroom?.id ?? "");
  const updateStudentMutation = useUpdateStudent(selectedClassroom?.id ?? "");

  // Classroom mutations
  const createClassroomMutation = useCreateClassroom();
  const updateClassroomMutation = useUpdateClassroom();

  const handleClassChange = (classroom: Classroom) => {
    setSelectedClassId(classroom.id);
    setSelectedStudent(null);
    setStudentsPage(1);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setEditingStudent(student);
    setIsStudentDrawerOpen(true);
  };

  const handleLessonClick = (lesson: Lesson) => {
    console.log("Lesson clicked:", lesson);
  };

  const handleAddClass = () => {
    setEditingClassroom(null);
    setIsClassDialogOpen(true);
  };

  const handleEditClass = () => {
    if (selectedClassroom) {
      setEditingClassroom(selectedClassroom);
      setIsClassDialogOpen(true);
    }
  };

  const handleEditClassFromCard = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setIsClassDialogOpen(true);
  };

  const handleClassDialogClose = (open: boolean) => {
    setIsClassDialogOpen(open);
    if (!open) {
      setEditingClassroom(null);
    }
  };

  const handleClassSubmit = async (data: ClassFormData) => {
    try {
      if (editingClassroom) {
        // Update existing classroom
        await updateClassroomMutation.mutateAsync({
          id: editingClassroom.id,
          data: {
            name: data.name,
            grade: data.grade || undefined,
          },
        });
        toast.success("Class updated successfully");
      } else {
        await createClassroomMutation.mutateAsync({
          name: data.name,
          grade: data.grade || undefined,
        });
        toast.success("Class created successfully");
      }
      setIsClassDialogOpen(false);
      setEditingClassroom(null);
    } catch (error) {
      console.error("Failed to save classroom:", error);
      toast.error(editingClassroom ? "Failed to update class" : "Failed to create class");
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsStudentDrawerOpen(true);
  };

  const handleStudentDrawerClose = (open: boolean) => {
    setIsStudentDrawerOpen(open);
    if (!open) {
      setEditingStudent(null);
    }
  };

  const handleStudentSubmit = async (data: StudentFormData) => {
    if (!selectedClassroom) return;

    try {
      if (editingStudent) {
        // Update existing student
        await updateStudentMutation.mutateAsync({
          id: editingStudent.id,
          data: {
            fullName: data.fullName,
            grade: data.grade || undefined,
            hobby: data.hobby || undefined,
            notes: data.notes || undefined,
            avatarUrl: data.avatarUrl || undefined,
            specialNeeds: data.specialNeeds as any,
            cefrLevels: data.cefrLevels as any,
          },
        });
        toast.success("Student updated successfully");
      } else {
        // Create new student
        await createStudentMutation.mutateAsync({
          fullName: data.fullName,
          grade: data.grade || undefined,
          hobby: data.hobby || undefined,
          notes: data.notes || undefined,
          avatarUrl: data.avatarUrl || undefined,
          specialNeeds: data.specialNeeds as any,
          cefrLevels: data.cefrLevels as any,
        });
        toast.success("Student created successfully");
      }
      setIsStudentDrawerOpen(false);
      setEditingStudent(null);
    } catch (error) {
      console.error("Failed to save student:", error);
      toast.error(editingStudent ? "Failed to update student" : "Failed to create student");
    }
  };

  const handleAddLesson = () => {
    console.log("Add lesson clicked");
    // TODO: Open add lesson form/modal
  };

  return (
    <div className="min-h-screen bg-background p-4 font-sans text-foreground md:p-8">

      <motion.header
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto mb-8 flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center"
      >
        <div className="flex flex-wrap items-center gap-3">
          {isLoadingClassrooms ? (
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-32 rounded-[8px]" />
              ))}
            </>
          ) : classroomsError ? (
            <div className="flex items-center gap-2 text-destructive">
              <span>Failed to load</span>
            </div>
          ) : (
            <>
              {classrooms.map((classroom) => (
                <ClassCard
                  key={classroom.id}
                  classroom={classroom}
                  studentCount={classroom.totalStudents ?? 0}
                  isSelected={selectedClassroom?.id === classroom.id}
                  onClick={handleClassChange}
                  onEdit={handleEditClassFromCard}
                />
              ))}
              <AddClassCard onClick={handleAddClass} />
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full shadow-sm"
            onClick={handleEditClass}
            disabled={!selectedClassroom}
          >
            <Pencil className="mr-2 size-4" />
            Edit Class
          </Button>
          {/* <Button className="rounded-full shadow-md">
            <Settings className="mr-2 size-4" />
            Settings
          </Button> */}
        </div>
      </motion.header>

      <div className="mx-auto max-w-7xl space-y-8">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Students</h2>
              <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                {studentsMeta?.itemCount ?? students.length}
              </span>
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setStudentsPage(1); // Reset to first page on search
                  }}
                  className="rounded-full pl-9 pr-9 shadow-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStudentsPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full shadow-sm"
              >
                <Filter className="size-4" />
              </Button>
            </div>
          </motion.div>


          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
         
            <AddStudentCard onClick={handleAddStudent} />

            {isLoadingStudents ? (
          
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-[8px]" />
                ))}
              </>
            ) : (
              students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isSelected={selectedStudent?.id === student.id}
                  onClick={handleStudentClick}
                />
              ))
            )}
          </div>


          <motion.div variants={itemVariants} className="mt-4">
            <Pagination
              currentPage={studentsPage}
              totalPages={totalStudentPages}
              onPageChange={setStudentsPage}
            />
          </motion.div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 md:flex-row"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Lessons</h2>
              <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                Upcoming
              </span>
            </div>

            <div className="flex items-center gap-2">

              <div className="flex rounded-full border border-border bg-card p-1 shadow-sm">
                <Button
                  variant={lessonViewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="size-8 rounded-full"
                  onClick={() => setLessonViewMode("grid")}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={lessonViewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="size-8 rounded-full"
                  onClick={() => setLessonViewMode("list")}
                >
                  <List className="size-4" />
                </Button>
              </div>

              {/* <Button variant="outline" className="rounded-full shadow-sm">
                <Calendar className="mr-2 size-4" />
                View Calendar
              </Button> */}
            </div>
          </motion.div>

      
          <AnimatePresence mode="wait">
            {lessonViewMode === "grid" && (
              <motion.div
                key={`grid-${selectedClassroom?.id ?? "none"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
              >
   
                <AddLessonCard onClick={handleAddLesson} />

                {isLoadingLessons ? (

                  <>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="aspect-square rounded-[8px]" />
                    ))}
                  </>
                ) : (
                  lessons.map((lesson) => (
                    <LessonGridCard
                      key={lesson.id}
                      lesson={lesson}
                      onClick={handleLessonClick}
                    />
                  ))
                )}
              </motion.div>
            )}
            {lessonViewMode === "list" && (
              <motion.div
                key={`list-${selectedClassroom?.id ?? "none"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {isLoadingLessons ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-[8px]" />
                    ))}
                  </>
                ) : (
                  lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      participants={students.slice(0, 5)}
                      onClick={handleLessonClick}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lessons Pagination */}
          <motion.div variants={itemVariants} className="mt-4">
            <Pagination
              currentPage={lessonsPage}
              totalPages={totalLessonPages}
              onPageChange={setLessonsPage}
            />
          </motion.div>
        </motion.section>
      </div>

      {/* Student Drawer */}
      <StudentDrawer
        open={isStudentDrawerOpen}
        onOpenChange={handleStudentDrawerClose}
        student={editingStudent}
        onSubmit={handleStudentSubmit}
        isSubmitting={createStudentMutation.isPending || updateStudentMutation.isPending}
      />

      {/* Class Dialog */}
      <ClassDialog
        open={isClassDialogOpen}
        onOpenChange={handleClassDialogClose}
        classroom={editingClassroom}
        onSubmit={handleClassSubmit}
        isSubmitting={createClassroomMutation.isPending || updateClassroomMutation.isPending}
      />
    </div>
  );
};

export default MyClassPage;