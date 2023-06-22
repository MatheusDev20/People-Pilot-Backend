import { Test } from '@nestjs/testing';
import { ValidColumn } from 'src/@types';
import { DepartmentsService } from 'src/modules/departments/services/department.service';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { FindOptionsWhere } from 'typeorm';
import { makeFakeUser } from '../authentication/mocks';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { makeFakeupdateEmployee } from './mocks';

jest.mock('src/modules/departments/services/department.service');

describe('Employee Service', () => {
  let sut: EmployeeService;
  let repository: EmployeeRepository;
  let departmentServiceSpy: DepartmentsService;

  class DepartmentsServiceStub {
    async getDepartment() {
      return new Promise((resolve) => resolve('Department'));
    }
    find() {
      return new Promise((resolve) => resolve('Department'));
    }
  }
  class EmployeeRepositoryStub {
    async getEmployeesByDepartment() {
      return new Promise((resolve) => resolve('Employee'));
    }
    async find() {
      return new Promise((resolve) => resolve('Employee'));
    }

    async delete() {
      return new Promise((resolve) => resolve('Delete Employee'));
    }

    async updateEmployee() {
      return new Promise((resolve) => resolve({ id: 1 }));
    }
  }
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: DepartmentsService,
          useClass: DepartmentsServiceStub,
        },
        {
          provide: EmployeeRepository,
          useClass: EmployeeRepositoryStub,
        },
        EmployeeService,
      ],
    }).compile();

    sut = module.get<EmployeeService>(EmployeeService);
    repository = module.get<EmployeeRepository>(EmployeeRepository);
    departmentServiceSpy = module.get<DepartmentsService>(DepartmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Employee Service - Should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('Should call Find method with the right arguments', async () => {
    const column: ValidColumn<Employee> = 'name';
    const value = 'any_value';
    const options: FindOptionsWhere<Employee> = { [column]: value };
    const spy = jest.spyOn(sut, 'find');
    const repositoryFindSpy = jest.spyOn(repository, 'find');
    await sut.find(column, value);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(column, value);
    expect(repositoryFindSpy).toHaveBeenCalled();
    expect(repositoryFindSpy).toHaveBeenCalledWith({ where: options });

    expect.assertions(4);
  });

  it('Should return if a employee is find by find function', async () => {
    const column: ValidColumn<Employee> = 'name';
    const value = 'any_value';
    const repositoryFindSpy = jest.spyOn(repository, 'find');
    const fakeEmployee = makeFakeUser();
    repositoryFindSpy.mockImplementationOnce(() => new Promise((resolve) => resolve(fakeEmployee)));

    expect(sut.find(column, value)).resolves.toEqual(fakeEmployee);
  });

  it('Should call getDepartmentBYName with the right arguments', async () => {
    const departmentName = 'fake-department';
    const page = 1;
    const limit = 5;
    const spy = jest.spyOn(sut, 'getEmployeeByDepartment');
    await sut.getEmployeeByDepartment(departmentName, page, limit);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(departmentName, page, limit);
    expect.assertions(2);
  });

  it('Should throw an Not found department error if the department is not found', async () => {
    const department = 'non-existent-department';
    const page = 1;
    const limit = 5;
    const serviceSpy = jest.spyOn(departmentServiceSpy, 'find');
    serviceSpy.mockImplementationOnce(() => new Promise((resolve) => resolve(null)));

    expect(sut.getEmployeeByDepartment(department, page, limit)).rejects.toThrow(NotFoundException);
    expect.assertions(1);
  });

  it('Should return a list of employees of a given department', async () => {
    const department = 'any_department';
    const page = 1;
    const limit = 10;
    const fakeEmployee = makeFakeUser();
    const repositorySpy = jest.spyOn(repository, 'getEmployeesByDepartment');

    repositorySpy.mockImplementationOnce(
      () => new Promise((resolve) => resolve([fakeEmployee, fakeEmployee])),
    );

    expect(sut.getEmployeeByDepartment(department, page, limit)).resolves.toEqual([
      fakeEmployee,
      fakeEmployee,
    ]);

    expect.assertions(1);
  });

  it('Should not return a list greather than the limit parameter', async () => {
    const department = 'any_department';
    const page = 1;
    const limit = 10;
    const employees = new Array(limit).fill(makeFakeUser());

    const repositorySpy = jest.spyOn(repository, 'getEmployeesByDepartment');
    repositorySpy.mockResolvedValue(employees);

    const returnedEmployees = await sut.getEmployeeByDepartment(department, page, limit);
    expect(returnedEmployees.length).toBeLessThanOrEqual(limit);
    expect.assertions(1);
  });

  it('Should call delete method with the right arguments', async () => {
    const fake_id = 'any_id';
    const sutSpy = jest.spyOn(sut, 'delete');

    await sut.delete(fake_id);

    expect(sutSpy).toHaveBeenCalled();
    expect(sutSpy).toHaveBeenCalledWith(fake_id);
    expect.assertions(2);
  });

  it('Should call delete service method with  the right arguments', async () => {
    const fake_id = 'any_id';
    const repositorySpy = jest.spyOn(repository, 'delete');

    await sut.delete(fake_id);

    expect(repositorySpy).toHaveBeenCalled();
    expect(repositorySpy).toHaveBeenCalledWith(fake_id);
    expect.assertions(2);
  });

  it('Should return the id of the deleted user', async () => {
    const fake_id = 'any_id';
    const repositorySpy = jest.spyOn(repository, 'delete');

    repositorySpy.mockImplementationOnce(() => new Promise((resolve) => resolve({ id: fake_id })));

    const response = await sut.delete(fake_id);
    expect(response).toEqual({ id: fake_id });
    expect.assertions(1);
  });

  it('Should throw if the id not find the correspondent user', async () => {
    const non_existent_id = 'any_id';
    const findSpy = jest.spyOn(repository, 'find');
    findSpy.mockImplementationOnce(() => new Promise((resolve) => resolve(null)));

    expect(sut.delete(non_existent_id)).rejects.toThrow(NotFoundException);
    expect.assertions(1);
  });

  it('Should call getDetails with the right arguments', async () => {
    const fake_id = 'any_id';
    const sutSpy = jest.spyOn(sut, 'getDetails');

    await sut.getDetails(fake_id);

    expect(sutSpy).toHaveBeenCalled();
    expect(sutSpy).toHaveBeenCalledWith(fake_id);
    expect.assertions(2);
  });

  it('Should call find repository with the right arguments', async () => {
    const fake_id = 'any_id';
    const repositorySpy = jest.spyOn(repository, 'find');
    await sut.getDetails(fake_id);

    expect(repositorySpy).toHaveBeenCalled();
    expect(repositorySpy).toHaveBeenCalledWith({ where: { id: fake_id } }, 'pushRelations');
    expect.assertions(2);
  });

  it('Should return the employee details', async () => {
    const fake_id = 'any_id';
    const fakeEmployee = makeFakeUser();
    const repositorySpy = jest.spyOn(repository, 'find');
    repositorySpy.mockImplementationOnce(() => new Promise((resolve) => resolve(fakeEmployee)));

    const employee_details = await sut.getDetails(fake_id);
    expect(employee_details).toBe(fakeEmployee);
  });

  it('Should call update with the Right arguments', async () => {
    const fake_id = 'any_id';
    const updateData = makeFakeupdateEmployee();
    const findSpy = jest.spyOn(repository, 'find');
    findSpy
      .mockImplementationOnce(() => Promise.resolve(makeFakeUser()))
      .mockImplementationOnce(() => Promise.resolve(null));

    const sutSpy = jest.spyOn(sut, 'update');

    await sut.update(fake_id, updateData);

    expect(sutSpy).toHaveBeenCalled();
    expect(sutSpy).toHaveBeenCalledWith(fake_id, updateData);
  });

  it('Should call find repository method with the right arguments', async () => {
    const fake_id = 'any_id';
    const updateData = makeFakeupdateEmployee();
    const findSpy = jest.spyOn(repository, 'find');
    findSpy
      .mockImplementationOnce(() => Promise.resolve(makeFakeUser()))
      .mockImplementationOnce(() => Promise.resolve(null));

    await sut.update(fake_id, updateData);

    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(2);
  });

  it('Should throw an exception if the updated email already exist on Database', async () => {
    const fake_id = 'any_id';
    const updateData = makeFakeupdateEmployee();
    const findSpy = jest.spyOn(repository, 'find');
    findSpy
      .mockImplementationOnce(() => Promise.resolve(makeFakeUser()))
      .mockImplementationOnce(() => Promise.resolve(makeFakeUser()));

    expect(sut.update(fake_id, updateData)).rejects.toThrow(BadRequestException);
    expect.assertions(1);
  });
});
