import { Test, TestingModule } from "@nestjs/testing";
import { PlaceController } from "./place.controller";
import { PlaceService } from "./place.service";
import { CloudinaryService } from "./cloudinary.service";
import { PlaceModule } from "./place.module";
import { placeType } from "@prisma/client";
import { Express } from "express";

describe("PlaceController testes", () => {
    let controller: PlaceController;
    let placeService: jest.Mocked<PlaceService>;
    let cloudinaryService: jest.Mocked<CloudinaryService>

    beforeEach(async () => {
        const mockPlaceService = {
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as any

        const mockCloudinaryService = {
            uploadImage: jest.fn(),
            deleteImage: jest.fn()
        } as any

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlaceController],
            providers: [
                {provide: PlaceService, useValue: mockPlaceService},
                {provide: CloudinaryService, useValue: mockCloudinaryService}
            ]
        }).compile()

        controller = module.get<PlaceController>(PlaceController);
        placeService = module.get(PlaceService);
        cloudinaryService = module.get(CloudinaryService);
    });

    it("deve listar todos os locais", async () => {
        const places = [
            {
                id: "550e8400-e29b-41d4-a716-446655440000", 
                name: "real lanches",
                type: placeType.RESTAURANTE,
                phone: "(88) 5359-9926",
                latitude: -12344,
                longitude: 12345,
                imagens: ["https://www.google.com/search?sca_esv=bbe24cb31649d4ed&sxsrf=AE3TifNDd3PMQP1hFk3TOUNoJUmT2Bfp8g:1755190839685&udm=2&fbs=AIIjpHxX5k-tONtMCu8aDeA7E5WMlVZjGnBiGIxaghLPqA-PlfgbLKUxiHcJwD8uXnH2piRJ050j0vn26_9l7bhJ4n7QPV-WlaFzA5vaGqRErzXXl-hAEqPG1IUtttCfgvMJG_hYbXMb50KemBeGNQv-kk32JWlgMuElh7afUv4sICSVekLQVK0WB9teW6hWMHsi2elsmORn0k6aiXY6EUk0BTALmUPKBw&q=lanchonete&sa=X&ved=2ahUKEwjcwoy044qPAxU-qJUCHUAXCAAQtKgLegQIGhAB&biw=1707&bih=862&dpr=1.13#vhid=KKNQTIWQgp1-4M&vssid=mosaic"],
                created_at: new Date("2014-08-22")
            },

            {
                id: "550e8400-e29b-41d4-a716-440987678988", 
                name: "Luar do Sertão",
                type: placeType.HOTEL,
                phone: "(88) 5359-9926",
                latitude: -45679876,
                longitude: 3456788,
                imagens: ["https://www.google.com/search?sca_esv=bbe24cb31649d4ed&sxsrf=AE3TifNDd3PMQP1hFk3TOUNoJUmT2Bfp8g:1755190839685&udm=2&fbs=AIIjpHxX5k-tONtMCu8aDeA7E5WMlVZjGnBiGIxaghLPqA-PlfgbLKUxiHcJwD8uXnH2piRJ050j0vn26_9l7bhJ4n7QPV-WlaFzA5vaGqRErzXXl-hAEqPG1IUtttCfgvMJG_hYbXMb50KemBeGNQv-kk32JWlgMuElh7afUv4sICSVekLQVK0WB9teW6hWMHsi2elsmORn0k6aiXY6EUk0BTALmUPKBw&q=lanchonete&sa=X&ved=2ahUKEwjcwoy044qPAxU-qJUCHUAXCAAQtKgLegQIGhAB&biw=1707&bih=862&dpr=1.13#vhid=KKNQTIWQgp1-4M&vssid=mosaic"],
                created_at: new Date("2023-01-01")
            }
        ]

        placeService.findAll.mockResolvedValue(places)

        expect(await controller.findAll()).toEqual(places)
    })

    it("deve listar locais paginados", async () => {
        const limit = 10
        const page = 1
        const result = {
            data: [
            {
                id: "550e8400-e29b-41d4-a716-446655440000", 
                name: "real lanches",
                type: placeType.RESTAURANTE,
                phone: "(88) 5359-9926",
                latitude: -12344,
                longitude: 12345,
                imagens: ["https://www.google.com/search?sca_esv=bbe24cb31649d4ed&sxsrf=AE3TifNDd3PMQP1hFk3TOUNoJUmT2Bfp8g:1755190839685&udm=2&fbs=AIIjpHxX5k-tONtMCu8aDeA7E5WMlVZjGnBiGIxaghLPqA-PlfgbLKUxiHcJwD8uXnH2piRJ050j0vn26_9l7bhJ4n7QPV-WlaFzA5vaGqRErzXXl-hAEqPG1IUtttCfgvMJG_hYbXMb50KemBeGNQv-kk32JWlgMuElh7afUv4sICSVekLQVK0WB9teW6hWMHsi2elsmORn0k6aiXY6EUk0BTALmUPKBw&q=lanchonete&sa=X&ved=2ahUKEwjcwoy044qPAxU-qJUCHUAXCAAQtKgLegQIGhAB&biw=1707&bih=862&dpr=1.13#vhid=KKNQTIWQgp1-4M&vssid=mosaic"],
                created_at: new Date("2023-01-01")
            },

            {
                id: "550e8400-e29b-41d4-a716-440987678988", 
                name: "Luar do Sertão",
                type: placeType.HOTEL,
                phone: "(88) 5359-9926",
                latitude: -45679876,
                longitude: 3456788,
                imagens: ["https://www.google.com/search?sca_esv=bbe24cb31649d4ed&sxsrf=AE3TifNDd3PMQP1hFk3TOUNoJUmT2Bfp8g:1755190839685&udm=2&fbs=AIIjpHxX5k-tONtMCu8aDeA7E5WMlVZjGnBiGIxaghLPqA-PlfgbLKUxiHcJwD8uXnH2piRJ050j0vn26_9l7bhJ4n7QPV-WlaFzA5vaGqRErzXXl-hAEqPG1IUtttCfgvMJG_hYbXMb50KemBeGNQv-kk32JWlgMuElh7afUv4sICSVekLQVK0WB9teW6hWMHsi2elsmORn0k6aiXY6EUk0BTALmUPKBw&q=lanchonete&sa=X&ved=2ahUKEwjcwoy044qPAxU-qJUCHUAXCAAQtKgLegQIGhAB&biw=1707&bih=862&dpr=1.13#vhid=KKNQTIWQgp1-4M&vssid=mosaic"],
                created_at: new Date("2023-01-01")
            }
        ],
        meta: {
        total: 2,
        page: 1,
        lastPage: 1
        }
        }

        placeService.findPaginated.mockResolvedValue(result);

        expect(await controller.findPaginated(page, limit)).toBe(result);
        expect(placeService.findPaginated).toHaveBeenCalledWith(page, limit);

    })

    it("deve criar um novo local", async () => {
        const place = {
                name: "Baron",
                type: placeType.RESTAURANTE,
                phone: "(88) 4002-8922",
                latitude: -12344,
                longitude: 12345,
                created_at: new Date("2023-01-01")
        }
        const files = {
            images: [
                { buffer: Buffer.from('https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088') },
                { buffer: Buffer.from('https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088') }
            ] as Express.Multer.File[]
        }
        const images = [
            'https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088',
            'https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088'
        ]

        cloudinaryService.uploadImage.mockResolvedValueOnce({ url: images[0], public_id: 'image1' });
        cloudinaryService.uploadImage.mockResolvedValueOnce({ url: images[1], public_id: 'image2' });

        placeService.create.mockResolvedValue({
            id: '550e8400-e29b-41d4-a716-446655440000',
            ...place,
            imagens: [
                { public_id: 'image1', url: images[0] },
                { public_id: 'image2', url: images[1] },
            ],
        });

        const result = await controller.createPlace(place, files);

        expect(result).toEqual({
            id: '550e8400-e29b-41d4-a716-446655440000',
            ...place,
            imagens: [
                { public_id: 'image1', url: images[0] },
                { public_id: 'image2', url: images[1] },
            ],
        });

         expect(placeService.create).toHaveBeenCalledWith({
            ...place,
            imagens: [
                { public_id: 'image1', url: images[0] },
                { public_id: 'image2', url: images[1] },
            ],
        });

    })

    it("deve atualizar  um local", async () => {
         const place = {
            name: 'Baron',
            type: placeType.RESTAURANTE,
            phone: '(88) 99999-9999',
            latitude: -3.7327,
            longitude: -38.5267,
        };

         const files = {
            images: [
                { buffer: Buffer.from('https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088') },
                { buffer: Buffer.from('https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088') },
            ] as Express.Multer.File[]
        }

        const imageUrls = [
            'https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088',
            'https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088',
        ];

        cloudinaryService.uploadImage.mockResolvedValueOnce({ url: imageUrls[0], public_id: 'image1' });
        cloudinaryService.uploadImage.mockResolvedValueOnce({ url: imageUrls[1], public_id: 'image2' });

        placeService.update.mockResolvedValue({
            id: '550e8400-e29b-41d4-a716-446655440000',
            ...place,
            imagens: [
                { public_id: 'image1', url: imageUrls[0] },
                { public_id: 'image2', url: imageUrls[1] },
            ],
            created_at: new Date(),
        });

        const result = await controller.updatePlace('550e8400-e29b-41d4-a716-446655440000', place, files);

        expect(result).toEqual({
            id: '550e8400-e29b-41d4-a716-446655440000',
            ...place,
            imagens: [
                { public_id: 'image1', url: imageUrls[0] },
                { public_id: 'image2', url: imageUrls[1] },
            ],
            created_at: expect.any(Date),
        });

        expect(placeService.update).toHaveBeenCalledWith(
            '550e8400-e29b-41d4-a716-446655440000',
            place,
            [Buffer.from('https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088'), Buffer.from('https://www.google.com/search?q=restaurante&sxsrf=AE3TifO_jqNVuCCUg_45pfERRQy7lzSujw%3A1755200754088')]
        );
    })

     it("deve remover um local", async () => {
        const placeId = '550e8400-e29b-41d4-a716-446655440000';

        placeService.delete.mockResolvedValue(undefined);

        await controller.deletePlace(placeId);

        expect(placeService.delete).toHaveBeenCalledWith(placeId);
    });
})