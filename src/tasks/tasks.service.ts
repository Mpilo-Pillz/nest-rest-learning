import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.respository';
import { TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  // getAllTasks() {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       task =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return found;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    console.log(result);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id} not found`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}

// createTask(title: string, description: string): Task {
//   const task: Task = {
//     id: this.getHoursMinutesSecons(),
//     title,
//     description,
//     status: TaskStatus.OPEN,
//   };

//   this.tasks.push(task);
//   return task; // return the new task so we dont have to make a new call or refresh the page to get th updated task
// }

// private tasks: Task[] = [];

// private getHoursMinutesSecons(): string {
//   const time = new Date();
//   const hour = time.getHours();
//   const minute = time.getMinutes();
//   const second = time.getSeconds();
//   const miliSecond = time.getMilliseconds();
//   return `${hour}${minute}${second}${miliSecond}`;
// }

// updateTaskStatus(id: string, status: TaskStatus): Task {
//   const task = this.getTaskById(id);
//   task.status = status;
//   return task;
// }

// getTaskById(id: string): Task {
//   const found = this.tasks.find(task => task.id === id);
//   if (!found) {
//     throw new NotFoundException(`Task with ${id} not found`);
//   }
//   return; i didnt return found
// }
