import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '../project.controller';
import { ProjectService } from '../project.service';
import { UserRequestDto } from 'src/api/auth/dto/userRequest.dto';
import { Project } from '../entities/project.entity';
import { User } from 'src/api/user/entities/user.entity';
import { Org } from 'src/api/org/entities/org.entity';
import { CreateProjectDto } from '../dto/createProject.dto';
import { UpdateProjectDto } from '../dto/updateProject.dto';

describe('ProjectController', () => {
  let controller: ProjectController;

  const mockProjectService = {
    getAllProjects: jest.fn(),
    getProject: jest.fn(),
    createProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    getSelectedProjects: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService],
    })
      .overrideProvider(ProjectService)
      .useValue(mockProjectService)
      .compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProjects', () => {
    it('should call projectService.getAllProjects method with userId', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      mockProjectService.getAllProjects.mockResolvedValue(undefined);
      await controller.getAllProjects(mockReq);
      expect(mockProjectService.getAllProjects).toBeCalledWith(mockReq.user.id);
    });

    it('should return an array of projects', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const user = new User(mockEmail);
      const org = new Org('org-name');
      const project = new Project(user, org, 'project-name');
      const expectedResult = [project, { ...project }];
      mockProjectService.getAllProjects.mockResolvedValue(expectedResult);
      const result = await controller.getAllProjects(mockReq);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProject', () => {
    it('should call projectService.getProject method with projectId', async () => {
      const projectId = 'project-id';
      mockProjectService.getProject.mockResolvedValue(undefined);
      await controller.getProject(projectId);
      expect(mockProjectService.getProject).toBeCalledWith(projectId);
    });

    it('should return an project', async () => {
      const mockEmail = 'mock@email.com';
      const projectId = 'project-id';
      const orgName = 'org-name';
      const user = new User(mockEmail);
      const org = new Org(orgName);
      const expectedResult = new Project(user, org, 'project-name');
      mockProjectService.getProject.mockResolvedValue(expectedResult);

      const result = await controller.getProject(projectId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('createProject', () => {
    it('should call projectService.createProject method with userId and CreateProjectDto', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const orgId = 'org-id';
      const newProject = new CreateProjectDto();
      newProject.name = 'project-name';
      mockProjectService.createProject.mockResolvedValue(undefined);
      await controller.createProject(mockReq, newProject);
      expect(mockProjectService.createProject).toBeCalledWith(
        mockReq.user.id,
        orgId,
        newProject,
      );
    });

    it('should return an project', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const newProject = new CreateProjectDto();
      newProject.name = 'project-name';
      const orgName = 'org-name';
      const user = new User(mockEmail);
      const org = new Org(orgName);
      const expectedResult = new Project(user, org, newProject.name);
      mockProjectService.createProject.mockResolvedValue(expectedResult);

      const result = await controller.createProject(mockReq, newProject);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateProject', () => {
    it('should call projectService.updateProject method with userId and UpdateProjectDto', async () => {
      const projectId = 'project-id';
      const projectUpdates = new UpdateProjectDto();
      projectUpdates.name = 'project-name';
      mockProjectService.updateProject.mockResolvedValue(undefined);
      await controller.updateProject(projectId, projectUpdates);
      expect(mockProjectService.updateProject).toBeCalledWith(
        projectId,
        projectUpdates,
      );
    });

    it('should return an project', async () => {
      const projectId = 'project-id';
      const projectUpdates = new UpdateProjectDto();
      projectUpdates.name = 'project-name';
      const user = new User('mock@email.com');
      const org = new Org('org-name');
      const expectedResult = new Project(user, org, 'project-name');
      mockProjectService.updateProject.mockResolvedValue(expectedResult);

      const result = await controller.updateProject(projectId, projectUpdates);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteProject', () => {
    it('should call projectService.deleteProject method with projectId', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const projectId = 'project-id';
      mockProjectService.deleteProject.mockResolvedValue(undefined);
      await controller.deleteProject(mockReq, projectId);
      expect(mockProjectService.deleteProject).toBeCalledWith(
        mockReq.user.id,
        projectId,
      );
    });

    it('should return undefined', async () => {
      const mockUserId = 'mock-user-id';
      const mockEmail = 'mock@email.com';
      const mockReq = {
        user: { id: mockUserId, email: mockEmail },
      } as UserRequestDto;
      const projectId = 'project-id';
      const projectUpdates = new UpdateProjectDto();
      projectUpdates.name = 'project-name';
      const expectedResult = undefined;
      mockProjectService.deleteProject.mockResolvedValue(expectedResult);

      const result = await controller.deleteProject(mockReq, projectId);

      expect(result).toEqual(expectedResult);
    });
  });
});
