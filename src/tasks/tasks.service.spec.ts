import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userInfo } from 'os';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.respository';
import { TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

/*
 * Mocking becuase actula calls to DB are expensive
 * We ae not testing a  pure function.
 */
const mockUser = { id: 1, username: 'TestUser' };
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('Task Servce', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    /*
     * simulating a module
     * initialise a task service and task repository
     */
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('some value');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query...',
      };
      //call tasksService.getTasks
      const result = await tasksService.getTasks(filters, mockUser);
      // expet tasksRepository.getTasks TO HAVE BEEN CALLED
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some value');
    });

    // part 2
    it('calls TaskRepository.getTasks and returns the result', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      taskRepository.getTasks.mockResolvedValue('someValue');
      // call tasksSerice.getTasks, which would then calll the repository's getTasks
      const result = await tasksService.getTasks(null, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      taskRepository.findOne.mockResolvedValue(mockTask); // resoled value becuase we mocking promise
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
      taskRepository.createTask.mockResolvedValue('someTask');
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const createTaskDto = {
        title: 'Test task',
        description: 'Test Description',
      };
      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual('someTask');
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalled();
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws an error as task could not be found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow();
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    const save = jest.fn().mockResolvedValue(true);
    // it('updates task status', async () => {
    //   tasksService.getTaskById = jest.fn().mockResolvedValue({
    //     status: TaskStatus.OPEN,
    //     save: jest.fn().mockResolvedValue(true),
    //   });
    it('updates task status', async () => {
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(tasksService.getTaskById);
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
