import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  createTask(title: string, description: string): Task {
    const task: Task = {
      id: this.getHoursMinutesSecons(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task; // return the new task so we dont have to make a new call or refresh the page to get th updated task
  }

  private getHoursMinutesSecons(): string {
    const time = new Date();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const miliSecond = time.getMilliseconds();

    return `${hour}${minute}${second}${miliSecond}`;
  }
}
