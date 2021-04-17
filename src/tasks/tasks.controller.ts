import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.taskService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Post()
  createTaskDecorated(
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    console.log('tite', title);
    console.log('description', description);

    // return this.taskService.createTask(title, description);
  }

  @Post()
  createTaskWayOne(@Body() body) {
    console.log('body', body);
  }
}
