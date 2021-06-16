import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.respository';
import { TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

/*
 * Mocking becuase actula calls to DB are expensive
 */
const mockUser = { username: 'TestUser' };
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
});

describe('Task Servce', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
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
  });
});
