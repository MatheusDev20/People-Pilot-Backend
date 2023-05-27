/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3Service } from '../../src/modules/aws/s3/s3.service';
import { CustomLogger } from '../../src/modules/logger/services/logger.service';
import { FileAppResources } from 'src/@types';
import { Test } from '@nestjs/testing';
import * as helpers from '../../src/modules/aws/helpers';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const makeFileRequest = (): { file: Express.Multer.File; resource: FileAppResources } => {
  return {
    file: {
      encoding: 'image/jpg',
      originalname: 'test.jpg',
      fieldname: 'fieldname-test',
      stream: null,
      destination: 'destination-test',
      path: 'path-test',
      size: 1024,
      filename: 'filename-test',
      buffer: Buffer.from('file content'),
      mimetype: 'image/jpeg',
    },
    resource: 'employee_avatar',
  };
};
const makeSdkInput = (file: Express.Multer.File, resource: FileAppResources): PutObjectCommand => {
  const input = {
    Bucket: 'stx-system',
    Key: helpers.buildS3Path(file.originalname, resource),
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  return new PutObjectCommand(input);
};

describe('S3Service', () => {
  let s3Service: S3Service;
  let logger: CustomLogger;
  let mockedClient: S3Client;

  beforeEach(async () => {
    mockedClient = new S3Client({});
    const moduleRef = await Test.createTestingModule({
      providers: [S3Service, CustomLogger],
    }).compile();

    s3Service = moduleRef.get<S3Service>(S3Service);
    logger = moduleRef.get<CustomLogger>(CustomLogger);
    s3Service.client = mockedClient;
  });

  describe('Persiste file on s3', () => {
    it('Should correctly build the S3 Path for the file', async () => {
      const date = new Date();
      const buildPathSpy = jest.spyOn(helpers, 'buildS3Path');
      const { file, resource } = makeFileRequest();
      const s3Path = helpers.buildS3Path(file.filename, resource);

      expect.assertions(2);
      expect(buildPathSpy).toHaveBeenCalledWith('filename-test', 'employee_avatar');
      expect(s3Path).toEqual(
        `stx-s3-storage-employee_avatar/${date.getFullYear()}/${date.getMonth() + 1}/filename-test`,
      );
    });

    it('Should call persist method with the correct arguments', async () => {
      const persistSpy = jest.spyOn(s3Service, 'persist');
      const { file, resource } = makeFileRequest();
      await s3Service.persist(file, resource);
      expect.assertions(1);
      expect(persistSpy).toHaveBeenCalledWith(file, resource);
    });

    it('Should call send method with the rigth input', async () => {
      const sendSpy = jest.spyOn(mockedClient, 'send');
      const { file, resource } = makeFileRequest();
      const command = makeSdkInput(file, resource);
      await s3Service.persist(file, resource);
      expect(sendSpy).toHaveBeenCalledTimes(1);
    });
  });
});
