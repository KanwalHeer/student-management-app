#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

class Student {
  constructor(
    public id: number,
    public name: string,
    public age: number,
    public course: { name: string },
    public fees: number,
    public paymentMethod: string
  ) {}
}

class StudentManagement {
  private students: Student[] = [];

  addStudent(student: Student): void {
    this.students.push(student);
  }

  removeStudent(id: number): void {
    if (this.students.length === 0) {
      console.log(chalk.yellow("No students found. Cannot remove student."));
      return;
    }

    const initialLength = this.students.length;
    this.students = this.students.filter((student) => student.id !== id);

    if (this.students.length === initialLength) {
      console.log(
        chalk.yellow(
          "Student not found with the provided ID. No student removed."
        )
      );
    } else {
      console.log(chalk.green("Student removed successfully!"));
    }
  }

  displayStudents(): void {
    if (this.students.length === 0) {
      console.log(chalk.yellow("No students found."));
      return;
    }

    console.log(chalk.cyan("List of Students:"));
    this.students.forEach((student) => {
      console.log(
        chalk.blue(`ID: ${student.id}`),
        chalk.green(`Name: ${student.name}`),
        chalk.magenta(`Age: ${student.age}`),
        chalk.yellow(`Course: ${student.course.name}`),
        chalk.red(`Fees: ${student.fees}`),
        chalk.green(`Payment Method: ${student.paymentMethod}`)
      );
    });
  }
}

const studentManagement = new StudentManagement();

console.log(chalk.bold.cyan("Welcome to Student Management System!"));

async function main() {
  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Add Student", "Remove Student", "Display Students", "Exit"],
      },
    ]);

    switch (choice) {
      case "Add Student":
        const studentInfo = await getStudentInfo();
        const newStudent = new Student(
          studentInfo.id,
          studentInfo.name,
          studentInfo.age,
          studentInfo.course,
          studentInfo.fees,
          studentInfo.paymentMethod
        );

        studentManagement.addStudent(newStudent);
        console.log(chalk.green("Student added successfully!"));
        break;
      case "Remove Student":
        const { removeId } = await inquirer.prompt([
          {
            type: "number",
            name: "removeId",
            message: "Enter ID of student to remove:",
          },
        ]);
        studentManagement.removeStudent(removeId);
        break;
      case "Display Students":
        studentManagement.displayStudents();
        break;
      case "Exit":
        console.log(chalk.bold.yellow("Exiting..."));
        process.exit(0);
      default:
        console.log(chalk.red("Invalid choice! Please enter a valid option."));
    }
  }
}

async function getStudentInfo(): Promise<any> {
  let studentInfo;
  let isValidFees = false;

  const courses = [
    { name: "Web development", fees: 2000 },
    { name: "Blockchain", fees: 5000 },
    { name: "App development", fees: 7000 },
    { name: "AI", fees: 8000 },
  ];

  while (!isValidFees) {
    studentInfo = await inquirer.prompt([
      {
        type: "number",
        name: "id",
        message: "Enter ID:",
      },
      {
        type: "input",
        name: "name",
        message: "Enter Name:",
      },
      {
        type: "number",
        name: "age",
        message: "Enter Age:",
      },
      {
        type: "list",
        name: "course",
        message: "Choose Course:",
        choices: courses.map((course) => ({
          name: `${course.name} - Fees: ${course.fees}`,
          value: course,
        })),
      },
      {
        type: "number",
        name: "fees",
        message: (answers: any) =>
          `Enter Fees (Course: ${answers.course.name}):`,
      },
      {
        type: "list",
        name: "paymentMethod",
        message: "Choose Payment Method:",
        choices: ["Credit Card", "Debit Card", "Net Banking", "Cash"],
      },
    ]);

    isValidFees = studentInfo.fees >= getCourseFees(studentInfo.course.name);

    if (!isValidFees) {
      console.log(
        chalk.red(
          "Warning: Entered fees are less than the specified fees for the course. Please enter the correct fees."
        )
      );
    }
  }

  return studentInfo;
}

function getCourseFees(course: string): number {
  const courseFeesMap: { [key: string]: number } = {
    "Web development": 2000,
    Blockchain: 5000,
    "App development": 7000,
    AI: 8000,
  };
  return courseFeesMap[course] || 0;
}

main();
