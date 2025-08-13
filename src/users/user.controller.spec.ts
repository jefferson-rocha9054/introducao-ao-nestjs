import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { create } from "domain";
import { Module } from "@nestjs/common";
import { IsEmail } from "class-validator";

const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findone: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}
describe("user controller Tests", () =>{
    let controller: UsersController

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {provide: UsersService, useValue: mockUserService},
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController)
    })

    it('deve listar todos os usuarios', async () => {
        const users = [
            {name: "Jefferson", email: "jeffer@gmail.com"},
            {name: "Romero", email: "romero@gmail.com"}
        ]

        mockUserService.findAll.mockResolvedValue(users)

        expect(await controller.findAll()).toEqual(users)
    })

    it('deve encontra o usuario pelo id', async () => {
        const user = {id: "550e8400-e29b-41d4-a716-446655440000", name: "Jefferson", email: "jeffer@gmail.com"}

        mockUserService.findone.mockResolvedValue(user)

        const result = await controller.find("550e8400-e29b-41d4-a716-446655440000")

        expect(result).toEqual(user)
    })

    it('deve atualizar um usuario', async () => {
        const dto = {name: "Jefferson", email: "jefferson@gmail.com"}
        const updateUser = {...dto, id: "550e8400-e29b-41d4-a716-446655440000"}

        mockUserService.update.mockResolvedValue(updateUser)

        const result = await controller.update("550e8400-e29b-41d4-a716-446655440000", dto)

        expect(result).toEqual(updateUser)
    })

    it('deve remove o usuario', async () => {
        const user = {id: "550e8400-e29b-41d4-a716-446655440000", name: "Jefferson", email: "jeffer@gmail.com"}

        mockUserService.remove.mockResolvedValue(user)

        const result = await controller.remove("550e8400-e29b-41d4-a716-446655440000")

        expect(result).toEqual(user)
    })

})