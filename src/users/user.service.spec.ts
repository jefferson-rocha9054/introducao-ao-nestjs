

import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

const mockPrisma = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}

describe("UsersService", () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  })

  it("deve criar um usuário", async () => {
    const dto = { name: "jefferson rocha", email: "jeffersonroch72@gmail.com" };
    mockPrisma.user.create.mockResolvedValue(dto);
    const result = await service.create(dto as any);
    expect(result).toEqual(dto);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto });
  })

  it("deve listar todos os usuários", async () => {
    const users = [
      { id: '550e8400-e29b-41d4-a716-446655440000', name: "Bianca Lucas", email: "bia05@gmail.com" },
      { id: '550e8400-e29b-41d4-a716-446655440001', name: "jefferson rocha", email: "jeffersonroch72@gmail.com" },
      { id: '550e8400-e29b-41d4-a716-446655440002', name: "Thayro Holanda", email: "thayrin@gmail.com" },
    ];

    mockPrisma.user.findMany.mockResolvedValue(users);
    const result = await service.findAll();
    expect(result).toEqual(users);
    expect(mockPrisma.user.findMany).toHaveBeenCalled();
  })

  it("deve encontrar um usuário pelo id", async () => {
    const user = { id: '550e8400-e29b-41d4-a716-446655440000', name: "jefferson rocha", email: "jeffersonroch72@gmail.com", };
    mockPrisma.user.findUnique.mockResolvedValue(user);
    const result = await service.findone('550e8400-e29b-41d4-a716-446655440000');
    expect(result).toEqual(user);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    });
  })

  it("deve lançar uma exceção se o usuário não for encontrado", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findone('550e8400-e29b-41d4-a716-4466554404848848')).rejects.toThrow(NotFoundException);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '550e8400-e29b-41d4-a716-4466554404848848' },
    });
  })

  it("deve atualizar um usuário", async () => {
    const dto = { name: "jefferson rocha", email: "jeffersonroch72@gmail.com" };
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const existingUser = { ...dto, id: userId };

    mockPrisma.user.findUnique.mockResolvedValue(existingUser);

    const updatedUser = { ...dto, id: userId };
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const result = await service.update(userId, dto);

    expect(result).toEqual(updatedUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: dto,
    });
  });


  it("deve remover um usuário", async () => {
    const user = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: "jefferson rocha",
      email: "jeffersonroch72@gmail.com",

    };

    mockPrisma.user.delete.mockResolvedValue(user);

    const result = await service.remove('550e8400-e29b-41d4-a716-446655440000');

    expect(result).toEqual(user);
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    });
  });
})








